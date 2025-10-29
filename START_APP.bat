@echo off
echo ===============================================
echo STARTING HEART DISEASE PREDICTION APP
echo ===============================================
echo.

echo [INFO] Starting Backend Server...
cd backend
start "Backend Server" cmd /k "venv\Scripts\activate && python main.py"

echo.
echo [INFO] Waiting for backend to start (5 seconds)...
timeout /t 5 /nobreak >nul

echo.
echo [INFO] Starting Frontend Application...
cd ..\frontend
start "Frontend App" cmd /k "npm run dev"

echo.
echo ===============================================
echo ✓ APPLICATION STARTING!
echo ===============================================
echo.
echo The app will open in your browser shortly...
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo To stop the app:
echo 1. Close both terminal windows
echo 2. Or press Ctrl+C in each terminal
echo.
echo ===============================================

timeout /t 3 /nobreak >nul
start "" "http://localhost:5173"

echo.
echo Press any key to exit this window...
pause >nul
