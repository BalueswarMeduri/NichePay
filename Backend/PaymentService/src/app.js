require('dotenv').config();
const express = require('express');
const { connectDB } = require('./utils/db');
const { connectRedis } = require('./utils/redis');
const { connectRabbitMQ } = require('./utils/rabbitmq');

const { startPaymentConsumer } = require('./consumers/payment.consumer');
const { startClaimConsumer } = require('./consumers/claim.consumer');

async function startServer() {
  try {
    // 1. Core Infrastructure Initialization
    await connectDB();
    await connectRedis();
    await connectRabbitMQ();
    
    // 2. Start Message Consumers
    await startPaymentConsumer();
    await startClaimConsumer();

    // 3. Start Express App
    const app = express();
    app.use(express.json());

    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK', service: 'Payment Service' });
    });

    const port = process.env.PORT || 3000;
    
    // Explicitly binding to 0.0.0.0 is best practice for Docker containers
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Payment Service running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // 4. Graceful Shutdown
    const shutdown = async () => {
      console.log('Graceful shutdown initiated...');
      server.close();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
