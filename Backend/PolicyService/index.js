const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5002; // Using 5002 so it doesn't conflict with Auth (5001) or DummyZomato (5000)

app.use(cors());
app.use(express.json());

const amqp = require('amqplib');

// RabbitMQ publisher setup
let channel;
const connectRabbitMQ = async () => {
  try {
    const amqpServer = "amqps://niznqkqk:ntvjVsRPCbeKxhWLpfegfQwqT0xn3HtN@puffin.rmq2.cloudamqp.com/niznqkqk";
    const connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    
    // Match the exact AssertQueue config from PaymentService to prevent PRECONDITION_FAILED
    await channel.assertQueue('subscription.purchase.queue', { 
      durable: true,
      deadLetterExchange: 'events.dlx',
      deadLetterRoutingKey: 'subscription.purchase'
    });
    
    console.log('✅ Connected to RabbitMQ on CloudAMQP from Policy Service');
  } catch (error) {
    console.error('❌ Failed to connect to RabbitMQ from Policy Service:', error.message);
  }
};
connectRabbitMQ();

// Main Policy Service Route to Fetch Driver Profile
app.get('/api/policy/profile/:partnerId', async (req, res) => {
  try {
    const { partnerId } = req.params;

    // Fetch details from DummyZomato Service
    const zomatoResponse = await axios.get(`http://localhost:5000/api/partners/profile/${partnerId}`);

    // If successful, pass the response data back to the User Dashboard
    res.status(200).json(zomatoResponse.data);
  } catch (error) {
    console.error("PolicyService Profile Error:", error.response?.data || error.message);
    
    // Pass along whatever error the DummyZomato API sent, or a generic 500
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: "Internal Policy Service Error" });
    }
  }
});

// Endpoint to select a plan and push to Payment queue
app.post('/api/policy/select-plan', async (req, res) => {
  try {
    const { partnerId, planName, amount, email } = req.body;
    
    if (!partnerId || !planName || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const event = {
      eventId: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId: partnerId,
      email: email || 'driver@nichepay.com', // fallback
      plan: planName,
      amount: amount
    };

    if (channel) {
      channel.sendToQueue(
        'subscription.purchase.queue',
        Buffer.from(JSON.stringify(event)),
        { persistent: true }
      );
      console.log(`📡 Event pushed to Payment Queue for user: ${partnerId}`);
      res.status(200).json({ message: "Plan selected successfully, payment initiated.", eventId: event.eventId });
    } else {
      res.status(500).json({ message: "Message Queue is unavailable." });
    }
  } catch (error) {
    console.error("Failed to select plan:", error);
    res.status(500).json({ message: "Failed to process plan selection" });
  }
});

app.listen(PORT, () => {
  console.log(`🛡️ Policy Service is running on port ${PORT}`);
});
