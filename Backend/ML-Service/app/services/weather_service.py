import requests
import logging
from datetime import date as date_type

logger = logging.getLogger(__name__)

def get_hourly_weather(lat: float, lng: float, date: str):
    """
    Fetches weather data from Open-Meteo.
    - Past dates → archive-api.open-meteo.com/v1/archive  (historical)
    - Today/future → api.open-meteo.com/v1/forecast
    Returns full day weather data as a list of dicts.
    """
    try:
        today = date_type.today().isoformat()
        is_past = date < today

        if is_past:
            url = (
                f"https://archive-api.open-meteo.com/v1/archive"
                f"?latitude={lat}&longitude={lng}"
                f"&hourly=temperature_2m,precipitation"
                f"&timezone=auto"
                f"&start_date={date}&end_date={date}"
            )
            logger.info(f"[WeatherService] Using ARCHIVE API for past date: {date}")
        else:
            url = (
                f"https://api.open-meteo.com/v1/forecast"
                f"?latitude={lat}&longitude={lng}"
                f"&hourly=temperature_2m,precipitation"
                f"&timezone=auto"
                f"&start_date={date}&end_date={date}"
            )
            logger.info(f"[WeatherService] Using FORECAST API for date: {date}")

        response = requests.get(url, timeout=10)
        raw_data = None
        if response.status_code == 200:
            raw_data = response.json()
        else:
            logger.warning(f"[WeatherService] API returned {response.status_code}: {response.text[:200]}")

        if not raw_data or 'hourly' not in raw_data:
            raise Exception(f"Invalid or missing hourly data from {'archive' if is_past else 'forecast'} API")

        times = raw_data['hourly'].get('time') or []
        precips = raw_data['hourly'].get('precipitation') or []
        temps = raw_data['hourly'].get('temperature_2m') or []

        logger.info(f"[WeatherService] Got {len(times)} hourly records. Max rain: {max(precips) if precips else 0}mm")

        weather_data = []
        for i in range(len(times)):
            t = times[i]
            p = precips[i] if i < len(precips) and precips[i] is not None else 0.0
            temp = temps[i] if i < len(temps) and temps[i] is not None else 25.0
            weather_data.append({
                "time": t[-5:],       # HH:MM
                "full_time": t,
                "temperature": temp,
                "precipitation": p
            })
        return weather_data

    except Exception as e:
        logger.error(f"[WeatherService] Error: {e}")
        return [
            {
                "time": f"{str(i).zfill(2)}:00",
                "full_time": f"{date}T{str(i).zfill(2)}:00",
                "temperature": 25.0,
                "precipitation": 0.0
            } for i in range(24)
        ]

