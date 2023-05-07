const kafka = require('kafka-node');
const {connectToDatabase} = require("./config/database")
const HistoryService = require("./service/history.service")
const kafka_host = process.env.KAFKA_HOST
const retry = require('retry');

// Define the retry options
const retryOptions = {
  retries: 5, // maximum number of retries
  factor: 3, // exponential backoff factor
  minTimeout: 2000, // minimum delay before retrying
  maxTimeout: 10000, // maximum delay before retrying
  randomize: true // randomize the delay between retries
};


async function initialize() {
    const connected = await connectToDatabase();
    //const update = { $set: { status: 'completed' , result: "h" } };
    //result = await HistoryService.updateHistory("6451837e85a04ba4aeb1a5ac",update)
}

initialize()

const kafkaClient = new kafka.KafkaClient({ kafkaHost: kafka_host });
const consumer = new kafka.Consumer(kafkaClient, [{ topic: 'completed-tasks', partition: 0 }]);



consumer.on('message', async function (message) {

    try {
        var task = JSON.parse(message.value);
        const update = { $set: { status: task.status, result: task.result } };
        result = await HistoryService.updateHistory(task.id,update)
      } catch (error) {
        console.error(error)
        return false
      }    
    console.log('Received task:', task);

});

consumer.on('error', function (err) {
  console.log('Kafka consumer error:', err);
  if (err.name === 'TopicsNotExistError' || err.name === ('BrokerNotAvailableError' || 'NestedError')) {
    console.log('Retrying operation...');
    
    const operation = function(callback) {
      consumer.addTopics([{ topic: 'completed-tasks', partition: 0 }], function (err, added) {
        if (err) {
          console.log('Error adding topics:', err);
          callback(err);
        } else {
          console.log('Topic added:', added);
          callback(null, added);
        }
      });
    };
    
    const retryOperation = retry.operation(retryOptions);
    
    retryOperation.attempt(function(currentAttempt) {
      console.log(`Attempt ${currentAttempt}`);
      operation(function(err, result) {
        if (err) {
          console.log(`Retry operation failed after ${currentAttempt} attempts:`, err);
          if (retryOperation.retry(err)) {
            console.log('Retrying operation...');
            return;
          }
        } else {
          console.log(`Operation succeeded after ${currentAttempt} attempts.`);
        }
      });
    });
  }
});
