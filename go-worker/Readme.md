# Worker Consumer-Producer

This Go code subscribes to a Kafka topic ("pending-tasks"), listens for incoming messages, and processes them based on the received data. The processed message is then published to another Kafka topic ("completed-tasks") using a Kafka producer.

## Dependencies

- `"github.com/Shopify/sarama"`
- `"github.com/cenkalti/backoff"`
- `"microservice-steam-games/data"`
- `"microservice-steam-games/generators"`

## How to run

To include the code in the "How to Run" chapter of your README.md file, you can provide step-by-step instructions on how to compile and run the code. Here's an example of what you could include:

## How to Run

1. Clone the repository:

   ```bash
   git clone https://github.com/manujose94/Microservices-Architecture-Showcase.git
   cd ./Microservices-Architecture-Showcase/go-worker
   ```

2. Install the required dependencies:

   ```bash
   go mod download
   ```

3. Set the `KAFKA_HOST` environment variable to the address of your Kafka broker:

   ```bash
   export KAFKA_HOST="localhost:9092"
   ```

4. Build the project:

   ```bash
   go build
   ```

5. Run the project:

   ```bash
   ./your-repo
   ```

   The program should connect to your Kafka broker and begin consuming messages from the "pending-tasks" topic. It will generate a chart based on each message it receives and produce a new message with the chart data in the "completed-tasks" topic.

   Press `Ctrl+C` to stop the program.

You can modify the instructions to fit your specific use case and provide additional information if necessary. Remember to provide clear and concise instructions to make it easy for others to run your code.

1. Install Go and set up the environment. Exist a script named golang_setup.sh
2. Install Kafka and set up a broker.
3. Clone the repository and navigate to the `main.go` file directory.
4. Set up the environment variables - `KAFKA_HOST`.
5. Run the command `go run main.go` to run the program.

## Code Overview

1. `getGamesChart()` function retrieves a chart based on the specified search term, limit, and generate function. More information about chart result in the following sub-section

2. `getEnv()` function retrieves environment variables.

3. `Task` is a struct with properties - `ID, Title, Item, TaskID, Status, Result`.

4. `main()` function creates a Kafka consumer to consume messages from the "pending-tasks" topic. If the consumer fails, it retries after a certain duration using `backoff`.

5. It creates a Kafka producer to publish processed messages to the "completed-tasks" topic.

6. It subscribes to the "pending-tasks" topic and listens for incoming messages.

7. When a message is received, it processes it by decoding it from JSON format to the `Task` struct, generates a chart based on the specified search term, and sets the chart as the result. The status is also updated to "completed". 

8. The updated `Task` struct is then encoded back to JSON format and published to the "completed-tasks" topic using the Kafka producer.

### Chart result of task

To obtain the results of the games, a free API called [CheapShark](https://www.cheapshark.com) is used.

Your result is embedded into a graph using the Chart.js library and compressed via HTML Minifier. Here the result of task:

[Charts of prices games](../docs/result_task_worker.png)