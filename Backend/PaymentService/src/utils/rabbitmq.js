const amqp = require('amqplib');

let connection;
let channel;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    
    console.log('🐇 RabbitMQ Connected');
    
    // Setup Exchange
    const exchange = 'events';
    await channel.assertExchange(exchange, 'topic', { durable: true });

    // Setup Dead Letter Exchange
    const dlxExchange = 'events.dlx';
    await channel.assertExchange(dlxExchange, 'topic', { durable: true });

    // Setup Queues with DLQ binding
    const setupQueue = async (queueName, routingKey) => {
      const dlqName = `${queueName}.dlq`;
      
      // Assert DLQ
      await channel.assertQueue(dlqName, { durable: true });
      await channel.bindQueue(dlqName, dlxExchange, routingKey);

      // Assert Main Queue
      await channel.assertQueue(queueName, { 
        durable: true,
        deadLetterExchange: dlxExchange,
        deadLetterRoutingKey: routingKey
      });
      await channel.bindQueue(queueName, exchange, routingKey);
    };

    await setupQueue('subscription.purchase.queue', 'subscription.purchase');
    await setupQueue('claim.approved.queue', 'claim.approved');

  } catch (error) {
    console.error('❌ RabbitMQ Connection Error', error);
    process.exit(1);
  }
};

const getChannel = () => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  return channel;
};

const publishEvent = async (routingKey, message) => {
  try {
    const ch = getChannel();
    const exchange = 'events';
    
    const msgString = JSON.stringify(message);
    const published = ch.publish(exchange, routingKey, Buffer.from(msgString), {
      persistent: true
    });
    
    if (published) {
      console.log(`📤 Published event to ${routingKey}`, { eventId: message.eventId || message.type });
    } else {
      console.error(`Failed to publish event to ${routingKey}`);
    }
  } catch (error) {
    console.error(`Error publishing event to ${routingKey}`, error);
  }
};

module.exports = { connectRabbitMQ, getChannel, publishEvent };
