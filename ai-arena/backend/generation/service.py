import os
from typing import AsyncGenerator
from .types import GenerateRequest

# Import SDKs
try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

try:
    import google.generativeai as genai
except ImportError:
    genai = None

class GenerationService:
    async def generate_stream(self, request: GenerateRequest) -> AsyncGenerator[str, None]:
        if request.provider == "OpenAI":
            if not OpenAI:
                yield "Error: OpenAI SDK not installed."
                return

            client = OpenAI(api_key=request.api_key)
            try:
                stream = client.chat.completions.create(
                    model=request.model_id,
                    messages=[{"role": "user", "content": request.prompt}],
                    stream=True,
                )
                for chunk in stream:
                    if chunk.choices and chunk.choices[0].delta.content:
                        yield chunk.choices[0].delta.content
            except Exception as e:
                yield f"Error: {str(e)}"

        elif request.provider == "Google":
            if not genai:
                yield "Error: Google GenAI SDK not installed."
                return
            
            try:
                genai.configure(api_key=request.api_key)
                model = genai.GenerativeModel(request.model_id)
                response = model.generate_content(request.prompt, stream=True)
                for chunk in response:
                    try:
                        if chunk.text:
                            yield chunk.text
                    except ValueError:
                        # Handle cases where chunk.text access fails (e.g. safety blocks or empty chunks)
                        continue
            except Exception as e:
                yield f"Error: {str(e)}"
        
        elif request.provider in ["Groq", "OpenRouter", "Grok", "Mistral"]:
             base_url = None
             if request.provider == "OpenRouter":
                 base_url = "https://openrouter.ai/api/v1"
             elif request.provider == "Groq":
                 base_url = "https://api.groq.com/openai/v1"
             elif request.provider == "Grok":
                 base_url = "https://api.x.ai/v1"
             elif request.provider == "Mistral":
                 base_url = "https://api.mistral.ai/v1"

             if not base_url:
                 yield f"Error: Unknown provider endpoint for {request.provider}"
                 return

             client = OpenAI(api_key=request.api_key, base_url=base_url)
             try:
                 stream = client.chat.completions.create(
                     model=request.model_id,
                     messages=[{"role": "user", "content": request.prompt}],
                     stream=True,
                 )
                 for chunk in stream:
                     if chunk.choices and chunk.choices[0].delta.content:
                         yield chunk.choices[0].delta.content
             except Exception as e:
                 yield f"Error: {str(e)}"

        else:
            yield f"Error: Unknown provider '{request.provider}'."
