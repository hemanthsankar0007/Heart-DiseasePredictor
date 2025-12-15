# API Integration Testing Guide

This document explains how to test the frontend-backend integration after the API URL setup.

## What Was Changed

### Frontend (App.jsx)
- **Line 283**: Changed from `const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';`
- **To**: `const apiUrl = import.meta.env.VITE_API_URL || API_URL;`
- Now uses the `API_URL` constant defined at line 5 (`https://heart-diseasepredictor.onrender.com`)

### Backend (main.py)
- Improved CORS configuration to properly handle multiple origins
- Added better environment variable handling

### Environment Files Created
- `frontend/.env` - For local development configuration
- `backend/.env` - For backend environment configuration

## Testing the Integration

### Method 1: Local Development Test

1. **Start the Backend**:
   ```bash
   cd backend
   python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start the Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test the Flow**:
   - Open browser to http://localhost:5173
   - Fill in all 13 medical parameters
   - Click "INITIATE ANALYSIS" button
   - Check browser console (F12) for:
     - "Making request to: http://localhost:8000/predict"
     - "Backend health check: ..." (should show backend is healthy)
   - Verify you get a prediction result with risk level and recommendation

### Method 2: Production API Test

1. **Ensure `VITE_API_URL` is NOT set** in frontend/.env (comment it out or remove it)

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test the Flow**:
   - Open browser to http://localhost:5173
   - Fill in all 13 medical parameters
   - Click "INITIATE ANALYSIS" button
   - Check browser console for:
     - "Making request to: https://heart-diseasepredictor.onrender.com/predict"
   - Should connect to production backend

## Expected Behavior

### Priority Order for API URL:
1. **First**: Environment variable `VITE_API_URL` (if set in frontend/.env)
2. **Fallback**: Hardcoded `API_URL` constant in App.jsx (line 5)

### When "INITIATE ANALYSIS" is Pressed:
1. Frontend reads the API URL (from env var or constant)
2. Performs health check: `GET {apiUrl}/health`
3. If health check passes, sends prediction request: `POST {apiUrl}/predict`
4. Displays result or error message

## Verifying the Setup

### Check Frontend Configuration:
```bash
cd frontend
cat .env  # Should show VITE_API_URL=http://localhost:8000 for local dev
```

### Check Backend Configuration:
```bash
cd backend
cat .env  # Should show FRONTEND_URL and PORT
```

### Verify App.jsx Changes:
```bash
# Should show the updated line using API_URL constant
grep -A2 "const apiUrl" frontend/src/App.jsx
```

## Troubleshooting

### Error: "Backend server is not responding"
- Ensure backend is running on the correct port
- Check if VITE_API_URL or API_URL is correct
- Verify CORS settings in backend allow your frontend origin

### Error: "CORS policy" in browser console
- Check backend CORS middleware configuration
- Ensure your frontend URL is in the allowed_origins list
- Verify FRONTEND_URL environment variable in backend

### No prediction results
- Open browser DevTools (F12) → Network tab
- Look for requests to `/health` and `/predict`
- Check the request URL and response status
- Verify all 13 form fields are filled

## Integration Flow Diagram

```
User clicks "INITIATE ANALYSIS"
    ↓
submitPrediction() function is called
    ↓
Determines API URL (VITE_API_URL || API_URL)
    ↓
Sends GET request to {apiUrl}/health
    ↓
If successful, sends POST to {apiUrl}/predict with patientData
    ↓
Backend processes through XGBoost model
    ↓
Returns prediction with risk_probability, risk_level, recommendation
    ↓
Frontend displays results in gaming-style UI
```

## Success Criteria

✅ Frontend successfully calls backend when "INITIATE ANALYSIS" is pressed
✅ Health check endpoint is called before prediction
✅ Prediction request includes all 13 patient parameters
✅ Backend returns valid prediction response
✅ Results are displayed in the UI
✅ Environment variables properly override hardcoded values
✅ Both local and production setups work correctly
