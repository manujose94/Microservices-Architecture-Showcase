const producer = require('./kafka.producer');
const consumer = require('./kafka.consumer');
const historyRepository = require('../repositories/history.repository');

async function sendToKafka(payload) {
  try {
    await producer.connect();
    await producer.send({
      topic: 'pending-tasks',
      messages: [payload],
    });
  } catch (error) {
    console.error('Error sending message to Kafka:', error);
  } finally {
    await producer.disconnect();
  }
}

async function runConsumer() {
  await consumer.connect();

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value} from topic ${topic} and partition ${partition}`);
    },
  });
}

async function runConsumerHistory() {
  await consumer.connect();

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const taskMessage = JSON.parse(message.value);
      console.log('Received taskMessage:', taskMessage);
      console.log(`Received message from topic ${topic} and partition ${partition}`);
      historyRepository.updateHistory(taskMessage.task_id,{status:"completed", result: taskMessage.result})
    },
  });
}


module.exports = { sendToKafka, runConsumerHistory };