require('dotenv').config();
const app = require('./src/app');
const { connectRabbitMQ } = require('./src/config/rabbitmq');
const { startConsumer } = require('./src/consumer/notificationConsumer');

const PORT = process.env.PORT || 3004;

const startServer = async () => {
  try {
    await connectRabbitMQ();
    await startConsumer();

    app.listen(PORT, () => {
      console.log(`🚀 Notification Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle basic uncaught errors gracefully without crashing wildly
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

startServer();
