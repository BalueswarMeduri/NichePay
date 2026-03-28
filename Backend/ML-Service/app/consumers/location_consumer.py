import pika
import json
import threading
import logging
from ..services.redis_service import redis_client
from ..services.disruption_service import build_disruption_array

logger = logging.getLogger(__name__)

def callback(ch, method, properties, body):
    try:
        data = json.loads(body)
        pincode = data.get("pincode")
        lat = data.get("lat")
        lng = data.get("lng")
        date = data.get("date")
        
        if not all([pincode, lat, lng, date]):
            logger.error("Missing required fields in location update")
            return
            
        redis_key = f"disruptions:{date}:{lat}_{lng}"
        cached = redis_client.get(redis_key)
        
        if cached:
            logger.info(f"Cache hit for {redis_key}, skipping calculation.")
            return
            
        disruptions_data = build_disruption_array(
            lat=lat, 
            lng=lng, 
            date=date, 
            pincode=pincode
        )
        
        redis_client.set(redis_key, disruptions_data, ttl=1800)
        logger.info(f"Generated and cached disruptions for {redis_key}")
        
    except Exception as e:
        logger.error(f"Error processing message: {e}")

def start_consuming():
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        channel = connection.channel()
        channel.queue_declare(queue='location.update', durable=True)
        channel.basic_consume(queue='location.update', on_message_callback=callback, auto_ack=True)
        logger.info("Started RabbitMQ consumer on queue 'location.update'")
        channel.start_consuming()
    except pika.exceptions.AMQPConnectionError:
        logger.warning("RabbitMQ is not running. Consumer will not start.")
    except Exception as e:
        logger.error(f"Consumer error: {e}")

def run_consumer_in_background():
    thread = threading.Thread(target=start_consuming, daemon=True)
    thread.start()
