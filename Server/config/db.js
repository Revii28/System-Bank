require('dotenv').config();

const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME || 'System-Bank';

if (!uri) {
  throw new Error('MONGO_URI is not defined in the environment variables');
}

const client = new MongoClient(uri);

let db = null;

async function connectDB() {
  if (!db) {
    try {
      await client.connect();
      db = client.db(dbName);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error; 
    }
  }
  return db;
}

module.exports = { connectDB };
