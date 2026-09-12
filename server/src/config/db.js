import mongoose from 'mongoose';
import { config } from './env.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log('⚡ Using existing MongoDB connection');
    return;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Connection Error: ${error.message}`);
    console.warn(` Running in standalone mode. DB operations will retry when MongoDB is available.`);
    isConnected = false;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB connection lost. Attempting reconnect...');
  isConnected = false;
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB connection re-established.');
  isConnected = true;
});

export const checkDBStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};
