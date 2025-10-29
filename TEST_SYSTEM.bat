@echo off
echo ===============================================
echo TESTING HEART DISEASE PREDICTION APP
echo ===============================================
echo.

echo [TEST 1] Checking if Python is installed...
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ FAIL: Python not found
    echo Please install Python 3.8+ first
    goto :end_tests
) else (
    echo ✅ PASS: Python is installed
    python --version
)

echo.
echo [TEST 2] Checking if Node.js is installed...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ FAIL: Node.js not found
    echo Please install Node.js 16+ first
    goto :end_tests
) else (
    echo ✅ PASS: Node.js is installed
    node --version
)

echo.
echo [TEST 3] Checking if virtual environment exists...
if exist "backend\venv\Scripts\activate.bat" (
    echo ✅ PASS: Python virtual environment exists
) else (
    echo ❌ FAIL: Virtual environment not found
    echo Run COMPLETE_SETUP.bat first
    goto :end_tests
)

echo.
echo [TEST 4] Checking if ML model exists...
if exist "backend\xgb_heart_model.pkl" (
    echo ✅ PASS: ML model file found
) else (
    echo ❌ FAIL: ML model file missing
    echo Ensure xgb_heart_model.pkl is in backend folder
    goto :end_tests
)

echo.
echo [TEST 5] Checking if frontend packages installed...
if exist "frontend\node_modules" (
    echo ✅ PASS: Frontend packages installed
) else (
    echo ❌ FAIL: Frontend packages not installed
    echo Run COMPLETE_SETUP.bat first
    goto :end_tests
)

echo.
echo [TEST 6] Testing Python backend dependencies...
cd backend
call venv\Scripts\activate
echo import fastapi, uvicorn, pandas, numpy, xgboost, pickle | python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ FAIL: Some Python packages missing
    echo Run COMPLETE_SETUP.bat to install packages
    cd ..
    goto :end_tests
) else (
    echo ✅ PASS: All Python dependencies available
)
cd ..

echo.
echo [TEST 7] Quick backend API test...
echo Starting backend for quick test...
cd backend
start /B cmd /c "venv\Scripts\activate && python main.py" >nul 2>&1
cd ..

echo Waiting for backend to start (10 seconds)...
timeout /t 10 /nobreak >nul

echo Testing health endpoint...
curl -s http://localhost:8000/health >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ FAIL: Backend health check failed
    echo Backend may not be starting properly
) else (
    echo ✅ PASS: Backend responds to health check
)

echo Stopping test backend...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000"') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo ===============================================
echo ✅ ALL TESTS COMPLETED!
echo ===============================================
echo.
echo If all tests passed, your app is ready to run!
echo Use START_APP.bat to launch the application.
echo.

:end_tests
echo ===============================================
pause
