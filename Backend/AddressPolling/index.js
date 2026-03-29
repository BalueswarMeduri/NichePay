const express = require('express');
const amqp = require('amqplib');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let channel;

const setupRabbitMQ = async () => {
    try {
        const url = 'amqps://anbqwtzw:FVgZHA5TsW1mee0cTJbCSva3mX61wPbt@puffin.rmq2.cloudamqp.com/anbqwtzw?heartbeat=60';
        const conn = await amqp.connect(url);
        conn.on("error", (err) => console.error("RabbitMQ Connection Abrupt Error:", err));
        
        channel = await conn.createChannel();
        channel.on("error", (err) => console.error("RabbitMQ Channel Abrupt Error:", err));
        
        await channel.assertQueue('location.update', { durable: true });
        console.log('✅ AddressPolling connected to RabbitMQ (CloudAMQP)');
    } catch (err) {
        console.error('❌ RabbitMQ AddressPolling connection error:', err);
    }
};
setupRabbitMQ();

// Endpoint to receive tracking/location data securely
app.post('/api/address/update', (req, res) => {
    const { userId, lat, lng, pincode, data } = req.body;
    
    if (!userId || !lat || !lng) {
        return res.status(400).json({ error: "Missing required location data" });
    }

    const payload = {
        userId,
        lat,
        lng,
        pincode: pincode || "000000",
        date: req.body.date || "2026-03-18",
        extraData: data || {}
    };

    if (channel) {
        channel.sendToQueue('location.update', Buffer.from(JSON.stringify(payload)), { persistent: true });
        console.log(`📍 Location queued to ML service for user ${userId}`);
        res.status(200).json({ success: true, message: "Location updated to ML Queue" });
    } else {
        res.status(500).json({ error: "Message Queue is offline" });
    }
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
    console.log(`🚀 AddressPolling Service running on port ${PORT}`);
});
