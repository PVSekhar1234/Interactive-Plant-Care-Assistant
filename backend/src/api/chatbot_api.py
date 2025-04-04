from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import openai
import os

# Load API key
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialize FastAPI app
app = FastAPI()

class ChatRequest(BaseModel):
    prompt: str

@app.post("/chat")
def chat_bot(request: ChatRequest):
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": request.prompt}]
    )
    return {"response": response.choices[0].message.content.strip()}

# Run with: uvicorn chatbot_api:app --host 0.0.0.0 --port 8000 --reload
