const axios = require('axios');

async function checkCloudAMQP() {
  try {
    const cloudAmqpApi = 'https://puffin.rmq2.cloudamqp.com/api/queues/anbqwtzw/notification.disruption';
    const authHeader = 'Basic YW5icXd0enc6RlZnWkhBNVRzVzFtZWUwY1RKYkNTdmEzbVg2MXdQYnQ='; // base64 of anbqwtzw:FVgZHA5TsW1mee0cTJbCSva3mX61wPbt

    const res = await axios.get(cloudAmqpApi, {
      headers: { Authorization: authHeader }
    });
    
    console.log("Total messages:", res.data.messages);
    console.log("Unacked messages:", res.data.messages_unacknowledged);
    console.log("Ready messages:", res.data.messages_ready);
    console.log("Consumers:", res.data.consumers);
    
    // Check connections
    const connRes = await axios.get('https://puffin.rmq2.cloudamqp.com/api/connections', {
      headers: { Authorization: authHeader }
    });
    console.log(`Open connections total: ${connRes.data.length}`);
    
  } catch (err) {
    console.error(err.message);
  }
}
checkCloudAMQP();
