import httpx
import os

WEATHER_CODES = {
    0: "clear and sunny", 1: "mainly clear", 2: "partly cloudy",
    3: "overcast", 51: "light drizzle", 61: "light rain",
    63: "moderate rain", 80: "rain showers", 95: "thunderstorm"
}

async def get_weather(lat: float, lon: float) -> dict:
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,weather_code,precipitation",
        "timezone": "auto"
    }
    async with httpx.AsyncClient() as client:
        r = await client.get(url, params=params)
        c = r.json()["current"]
        return {
            "temp_c": c["temperature_2m"],
            "condition": WEATHER_CODES.get(c["weather_code"], "cloudy"),
            "is_raining": c["precipitation"] > 0
        }

async def get_nearby_places(lat: float, lon: float) -> list:
    maps_key = os.getenv("GOOGLE_MAPS_API_KEY")
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{lat},{lon}",
        "radius": 500,
        "key": maps_key
    }
    async with httpx.AsyncClient() as client:
        r = await client.get(url, params=params)
        results = r.json().get("results", [])[:5]
        return [{"name": p["name"], "type": p["types"][0]} for p in results]

async def build_context(lat: float, lon: float) -> dict:
    weather = await get_weather(lat, lon)
    nearby = await get_nearby_places(lat, lon)
    return {
        "weather": weather,
        "nearby_places": nearby,
        "coordinates": {"lat": lat, "lon": lon}
    }