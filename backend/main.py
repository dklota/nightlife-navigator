from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from src.api.bars import router as bars_router
from src.api.checkins import router as checkins_router

load_dotenv()

app = FastAPI(title="WTM API")

# Configure CORS for mobile/web frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*", 
        "http://localhost:3000", 
        "http://localhost:3001",
        "http://localhost:3002"
    ], # Added local dashboard origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to the WTM AI Backend",
        "status": "online",
        "environment": os.getenv("ENVIRONMENT", "development")
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(bars_router)
app.include_router(checkins_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
