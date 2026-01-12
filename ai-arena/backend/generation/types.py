from pydantic import BaseModel

class GenerateRequest(BaseModel):
    model_id: str
    provider: str
    prompt: str
    api_key: str
