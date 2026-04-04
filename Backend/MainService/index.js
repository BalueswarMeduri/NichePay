const express = require('express');
const amqp = require('amqplib');
const axios = require('axios');

const app = express();
const PORT = 5005;

let channel;

const connectQueue = async () => {
    try {
        const url = process.env.RABBITMQ_URL || 'amqps://anbqwtzw:FVgZHA5TsW1mee0cTJbCSva3mX61wPbt@puffin.rmq2.cloudamqp.com/anbqwtzw?heartbeat=60';
        const conn = await amqp.connect(url);
        conn.on("error", (err) => console.error("RabbitMQ Connection Error:", err));
        
        channel = await conn.createChannel();
        channel.on("error", (err) => console.error("RabbitMQ Channel Error:", err));
        
        await channel.assertQueue('ml.disruptions.processed', { durable: true });
        
        // Setup Pub/Sub for Payout Events
        await channel.assertExchange('disruption_payout_fanout', 'fanout', { durable: true });
        await channel.assertQueue('notification.disruption', { durable: true });
        await channel.assertQueue('payment.disruption', { durable: true });
        
        // Bind them for Pub/Sub
        await channel.bindQueue('notification.disruption', 'disruption_payout_fanout', '');
        await channel.bindQueue('payment.disruption', 'disruption_payout_fanout', '');

        console.log('✅ MainService connected to RabbitMQ (CloudAMQP) - Pub/Sub Ready');
        
        channel.consume('ml.disruptions.processed', async (msg) => {
            if (msg !== null) {
                try {
                    const data = JSON.parse(msg.content.toString());
                    await processCompensation(data);
                } catch(e) {
                    console.error("Payload parse error:", e);
                }
                channel.ack(msg);
            }
        });
    } catch (err) {
        console.error('❌ RabbitMQ MainService connection error:', err);
    }
};

const processCompensation = async (data) => {
    const { userId, email, results } = data || {};
    
    if (!userId || !results) {
        console.log(`[User: Unknown] [NO DATA FOUND] Received an empty or corrupted message from RabbitMQ.`);
        return;
    }

    const { date, disruptionsByType } = results;
    
    // Merge all possible weather and social strike disruptions
    const allDisruptions = [...(disruptionsByType.weather || []), ...(disruptionsByType.social || [])];
    
    if (allDisruptions.length === 0) {
        console.log(`[User: ${userId}] [NO DATA FOUND] Location clear for ${date}. No disruption events detected by ML.`);
        return;
    }

    try {
        console.log(`[User: ${userId}] ML Model flagged ${allDisruptions.length} disruption event(s)! Checking API Zomato logs...`);
        
        // Securely fetch DummyZomato hourly activity for cross validation
        const dummyZomatoUrl = process.env.DUMMYZOMATO_URL || 'http://localhost:5000';
        const logRes = await axios.get(`${dummyZomatoUrl}/api/partners/daily-logs/${userId}/${date}`);
        const logData = logRes.data.log;
        
        if (!logData || !logData.hourlyActivity || logData.hourlyActivity.length === 0) {
            console.log(`[User: ${userId}] Zomato returned zero hours logged. No payout required.`);
            return;
        }

        let disruptedHours = 0;
        
        allDisruptions.forEach(disruption => {
            const [startStr, endStr] = disruption.time.split('-');
            const startHour = parseInt(startStr.split(':')[0]);
            const endHour = parseInt(endStr.split(':')[0]);
            
            // Loop Zomato schedule tracking explicitly through active block matches
            logData.hourlyActivity.forEach(activity => {
               if (activity.isOnline === true) {
                   const timeSlot = activity.timeSlot || "00:00";
                   
                   // Robustly handle "4:00 PM" or "16:00" formats
                   let actHour = parseInt(timeSlot.split(':')[0]);
                   if (timeSlot.toLowerCase().includes('pm') && actHour < 12) {
                       actHour += 12;
                   } else if (timeSlot.toLowerCase().includes('am') && actHour === 12) {
                       actHour = 0;
                   }

                   if (actHour >= startHour && actHour < endHour) {
                       disruptedHours++;
                   }
               }
            });
        });

        const totalLoginHours = logData.hourlyActivity.filter(a => a.isOnline === true).length;
        
        if (disruptedHours > 0) {
            // Formula specified precisely: Payout = (Daily Wage ÷ Login Hours) × Total Disrupted Hours
            const simulatedDailyWage = 600; // Mocked Hackathon flat wage baseline average
            const effectiveHours = totalLoginHours > 0 ? totalLoginHours : 1; 
            const payout = (simulatedDailyWage / effectiveHours) * disruptedHours;
            
            console.log(`\n==============================================`);
            console.log(`💸 INSURANCE CLAIM PAYOUT VERIFIED & TRIGGERED!`);
            console.log(`==============================================`);
            console.log(`Driver ID:        ${userId}`);
            console.log(`Disrupted Hours:  ${disruptedHours} hrs logged under harsh conditions`);
            console.log(`Total Shifts:     ${totalLoginHours} hrs on Zomato network`);
            console.log(`Calculated Fund:  ₹${payout.toFixed(2)} automatically dispatched!`);
            console.log(`==============================================\n`);
            
            // 🔥 Fanout to Notification and Payment Services
            const payoutEvent = {
                userId,
                email,
                amount: payout.toFixed(2),
                disruptedHours,
                date,
                reason: `${allDisruptions.length} events logged (Weather/News)`,
                timestamp: new Date().toISOString()
            };
            
            if (channel) {
                const messageBuffer = Buffer.from(JSON.stringify(payoutEvent));
                channel.publish('disruption_payout_fanout', '', messageBuffer, { persistent: true });
                console.log(`📡 Payout event published to 'disruption_payout_fanout':\n`, JSON.stringify(payoutEvent, null, 2));
            }

        } else {
            console.log(`[User: ${userId}] Driver was completely offline during the declared rain/strike window.`);
        }

    } catch (err) {
        console.error(`Failed to pull API DummyZomato data for user ${userId}:`, err.message);
    }
};

app.listen(PORT, () => {
    console.log(`🚀 MainService Core executing on port ${PORT}`);
    connectQueue();
});
