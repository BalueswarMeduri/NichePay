const axios = require('axios');

async function checkCloudAMQP() {
  try {
    const authHeader = 'Basic YW5icXd0enc6RlZnWkhBNVRzVzFtZWUwY1RKYkNTdmEzbVg2MXdQYnQ='; 

    const res = await axios.get('https://puffin.rmq2.cloudamqp.com/api/queues', {
      headers: { Authorization: authHeader }
    });
    
    res.data.forEach(q => {
      console.log(`Queue: ${q.name.padEnd(25)} | Consumers: ${q.consumers} | Messages: ${q.messages}`);
    });
    
  } catch (err) {
    console.error(err.message);
  }
}
checkCloudAMQP();
