const { getChannel } = require('../config/rabbitmq');
const handlePaymentSuccess = require('../handlers/paymentHandler');
const handleFloodAlert = require('../handlers/floodAlertHandler');
const handleClaimApproved = require('../handlers/claimHandler');

const QUEUE_NAME = 'notification_queue';
const EXCHANGE_NAME = 'notification_exchange';

const startConsumer = async () => {
  try {
    const channel = getChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    
    // Bind queue to the exchange
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'PAYMENT_SUCCESS');
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'FLOOD_ALERT');
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'CLAIM_APPROVED');

    console.log(`🎧 Waiting for messages in [${QUEUE_NAME}]`);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        const routingKey = msg.fields.routingKey;
        const data = JSON.parse(msg.content.toString());

        console.log(`📩 Received Event: [${routingKey}]`);
        
        try {
          switch (routingKey) {
            case 'PAYMENT_SUCCESS':
              await handlePaymentSuccess(data);
              break;
            case 'FLOOD_ALERT':
              await handleFloodAlert(data);
              break;
            case 'CLAIM_APPROVED':
              await handleClaimApproved(data);
              break;
            default:
              console.warn(`⚠️ Unhandled routing key: ${routingKey}`);
          }
          channel.ack(msg);
        } catch (err) {
          console.error(`❌ Error processing message [${routingKey}]:`, err.message);
          // Optional: Reject & Requeue -> channel.nack(msg, false, false);
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (error) {
    console.error('❌ Failed to start consumer:', error.message);
  }
};

module.exports = {
  startConsumer,
};
