from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd
import numpy as np
from typing import Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Heart Disease Prediction API", version="1.0.0")

# Production CORS settings
ALLOWED_ORIGINS = [
    "http://localhost:5173", 
    "http://localhost:5174",
    "https://*.vercel.app",  # Allow all Vercel subdomains
    os.getenv("FRONTEND_URL", "")  # Production frontend URL
]

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # Use specific origins for better security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
model = None
try:
    # Check multiple possible locations for the model
    possible_paths = [
        "xgb_heart_model.pkl",
        "./xgb_heart_model.pkl", 
        "backend/xgb_heart_model.pkl",
        os.path.join(os.path.dirname(__file__), "xgb_heart_model.pkl")
    ]
    
    for model_path in possible_paths:
        if os.path.exists(model_path):
            with open(model_path, "rb") as f:
                model = pickle.load(f)
            print(f"✅ Model loaded successfully from: {model_path}")
            break
    else:
        print("⚠️ Model file 'xgb_heart_model.pkl' not found in any expected location.")
        
except Exception as e:
    print(f"❌ Error loading model: {e}")

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
    """Convert frontend data to model input format - UCI Heart Disease Dataset"""
    try:
        # Create feature array in exact order expected by the model
        # Based on UCI Heart Disease dataset after dropping id, dataset, num
        # Order: age, sex, cp, trestbps, chol, fbs, restecg, thalch, exang, oldpeak, slope, ca, thal
        features = [
            float(data.age),           # age
            float(data.sex),           # sex (0=Female, 1=Male)  
            float(data.cp),            # cp (chest pain type: 0-3)
            float(data.trestbps),      # trestbps (resting blood pressure)
            float(data.chol),          # chol (cholesterol)
            float(data.fbs),           # fbs (fasting blood sugar: 0-1)
            float(data.restecg),       # restecg (resting ECG: 0-2)
            float(data.thalch),        # thalch (max heart rate)
            float(data.exang),         # exang (exercise angina: 0-1)
            float(data.oldpeak),       # oldpeak (ST depression)
            float(data.slope),         # slope (0-2)
            float(data.ca),            # ca (major vessels: 0-3)
            float(data.thal)           # thal (thalassemia: 0-3)
        ]
        
        print(f"✅ Preprocessed features: {features}")
        return np.array([features])
        
    except Exception as e:
        raise ValueError(f"Error preprocessing data: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Heart Disease Prediction API is running! ❤️", "model_loaded": model is not None}

@app.post("/test")
async def test_endpoint(patient: PatientData):
    """Test endpoint to check if data is being received correctly"""
    print(f"📋 Test endpoint received: {patient}")
    return {"status": "success", "received_data": patient.dict(), "message": "Data received successfully!"}

@app.post("/predict", response_model=PredictionResponse)
async def predict_heart_disease(patient: PatientData):
    print(f"🔍 Received prediction request: {patient}")
    
    if model is None:
        print("❌ Model not loaded")
        raise HTTPException(status_code=500, detail="Model not loaded. Please ensure xgb_heart_model.pkl is in the backend folder.")
    
    try:
        print("🔄 Preprocessing input data...")
        # Preprocess the input data
        features = preprocess_input(patient)
        print(f"✅ Preprocessed features: {features}")
        
        # Make prediction
        print("🔮 Making prediction...")
        probability = model.predict_proba(features)[0][1]  # Probability of heart disease
        prediction = model.predict(features)[0]
        print(f"📊 Raw prediction: {prediction}, Probability: {probability}")
        
        # Determine risk level
        if probability < 0.3:
            risk_level = "Low Risk"
            recommendation = "Maintain healthy lifestyle. Regular checkups recommended."
        elif probability < 0.7:
            risk_level = "Moderate Risk"
            recommendation = "Consult with cardiologist. Consider lifestyle modifications."
        else:
            risk_level = "High Risk"
            recommendation = "Immediate medical consultation required. Urgent cardiac evaluation needed."
        
        result = PredictionResponse(
            risk_probability=round(probability * 100, 2),
            risk_level=risk_level,
            recommendation=recommendation,
            confidence=round(max(probability, 1-probability) * 100, 2)
        )
        
        print(f"✅ Sending response: {result}")
        return result
        
    except ValueError as ve:
        print(f"❌ Validation error: {ve}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "model_loaded": model is not None,
        "environment": os.getenv("ENVIRONMENT", "development")
    }

# For production deployment
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
