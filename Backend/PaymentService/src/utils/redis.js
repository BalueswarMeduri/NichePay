const { createClient } = require('redis');

let redisClient;

const connectRedis = async () => {
  try {
    redisClient = createClient({ url: process.env.REDIS_URL });
    
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    redisClient.on('connect', () => console.log('🔗 Redis Connected'));
    
    await redisClient.connect();
  } catch (error) {
    console.error('❌ Redis Connection Error', error);
    process.exit(1);
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

/**
 * Ensures idempotency using Redis SETNX
 * @param {string} key - Idempotency key (e.g., eventId or claimId)
 * @param {number} expirationInSeconds - Expiration time in seconds (default 24h)
 * @returns {Promise<boolean>} - True if it's a new request, false if duplicate
 */
const checkIdempotency = async (key, expirationInSeconds = 86400) => {
  const client = getRedisClient();
  const result = await client.set(key, 'PROCESSING', {
    NX: true,
    EX: expirationInSeconds
  });
  return result === 'OK';
};

const markIdempotencySuccess = async (key) => {
  const client = getRedisClient();
  await client.set(key, 'COMPLETED');
};

const clearIdempotency = async (key) => {
  const client = getRedisClient();
  await client.del(key);
};

module.exports = { 
  connectRedis, 
  getRedisClient, 
  checkIdempotency, 
  markIdempotencySuccess,
  clearIdempotency
};
