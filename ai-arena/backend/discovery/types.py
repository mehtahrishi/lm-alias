from pydantic import BaseModel
from typing import List, Optional, Literal
from enum import Enum

class ModelCategory(str, Enum):
    FAST = "FAST"
    SMART = "SMART"
    STANDARD = "STANDARD"

class ModelProvider(str, Enum):
    OPENAI = "OpenAI"
    GOOGLE = "Google"
    ANTHROPIC = "Anthropic"
    GROQ = "Groq"
    OPENROUTER = "OpenRouter"
    GROK = "Grok"
    MISTRAL = "Mistral"

class AIModel(BaseModel):
    id: str
    name: str
    provider: ModelProvider
    category: ModelCategory
    description: Optional[str] = None
    context_window: int = 0
    max_output_tokens: Optional[int] = None
    is_active: bool = True
    is_chat: bool = True
    rpm: Optional[int] = None
    tpm: Optional[int] = None
    rpd: Optional[int] = None
    capabilities: List[str] = []
