from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from .types import GenerateRequest
from .service import GenerationService

router = APIRouter()
service = GenerationService()

@router.post("/stream")
async def generate_stream(request: GenerateRequest):
    return StreamingResponse(service.generate_stream(request), media_type="text/event-stream")
