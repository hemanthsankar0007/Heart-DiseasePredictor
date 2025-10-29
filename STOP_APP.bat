@echo off
echo ===============================================
echo STOPPING HEART DISEASE PREDICTION APP
echo ===============================================
echo.

echo [INFO] Killing backend processes on port 8000...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000"') do (
    echo Killing process %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo [INFO] Killing frontend processes on port 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173"') do (
    echo Killing process %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo [INFO] Killing Node.js processes...
taskkill /f /im node.exe >nul 2>&1

echo.
echo [INFO] Killing Python processes...
taskkill /f /im python.exe >nul 2>&1

echo.
echo ===============================================
echo ✓ APPLICATION STOPPED!
echo ===============================================
echo.
echo All app processes have been terminated.
echo You can now restart the app using START_APP.bat
echo.
pause
