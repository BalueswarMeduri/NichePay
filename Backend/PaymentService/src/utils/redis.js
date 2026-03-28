const connectRedis = async () => {
  console.log('🔗 Redis mocked for cloud usage.');
};

const getRedisClient = () => {
  return {};
};

// Mock idempotency
const checkIdempotency = async (key, expirationInSeconds = 86400) => {
  return true;
};

const markIdempotencySuccess = async (key) => {
  return;
};

const clearIdempotency = async (key) => {
  return;
};

module.exports = { 
  connectRedis, 
  getRedisClient, 
  checkIdempotency, 
  markIdempotencySuccess,
  clearIdempotency
};
