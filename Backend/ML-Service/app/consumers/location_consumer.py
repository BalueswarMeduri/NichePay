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
        
        if pincode is None or lat is None or lng is None or date is None:
            logger.error(f"Missing required fields. Received: {data}")
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
        logger.info(f"Generated and cached disruptions for {redis_key}:\n{json.dumps(disruptions_data, indent=2)}")
        
        try:
            # Publish to downstream Hackathon queue for MainService to process compensation logic
            ch.queue_declare(queue='ml.disruptions.processed', durable=True)
            downstream_payload = {
                "userId": data.get("userId"),
                "email": data.get("extraData", {}).get("email"),
                "results": disruptions_data
            }
            ch.basic_publish(
                exchange='',
                routing_key='ml.disruptions.processed',
                body=json.dumps(downstream_payload),
                properties=pika.BasicProperties(delivery_mode=2) # Persistent
            )
            logger.info("Successfully pushed processed disruptions to 'ml.disruptions.processed'")
        except Exception as pub_err:
            logger.error(f"Failed to publish to downstream queue: {pub_err}")
        
    except Exception as e:
        logger.error(f"Error processing message: {e}")

def start_consuming():
    try:
        url = "amqps://anbqwtzw:FVgZHA5TsW1mee0cTJbCSva3mX61wPbt@puffin.rmq2.cloudamqp.com/anbqwtzw?heartbeat=60"
        parameters = pika.URLParameters(url)
        connection = pika.BlockingConnection(parameters)
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
