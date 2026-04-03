const express = require('express');
const axios = require('axios');
const cors = require('cors');
const amqp = require('amqplib');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// RabbitMQ publisher setup
let channel;

const connectRabbitMQ = async () => {
  try {
    const amqpServer = "amqps://anbqwtzw:FVgZHA5TsW1mee0cTJbCSva3mX61wPbt@puffin.rmq2.cloudamqp.com/anbqwtzw?heartbeat=60";
    const connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();

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

// ✅ Fetch Driver Profile
app.get('/api/policy/profile/:partnerId', async (req, res) => {
  try {
    const { partnerId } = req.params;

    const zomatoResponse = await axios.get(
      `http://localhost:5000/api/partners/profile/${partnerId}`
    );

    res.status(200).json(zomatoResponse.data);

  } catch (error) {
    console.error("PolicyService Profile Error:", error.response?.data || error.message);

    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: "Internal Policy Service Error" });
    }
  }
});

// ✅ Get user's active insurance plan (kept from final)
app.get('/api/policy/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const paymentRes = await axios.get(
      `http://localhost:5003/api/payments/status/${userId}`
    );

    const { hasPlan, plan } = paymentRes.data;

    if (!hasPlan) {
      return res.status(404).json({ message: 'No active policy found' });
    }

    // Map plan → daily wage
    const wageMap = {
      'Basic': 400,
      'Standard': 600,
      'Pro Shield': 800,
      'Premium': 1000
    };

    const dailyWage = wageMap[plan] || 600;

    res.status(200).json({
      planName: plan,
      dailyWage,
      status: 'Active'
    });

  } catch (error) {
    console.error("PolicyService User Policy Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch policy" });
  }
});

// ✅ Select plan → push to RabbitMQ
app.post('/api/policy/select-plan', async (req, res) => {
  try {
    const { partnerId, planName, amount, email } = req.body;

    if (!partnerId || !planName || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const event = {
      eventId: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId: partnerId,
      email: email || 'driver@nichepay.com',
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

      res.status(200).json({
        message: "Plan selected successfully, payment initiated.",
        eventId: event.eventId
      });

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