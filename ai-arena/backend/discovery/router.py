from fastapi import APIRouter, Header, HTTPException, Query
from typing import List, Optional
from .types import AIModel
from .service import DiscoveryService

router = APIRouter()
service = DiscoveryService()

@router.get("/models", response_model=List[AIModel])
async def get_models(
    api_key: Optional[str] = Header(None, alias="X-API-Key"),
    provider: Optional[str] = Query(None)
):
    if not api_key:
         # Return mock/empty or error if strictly required. 
         # For now, let's allow basic mock if implemented, or return empty.
         return []
         
    if not provider:
        return []

    return await service.discover_models(api_key, provider)
