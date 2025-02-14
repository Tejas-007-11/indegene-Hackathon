import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# 🔹 Load environment variables from .env
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

# 🔹 Check if API key is available
if not API_KEY:
    raise ValueError("❌ ERROR: GEMINI_API_KEY not found in .env file.")

# 🔹 Initialize Gemini API
genai.configure(api_key=API_KEY)

# 🔹 Initialize FastAPI app
app = FastAPI()

# 🔹 Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📌 Define Input Schema
class UserInput(BaseModel):
    text: str


# 📌 Improved Chat Route with Empathetic Responses
@app.post("/chat")
async def chat(user_input: UserInput):
    try:
        model = genai.GenerativeModel("gemini-pro")  # Using Gemini Pro

        # 🔹 Custom Prompt to Generate Empathetic Responses
        prompt = f"""
        Your name is Hygieia and your are an AI therapist that provides **empathetic** and **supportive** responses to users experiencing mental health concerns.
        Respond in a **calm, understanding, and encouraging** tone. Keep it **short, friendly, and natural**. privide what ever they need to feel **better**.
        **Format the response properly (no asterisks).**  

        User: {user_input.text}
        AI Therapist:
        """

        response = model.generate_content(prompt)

        return {"response": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


