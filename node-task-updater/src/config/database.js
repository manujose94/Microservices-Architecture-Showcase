// src/config/database.js

const mongoose = require("mongoose");

const MONGODB_URI=process.env.MONGODB_URI

mongoose.Promise = global.Promise;


async function connectToDatabase(retries = 5, interval = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(MONGODB_URI)
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to database");

      return true;
    } catch (err) {
      console.error(
        `Failed to connect to database: attempt ${i + 1} of ${retries}`
      );
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
  console.error(`Failed to connect to database after ${retries} attempts`);
  return false;
}

module.exports = {
  connectToDatabase
};


/**
 * async function main(){
    let client, db;
    try{
       client = await MongoClient.connect(MONGODB_URI, options);
       const db = client.db('mydb');
       const tasksCollection = db.collection('historyschemas');
       let result = await tasksCollection.find().toArray();
       const filter = { _id: new ObjectId("6451837e85a04ba4aeb1a5ac") };
       const update = { $set: { status: 'completed' , result: "" } };
       const updated = await tasksCollection.updateOne(filter, update);
       console.log('Document updated!', updated.modifiedCount);
       console.log(result)
    
    }catch(err){ 
        console.error("error"+err); 
    } // catch any mongo error here
    finally{ 
        //client.close(); 
    } // make sure to close your connection after
   }
 */