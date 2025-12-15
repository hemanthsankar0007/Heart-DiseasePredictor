from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Heart Disease Prediction API", version="1.0.0")

FRONTEND_URL = os.getenv("FRONTEND_URL")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        FRONTEND_URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
try:
    with open("xgb_heart_model.pkl", "rb") as f:
        model = pickle.load(f)
except Exception as e:
    print("Model load failed:", e)


class PatientData(BaseModel):
    age: str
    sex: str
    cp: str
    trestbps: str
    chol: str
    fbs: str
    restecg: str
    thalch: str
    exang: str
    oldpeak: str
    slope: str
    ca: str
    thal: str


class PredictionResponse(BaseModel):
    risk_probability: float
    risk_level: str
    recommendation: str
    confidence: float


def preprocess_input(data: PatientData) -> np.ndarray:
    return np.array([[
        float(data.age),
        float(data.sex),
        float(data.cp),
        float(data.trestbps),
        float(data.chol),
        float(data.fbs),
        float(data.restecg),
        float(data.thalch),
        float(data.exang),
        float(data.oldpeak),
        float(data.slope),
        float(data.ca),
        float(data.thal)
    ]])


@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": model is not None}


@app.post("/predict", response_model=PredictionResponse)
async def predict(patient: PatientData):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    features = preprocess_input(patient)
    probability = model.predict_proba(features)[0][1]

    if probability < 0.3:
        risk = "Low Risk"
        rec = "Maintain healthy habits and regular checkups."
    elif probability < 0.7:
        risk = "Moderate Risk"
        rec = "Consult a cardiologist and monitor lifestyle."
    else:
        risk = "High Risk"
        rec = "Immediate medical attention recommended."

    return {
        "risk_probability": round(probability * 100, 2),
        "risk_level": risk,
        "recommendation": rec,
        "confidence": round(max(probability, 1 - probability) * 100, 2)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
