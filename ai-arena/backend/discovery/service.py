import os
from typing import List
from .types import AIModel, ModelCategory, ModelProvider

# Import SDKs
try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

try:
    import google.generativeai as genai
except ImportError:
    genai = None

class DiscoveryService:
    def __init__(self):
        pass

    async def discover_models(self, api_key: str, provider: str) -> List[AIModel]:
        discovered_models = []
        print(f"DEBUG: Discovering models for provider: '{provider}'")

        if provider == ModelProvider.OPENAI.value:
            if not OpenAI:
                raise Exception("OpenAI SDK not installed")
            
            client = OpenAI(api_key=api_key)
            try:
                response = client.models.list()
                for m in response.data:
                    if "gpt" in m.id and "instruct" not in m.id and "realtime" not in m.id and "audio" not in m.id:
                        category = ModelCategory.STANDARD
                        if "gpt-4" in m.id: 
                            category = ModelCategory.SMART
                        elif "gpt-3.5" in m.id or "mini" in m.id:
                            category = ModelCategory.FAST
                        
                        discovered_models.append(AIModel(
                            id=m.id,
                            name=m.id,
                            provider=ModelProvider.OPENAI,
                            category=category,
                            description=f"OpenAI model: {m.id}",
                            context_window=128000 if "gpt-4" in m.id else 16000,
                            capabilities=["Chat"]
                        ))
            except Exception as e:
                print(f"Error fetching OpenAI models: {e}")
                return []

        elif provider == ModelProvider.GOOGLE.value:
            if not genai:
                 raise Exception("Google GenAI SDK not installed")
            
            try:
                genai.configure(api_key=api_key)
                for m in genai.list_models():
                    if "generateContent" in m.supported_generation_methods:
                         name = m.name.replace("models/", "")
                         
                         category = ModelCategory.STANDARD
                         if "pro" in name: category = ModelCategory.SMART
                         if "flash" in name: category = ModelCategory.FAST

                         is_chat = True
                         if any(x in name.lower() for x in ["embedding", "vision", "aqa", "attribution"]):
                             is_chat = False

                         capabilities = []
                         if is_chat: capabilities.append("Chat")
                         if "vision" in name.lower() or "gemini" in name.lower(): capabilities.append("Vision")
                         if "embedding" in name.lower(): capabilities.append("Embedding")

                         discovered_models.append(AIModel(
                            id=name,
                            name=m.display_name or name,
                            provider=ModelProvider.GOOGLE,
                            category=category,
                            description=m.description,
                            context_window=getattr(m, "input_token_limit", 32000),
                            is_chat=is_chat,
                            rpm=15 if "pro" in name else 60,
                            tpm=32000 if "pro" in name else 1000000,
                            rpd=1500 if "pro" in name else 10000,
                            capabilities=capabilities
                         ))
            except Exception as e:
                print(f"Error fetching Google models: {e}")
                return []

        else:
            base_url = None
            if provider == ModelProvider.OPENROUTER.value:
                base_url = "https://openrouter.ai/api/v1"
            elif provider == ModelProvider.GROQ.value:
                base_url = "https://api.groq.com/openai/v1"
            elif provider == ModelProvider.GROK.value:
                base_url = "https://api.x.ai/v1"
            elif provider == ModelProvider.MISTRAL.value:
                base_url = "https://api.mistral.ai/v1"

            if base_url:
                print(f"DEBUG: Using base_url: {base_url}")
                if not OpenAI:
                    print("DEBUG: OpenAI SDK not found!")
                    raise Exception("OpenAI SDK not installed")
                
                try:
                    client = OpenAI(api_key=api_key, base_url=base_url)
                    response = client.models.list()
                    
                    for m in response.data:
                         category = ModelCategory.STANDARD
                         lower_id = m.id.lower()
                         if "pro" in lower_id or "opus" in lower_id or "gpt-4" in lower_id or "large" in lower_id:
                             category = ModelCategory.SMART
                         elif "fast" in lower_id or "turbo" in lower_id or "flash" in lower_id or "mini" in lower_id:
                             category = ModelCategory.FAST

                         is_chat = True
                         if any(x in lower_id for x in ["whisper", "tts", "dall-e", "embed", "vision", "audio", "mod", "rerank"]):
                              is_chat = False
                         if "guard" in lower_id:
                              is_chat = True

                         capabilities = []
                         if is_chat: capabilities.append("Chat")
                         if "vision" in lower_id or "gpt-4-turbo" in lower_id or "gpt-4o" in lower_id or "claude-3" in lower_id or "gemini" in lower_id:
                             capabilities.append("Vision")
                         if "embed" in lower_id: capabilities.append("Embedding")
                         if "whisper" in lower_id or "audio" in lower_id: capabilities.append("Audio")
                         if "tts" in lower_id: capabilities.append("Speech")
                         if "dall-e" in lower_id or "image" in lower_id: capabilities.append("Image")

                         # Rate limits
                         rpm = 30
                         tpm = 40000
                         rpd = 5000
                         
                         if provider == ModelProvider.GROQ.value:
                             rpm = 30
                             rpd = 14400
                             tpm = 6000 
                             groq_limits = {
                                 "allam-2-7b": (30, 7000, 6000),
                                 "orpheus": (10, 100, 1200),
                                 "compound": (30, 250, 70000),
                                 "llama-3.1-8b-instant": (30, 14400, 6000),
                                 "llama-3.3-70b-versatile": (30, 1000, 12000),
                                 "maverick": (30, 1000, 6000),
                                 "scout": (30, 1000, 30000),
                                 "guard": (30, 14400, 15000), 
                                 "kimi": (60, 1000, 10000),
                                 "gpt-oss": (30, 1000, 8000),
                                 "qwen": (60, 1000, 6000),
                                 "whisper": (20, 2000, 0),
                             }
                             for key, (r_pm, r_pd, t_pm) in groq_limits.items():
                                 if key in lower_id:
                                     rpm = r_pm
                                     rpd = r_pd
                                     tpm = t_pm
                                     break
                         
                         if provider == ModelProvider.OPENROUTER.value:
                              rpm = 100
                              tpm = 100000
                              rpd = 100000

                         discovered_models.append(AIModel(
                            id=m.id,
                            name=m.id,
                            provider=ModelProvider(provider),
                            category=category,
                            description=f"Model from {provider}",
                            context_window=0,
                            is_chat=is_chat,
                            capabilities=capabilities,
                            rpm=rpm,
                            tpm=tpm,
                            rpd=rpd
                         ))
                except Exception as e:
                    print(f"Error fetching {provider} models: {e}")
                    import traceback
                    traceback.print_exc()
                    return []

        return discovered_models

    def get_models(self) -> List[AIModel]:
        return []
