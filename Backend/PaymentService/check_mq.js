const amqp = require('amqplib');

const url = 'amqps://anbqwtzw:FVgZHA5TsW1mee0cTJbCSva3mX61wPbt@puffin.rmq2.cloudamqp.com/anbqwtzw?heartbeat=60';

async function checkConsumers() {
  try {
    const conn = await amqp.connect(url);
    const channel = await conn.createChannel();
    
    const q1 = await channel.checkQueue('notification.disruption');
    console.log("Queue 'notification.disruption' stats:", q1);
    
    const q2 = await channel.checkQueue('payment.disruption');
    console.log("Queue 'payment.disruption' stats:", q2);
    
    await channel.close();
    await conn.close();
  } catch (err) {
    console.error(err);
  }
}

checkConsumers();
