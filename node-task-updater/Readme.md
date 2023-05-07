# Node Task Updater

This is a Node.js application that listens for messages from a Kafka topic and updates task histories in a MongoDB database based on the messages received.

## Requirements

- Node.js (v12.0 or later)
- MongoDB (v4.0 or later)
- Kafka (v1.0 or later)

## Installation

1. Clone the repository from GitHub:

   ```bash
   git clone https://github.com/manujose94/Microservices-Architecture-Showcase.git
   ```

2. Install the application dependencies using npm:

   ```bash
   cd ./Microservices-Architecture-Showcase/node-task-updater
   npm install
   ```

3. Set environment variables for the Kafka connection string and MongoDB connection string:

   ```bash
   export KAFKA_HOST="your_kafka_host:9092"
   export MONGODB_URI="mongodb://your_mongodb_host:27017/your_database_name"
   ```

4. Start the application using npm:

   ```bash
   npm start
   ```

   This will start the Kafka consumer and connect to the MongoDB database.

## Configuration

The following environment variables can be used to configure the application:

- `KAFKA_HOST`: The Kafka connection string, in the format `your_kafka_host:9092`.
- `MONGODB_URI`: The MongoDB connection string, in the format `mongodb://your_mongodb_host:27017/your_database_name`.


## Libraries

Three libraries used in the `node-task-updater` app:

- `kafka-node`: A Node.js client for Apache Kafka that allows you to interact with Kafka brokers to produce and consume messages. It provides a high-level API for working with Kafka topics, partitions, and messages.

- `mongoose`: A Node.js object modeling library for MongoDB that provides a straightforward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, and hooks for easy data manipulation.

- `retry`: A library that provides a simple way to retry operations that may fail due to network or other errors. It allows you to specify a function to retry, the maximum number of times to retry, and a delay between retries. It can be used to add resilience to network operations and improve the reliability of your application.