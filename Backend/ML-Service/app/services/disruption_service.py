from .weather_service import get_hourly_weather
from .aqi_service import get_hourly_aqi
from .news_service import get_local_news
from ..utils.time_utils import format_time_window
from ..utils.geo_utils import get_zone_name

def build_disruption_array(lat: float, lng: float, date: str, pincode: str):
    weather_data = get_hourly_weather(lat, lng, date)
    aqi_data = get_hourly_aqi(lat, lng, date)
    news_disruptions = get_local_news(lat, lng, date, pincode=pincode)
    
    rain_list = [float(hour.get('precipitation', 0.0)) for hour in weather_data]
    rain_data = rain_list[:24]
    temp_list = [float(hour.get('temperature', 25.0)) for hour in weather_data]
    temp_data = temp_list[:24]
    
    disruptions = []
    
    def _add(t_type, start, end, level="medium"):
        disruptions.append({
            "time": format_time_window(start, end),
            "type": t_type,
            "level": level
        })
        
    current_rain_start = None
    current_heat_start = None
    current_poll_start = None
    
    for hour in range(24):
        rain = rain_data[hour] if rain_data and hour < len(rain_data) and rain_data[hour] is not None else 0
        temp = temp_data[hour] if temp_data and hour < len(temp_data) and temp_data[hour] is not None else 25
        aqi = aqi_data[hour] if aqi_data and hour < len(aqi_data) and aqi_data[hour] is not None else 100
        
        if rain > 0.5:  # IMD light rain threshold: >0.5mm/hr
            if current_rain_start is None:
                current_rain_start = hour
        else:
            if current_rain_start is not None:
                peak = max(rain_data[current_rain_start:hour])
                level = "heavy" if peak > 7.5 else "medium" if peak > 2.0 else "light"
                _add("rain", current_rain_start, hour, level=level)
                current_rain_start = None
                
        if temp > 45:
            if current_heat_start is None:
                current_heat_start = hour
        else:
            if current_heat_start is not None:
                _add("heat", current_heat_start, hour, level="heavy")
                current_heat_start = None
                
        if aqi > 400:
            if current_poll_start is None:
                current_poll_start = hour
        else:
            if current_poll_start is not None:
                _add("pollution", current_poll_start, hour, level="heavy")
                current_poll_start = None

    if current_rain_start is not None:
        peak = max(rain_data[current_rain_start:24])
        level = "heavy" if peak > 7.5 else "medium" if peak > 2.0 else "light"
        _add("rain", current_rain_start, 24, level=level)
    if current_heat_start is not None:
        _add("heat", current_heat_start, 24, level="heavy")
    if current_poll_start is not None:
        _add("pollution", current_poll_start, 24, level="heavy")
         
    # ── Output structure: weather events first, then social events ─────────────
    # This satisfies: "if rain → rain data; if strike/curfew → that data; if both → both"
    # Weather disruptions are already in `disruptions`; social ones come from news.
    weather_disruptions = disruptions          # rain / heat / pollution
    social_disruptions  = news_disruptions     # strike / curfew

    final_disruptions = weather_disruptions + social_disruptions

    return {
        "date": date,
        "lat": lat,
        "lng": lng,
        "zone": get_zone_name(lat, lng, pincode),
        "disruptionsByType": {
            "weather": weather_disruptions,
            "social":  social_disruptions,
        },
        "disruptions": final_disruptions,
    }
