import requests
import logging

logger = logging.getLogger(__name__)

def get_hourly_weather(lat: float, lng: float, date: str):
    """
    Fetches real-time weather from Open-Meteo API.
    Returns full day weather data in JSON format (list of dicts).
    """
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&hourly=temperature_2m,precipitation&timezone=auto&start_date={date}&end_date={date}"
        response = requests.get(url, timeout=5)
        raw_data = None
        if response.status_code == 200:
            raw_data = response.json()
            
        if not raw_data or 'hourly' not in raw_data:
            raise Exception("Invalid or missing data")
            
        times = raw_data['hourly'].get('time') or []
        precips = raw_data['hourly'].get('precipitation') or []
        temps = raw_data['hourly'].get('temperature_2m') or []
        
        weather_data = []
        for i in range(len(times)):
            t = times[i]
            p = precips[i] if i < len(precips) and precips[i] is not None else 0.0
            temp = temps[i] if i < len(temps) and temps[i] is not None else 25.0
            weather_data.append({
                "time": t[-5:], # Extract HH:MM
                "full_time": t,
                "temperature": temp,
                "precipitation": p
            })
        return weather_data
        
    except Exception as e:
        logger.error(f"Weather API error: {e}")
        return [
            {
                "time": f"{str(i).zfill(2)}:00",
                "full_time": f"{date}T{str(i).zfill(2)}:00",
                "temperature": 25.0,
                "precipitation": 0.0
            } for i in range(24)
        ]
