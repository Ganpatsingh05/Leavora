const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  try {
    // Try the configured URI first (e.g. Atlas or local mongod)
    const uri = process.env.MONGO_URI;
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (_) {
      console.log('Local/remote MongoDB not reachable, starting in-memory server...');
    }

    // Fall back to in-memory MongoDB (dev only)
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      const memUri = mongoServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`MongoDB In-Memory Connected: ${conn.connection.host}`);
      console.log('⚠  Data will be lost when the server stops.');
    } catch (memErr) {
      console.error('mongodb-memory-server not available. Install it as a dev dependency or provide a valid MONGO_URI.');
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const isMemoryDB = () => !!mongoServer;

module.exports = { connectDB, isMemoryDB };
