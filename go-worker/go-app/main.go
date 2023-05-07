package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"time"

	"github.com/Shopify/sarama"
	"github.com/cenkalti/backoff"

	apigames "microservice-steam-games/data"
	gen "microservice-steam-games/generators"
)

// getGamesChart retrieves a chart based on the specified search term, limit, and generate function.
func getGamesChart(searchTerm string, limit int) (string, error) {
	games, err := apigames.GetGames(searchTerm, "", limit, false)
	if err != nil {
		return "", fmt.Errorf("failed to retrieve games: %w", err)
	}
	chart := gen.GenerateChart(games)
	return chart, nil
}

func getEnv(key string) (string, bool) {
	val, ok := os.LookupEnv(key)
	if !ok {
		log.Printf("%s not set\n", key)
	}
	return val, ok
}

type Task struct {
	ID     string `json:"id"`
	Title  string `json:"title"`
	Item   string `json:"name_item"`
	TaskID string `json:"task_id"`
	Status string `json:"status"`
	Result string `json:"result"`
}

func main() {
	KAFKA_HOST, _ := getEnv("KAFKA_HOST")
	// Set up Kafka consumer
	config := sarama.NewConfig()
	config.Consumer.Offsets.AutoCommit.Interval = 1 * time.Minute
	config.Consumer.MaxWaitTime = 10 * time.Second
	config.Consumer.Return.Errors = true
	config.Consumer.Group.Rebalance.Strategy = sarama.BalanceStrategySticky
	config.Consumer.Offsets.Initial = sarama.OffsetOldest
	config.Consumer.Offsets.AutoCommit.Enable = true

	// Define the retry options
	retryOptions := backoff.NewExponentialBackOff()
	retryOptions.InitialInterval = time.Second
	retryOptions.Multiplier = 2
	retryOptions.MaxInterval = 60 * time.Second
	retryOptions.MaxElapsedTime = 2 * time.Minute

	var err error
	var consumer sarama.Consumer
	//consumer, err := sarama.NewConsumer([]string{KAFKA_HOST}, config)
	//consumer.MarkOffset(msg, "")
	//if err != nil {
	//	log.Fatalln(err)
	//}
	//log.Println("Connected")
	//defer consumer.Close()
	// Use a retry loop to create the consumer
	err = backoff.Retry(func() error {
		consumer, err = sarama.NewConsumer([]string{KAFKA_HOST}, config)
		if err != nil {
			log.Printf("Error creating Kafka consumer: %v", err)
			return err
		}
		return nil
	}, retryOptions)

	log.Println("Kafka consumer connected successfully")

	if err != nil {
		log.Fatalf("Could not create Kafka consumer after %d retries: %v", retryOptions.MaxElapsedTime/retryOptions.InitialInterval, err)
	}

	defer func() {
		if err := consumer.Close(); err != nil {
			log.Printf("Error closing Kafka consumer: %v", err)
		}
	}()

	// Set up Kafka producer
	producerConfig := sarama.NewConfig()
	config.Producer.Retry.Max = 5
	producerConfig.Producer.RequiredAcks = sarama.WaitForAll
	producerConfig.Producer.Return.Successes = true

	producer, err := sarama.NewSyncProducer([]string{KAFKA_HOST}, producerConfig)
	if err != nil {
		log.Fatalln(err)
	}
	defer producer.Close()

	// Subscribe to Kafka topic
	topic := "pending-tasks"
	// OffsetNewest: Only consume new messages that appear after the consumer has joined the cluster.
	partitionConsumer, err := consumer.ConsumePartition(topic, 0, sarama.OffsetNewest)
	// sarama.OffsetOldest: The consumer will start consuming data for a topic starting from the earliest message that is available.
	if err != nil {
		log.Fatalln(err)
	}
	defer partitionConsumer.Close()

	// Handle Kafka messages
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt)

	doneCh := make(chan struct{})
	consumeCh := make(chan *sarama.ConsumerMessage)

	go func() {
		for {
			select {
			case msg := <-partitionConsumer.Messages():
				consumeCh <- msg
			case err := <-partitionConsumer.Errors():
				log.Println(err)
			case <-signals:
				doneCh <- struct{}{}
			}
		}
	}()

	for {
		select {
		case msg := <-consumeCh:
			var task Task
			err := json.Unmarshal(msg.Value, &task)
			if err != nil {
				log.Println(err)
			} else {
				log.Println(task)
				limit := 50
				chart, err := getGamesChart(task.Item, limit)
				if err != nil {
					log.Printf("failed to generate chart: %v", err)
					return
				}
				task.Result = chart
				task.Status = "completed"

				// Encode task as a JSON byte slice
				taskBytes, err := json.Marshal(task)
				if err != nil {
					log.Println(err)
					continue
				}
				outputMsg := &sarama.ProducerMessage{
					Topic: "completed-tasks",
					Value: sarama.StringEncoder(taskBytes),
				}
				partition, offset, err := producer.SendMessage(outputMsg)

				if err != nil {
					log.Println(err)
				} else {
					log.Printf("Sent message to partition %d at offset %d\n", partition, offset)
				}

			}
		case <-signals:
			//the reception of data from this channel isn't covered.
			doneCh <- struct{}{}
		}
	}
}
