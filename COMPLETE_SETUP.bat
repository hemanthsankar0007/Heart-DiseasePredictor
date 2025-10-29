@echo off
echo ===============================================
echo HEART DISEASE PREDICTION APP - COMPLETE SETUP
echo ===============================================
echo.

echo [STEP 1] Checking Python installation...
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python not found! Please install Python 3.8+ first.
    echo Download from: https://python.org/downloads
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)
echo ✓ Python is installed

echo.
echo [STEP 2] Checking Node.js installation...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found! Please install Node.js 16+
    echo Download from: https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js is installed

echo.
echo [STEP 3] Setting up Python virtual environment...
cd backend
python -m venv venv
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)
echo ✓ Virtual environment created

echo.
echo [STEP 4] Activating virtual environment and installing Python packages...
call venv\Scripts\activate
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install Python packages
    pause
    exit /b 1
)
echo ✓ Python packages installed

echo.
echo [STEP 5] Setting up Frontend (Node.js packages)...
cd ..\frontend
npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install Node.js packages
    pause
    exit /b 1
)
echo ✓ Node.js packages installed

echo.
echo ===============================================
echo ✓ SETUP COMPLETED SUCCESSFULLY!
echo ===============================================
echo.
echo Next steps:
echo 1. Run "START_APP.bat" to launch the application
echo 2. Open browser to http://localhost:5173
echo 3. Start predicting heart disease risk!
echo.
pause
