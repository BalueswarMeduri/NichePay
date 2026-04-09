const axios = require('axios');

async function checkCloudAMQP() {
  try {
    const cloudAmqpApi = 'https://puffin.rmq2.cloudamqp.com/api/queues/anbqwtzw/notification.disruption';
    const authHeader = 'Basic YW5icXd0enc6RlZnWkhBNVRzVzFtZWUwY1RKYkNTdmEzbVg2MXdQYnQ='; 

    const connRes = await axios.get('https://puffin.rmq2.cloudamqp.com/api/connections', {
      headers: { Authorization: authHeader }
    });
    
    connRes.data.forEach(c => {
      console.log(`Connection from IP: ${c.host} | User: ${c.user} | Client: ${c.client_properties.product}`);
    });
    
  } catch (err) {
    console.error(err.message);
  }
}
checkCloudAMQP();
