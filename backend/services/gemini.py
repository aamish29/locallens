import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_PROMPT = """You are LocalLens, an expert marketing creative director for small businesses.

Given a business description and real-time local context (weather, nearby places),
generate a complete moment-aware marketing campaign.

Structure your response with these clearly labeled sections:

## 📍 CONTEXT INSIGHT
What this exact moment means for this business and their customers.

## ✨ TAGLINES
3 punchy options tailored to the moment.

## 📸 INSTAGRAM CAPTION
Ready to post, with relevant hashtags.

## 🏪 GOOGLE BUSINESS POST
Short, local-friendly update.

## 🪧 SIGNAGE COPY
A-frame or window sign — short and punchy.

## 🕐 POSTING STRATEGY
Best time and platform for right now given the context.

Be hyper-specific. A rainy Tuesday near a yoga studio is completely
different from a sunny Saturday near a farmers market."""

async def stream_campaign(business_description: str, context: dict):
    weather = context["weather"]
    nearby = context["nearby_places"]
    nearby_str = ", ".join([p["name"] for p in nearby]) if nearby else "residential area"

    prompt = f"""
Business: {business_description}
Current weather: {weather['condition']}, {weather['temp_c']}°C
Is it raining: {weather['is_raining']}
Nearby places within 500m: {nearby_str}

Generate a complete hyperlocal marketing campaign for this exact moment.
"""

    response = await client.aio.models.generate_content_stream(
        model="gemini-2.0-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=0.8,
            max_output_tokens=2048
        )
    )

    async for chunk in response:
        if chunk.text:
            yield chunk.text