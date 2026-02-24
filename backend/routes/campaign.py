from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from context.aggregator import build_context
from services.gemini import stream_campaign

router = APIRouter()

@router.websocket("/campaign/stream")
async def campaign_stream(websocket: WebSocket):
    await websocket.accept()
    try:
        data = await websocket.receive_json()
        lat = data.get("lat")
        lon = data.get("lon")
        description = data.get("description", "")

        if not lat or not lon or not description:
            await websocket.send_json({
                "type": "error",
                "content": "Missing lat, lon, or description"
            })
            return

        # Build real-time context
        context = await build_context(lat, lon)

        # Send context to frontend first
        await websocket.send_json({
            "type": "context",
            "content": context
        })

        # Stream campaign text chunk by chunk
        async for chunk in stream_campaign(description, context):
            await websocket.send_json({
                "type": "text",
                "content": chunk
            })

        await websocket.send_json({"type": "done"})

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        await websocket.send_json({
            "type": "error",
            "content": str(e)
        })