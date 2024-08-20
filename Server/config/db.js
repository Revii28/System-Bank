require('dotenv').config();

const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error('MONGO_URI is not defined in the environment variables')
}

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = null;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db('System-Bank');
  }
  return db;
}

module.exports = { connectDB };
