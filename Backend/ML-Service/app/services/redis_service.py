import redis
import json
import logging

logger = logging.getLogger(__name__)

class RedisService:
    def __init__(self):
        try:
            self.client = redis.Redis(
                host='redis-13328.crce206.ap-south-1-1.ec2.cloud.redislabs.com', 
                port=13328, 
                password='DgspaWb4Pe7IKzaMq1M96YEMJ6tpsbSH',
                db=0, 
                decode_responses=True
            )
            self.client.ping()
        except Exception as e:
            logger.warning(f"Redis not available ({e}). Running in fallback (in-memory) mode.")
            self.client = None
            self._fallback_cache = {}

    def keys(self, pattern: str):
        try:
            if self.client:
                return self.client.keys(pattern)
            else:
                import fnmatch
                return [k for k in self._fallback_cache.keys() if fnmatch.fnmatch(k, pattern)]
        except Exception as e:
            logger.error(f"Redis keys error: {e}")
            return []

    def get(self, key: str):
        try:
            if self.client:
                data = self.client.get(key)
                return json.loads(data) if data else None
            else:
                return self._fallback_cache.get(key)
        except Exception as e:
            logger.error(f"Redis get error: {e}")
            return None

    def set(self, key: str, value: dict, ttl: int = 1800):
        try:
            if self.client:
                self.client.setex(key, ttl, json.dumps(value))
            else:
                self._fallback_cache[key] = value
        except Exception as e:
            logger.error(f"Redis set error: {e}")

redis_client = RedisService()
