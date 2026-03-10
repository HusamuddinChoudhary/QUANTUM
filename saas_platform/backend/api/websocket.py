from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
import asyncio
import redis.asyncio as redis
import os

router = APIRouter()
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

@router.websocket("/ws/{session_id}")
async def session_websocket(websocket: WebSocket, session_id: str):
    await websocket.accept()
    r = redis.from_url(REDIS_URL)
    
    try:
        # Listen to Redis Pub/Sub or Streams for session updates
        pubsub = r.pubsub()
        await pubsub.subscribe(f"session:{session_id}")
        
        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True)
            if message:
                data = json.loads(message['data'])
                await websocket.send_json(data)
                if data.get("status") == "COMPLETE":
                    break
            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        print(f"WS Disconnect: {session_id}")
    finally:
        await r.close()
