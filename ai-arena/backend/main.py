from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from discovery.router import router as discovery_router
from generation.router import router as generation_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(discovery_router, prefix="/discovery", tags=["Discovery"])
app.include_router(generation_router, prefix="/generation", tags=["Generation"])

@app.get("/")
def read_root():
    return {"message": "AI Arena Backend is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
