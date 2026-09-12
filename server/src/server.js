import app from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`TaskFlow API Server running in [${config.nodeEnv}] mode on port ${config.port}`);
    console.log(`Health Check: http://localhost:${config.port}/api/health`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`💥 UNHANDLED REJECTION! Shutting down...`, err);
    server.close(() => {
      process.exit(1);
    });
  });

  // Handle SIGTERM signal
  process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down gracefully...');
    server.close(() => {
      console.log(' Process terminated!');
    });
  });
};

startServer();
