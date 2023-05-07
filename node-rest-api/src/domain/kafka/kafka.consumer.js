const { Kafka } = require('kafkajs');
const kafka_host = process.env.KAFKA_HOST
const kafka = new Kafka({
  clientId: 'rest-api',
  brokers: [kafka_host],
});

const consumer = kafka.consumer({ groupId: '0' });

/**
 *  Start consuming messages from the latest offset.
 *  Set fromBeginning: true, the consumer will start consuming from the earliest offset.
 */
consumer.subscribe({
  topic: 'completed-tasks',
  fromBeginning: false,
});

module.exports = consumer;