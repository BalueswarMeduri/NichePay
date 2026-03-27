const amqp = require('amqplib');

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  try {
    const rabbitMQUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    connection = await amqp.connect(rabbitMQUrl);
    channel = await connection.createChannel();
    
    // Assert exactly what we need
    await channel.assertExchange('notification_exchange', 'topic', { durable: true });
    console.log('✅ Connected to RabbitMQ & Exchange asserted');
    return channel;
  } catch (error) {
    console.error('❌ RabbitMQ Connection Error:', error.message);
    setTimeout(connectRabbitMQ, 5000); // Retry after 5 seconds
  }
};

const getChannel = () => {
  if (!channel) {
    throw new Error('RabbitMQ Channel is not initialized');
  }
  return channel;
};

module.exports = {
  connectRabbitMQ,
  getChannel,
};
