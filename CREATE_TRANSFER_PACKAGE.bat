@echo off
echo ===============================================
echo CREATING TRANSFER PACKAGE ZIP
echo ===============================================
echo.

echo [INFO] Checking if 7-Zip is available...
where 7z >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ 7-Zip found, creating compressed package...
    7z a -tzip "HeartDisease-App-Complete.zip" "*" -x!*.zip
    echo ✅ Package created: HeartDisease-App-Complete.zip
) else (
    echo [INFO] 7-Zip not found, checking for PowerShell compression...
    powershell -Command "Compress-Archive -Path '.\*' -DestinationPath '.\HeartDisease-App-Complete.zip' -Force" >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Package created: HeartDisease-App-Complete.zip
    ) else (
        echo ❌ Could not create zip file automatically
        echo Please manually zip this folder for transfer
    )
)

echo.
echo ===============================================
echo TRANSFER PACKAGE READY!
echo ===============================================
echo.
echo The complete Heart Disease Prediction App package is ready.
echo.
echo TO TRANSFER TO YOUR FRIEND:
echo 1. Copy the entire 'transfer-package' folder to USB/cloud storage
echo 2. OR use the HeartDisease-App-Complete.zip file if created
echo 3. Share the QUICK_START_GUIDE.md with your friend
echo.
echo YOUR FRIEND SHOULD:
echo 1. Extract files to their Desktop
echo 2. Install Python 3.8+ and Node.js 16+
echo 3. Run COMPLETE_SETUP.bat
echo 4. Run START_APP.bat
echo 5. Enjoy the app at http://localhost:5173
echo.
pause
