const { Kafka,Partitioners } = require('kafkajs');
const kafka_host = process.env.KAFKA_HOST
const kafka = new Kafka({
  clientId: 'rest-api',
  brokers: [kafka_host],
});

const producer = kafka.producer({createPartitioner: Partitioners.LegacyPartitioner});

module.exports = producer;