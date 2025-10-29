# Troubleshooting Guide - Heart Disease Prediction App

## Installation Issues

### Python Not Found
**Error**: `'python' is not recognized as an internal or external command`

**Solution**:
1. Uninstall current Python if installed
2. Download Python from https://python.org/downloads
3. During installation: ✅ CHECK "Add Python to PATH" 
4. Restart computer
5. Test: Open Command Prompt → type `python --version`

### Node.js Not Found  
**Error**: `'node' is not recognized as an internal or external command`

**Solution**:
1. Download Node.js from https://nodejs.org
2. Install with default settings (automatically adds to PATH)
3. Restart computer
4. Test: Open Command Prompt → type `node --version`

### Virtual Environment Creation Failed
**Error**: `ERROR: Failed to create virtual environment`

**Solution**:
1. Open Command Prompt as Administrator
2. Run: `pip install --upgrade pip`
3. Run: `pip install virtualenv`
4. Try setup again

---

## Runtime Issues

### Port 8000 Already in Use
**Error**: Backend fails to start with port conflict

**Solution**:
1. Run `STOP_APP.bat` first
2. Or manually kill processes:
   - Open Task Manager
   - End all Python.exe processes
   - End all Node.exe processes
3. Try starting app again

### Port 5173 Already in Use
**Error**: Frontend fails to start

**Solution**:
1. Close all browser tabs with localhost:5173
2. Run `STOP_APP.bat`
3. Wait 10 seconds
4. Run `START_APP.bat` again

### Model Not Loading
**Error**: `Model not loaded. Please ensure xgb_heart_model.pkl is in the backend folder`

**Solution**:
1. Check if `xgb_heart_model.pkl` exists in `backend/` folder
2. If missing, contact original developer for model file
3. Ensure file is not corrupted (should be ~200KB)

---

## Network Issues

### CORS Errors
**Error**: Frontend can't connect to backend

**Solution**:
1. Ensure both backend and frontend are running
2. Check URLs:
   - Backend: http://localhost:8000
   - Frontend: http://localhost:5173
3. Clear browser cache and cookies
4. Try incognito/private browsing mode

### Prediction Timeout
**Error**: Request takes too long or fails

**Solution**:
1. Check backend terminal for error messages
2. Ensure all 13 form fields are filled
3. Try refreshing the page
4. Restart both backend and frontend

---

## Performance Issues

### Slow Startup
**Problem**: App takes long time to start

**Solutions**:
- Disable antivirus temporarily during setup
- Close other applications using ports 8000/5173
- Ensure sufficient RAM (4GB minimum)
- Check internet connection during npm install

### High CPU Usage
**Problem**: Computer becomes slow when app runs

**Solutions**:
- Close unnecessary applications
- Use Task Manager to monitor resource usage
- Restart computer if needed
- Run app when computer is not busy with other tasks

---

## Browser Issues

### Page Not Loading
**Problem**: http://localhost:5173 shows error

**Check**:
1. Frontend terminal shows "Local: http://localhost:5173"
2. No firewall blocking localhost
3. Try different browser (Chrome, Firefox, Edge)
4. Clear browser cache

### Prediction Button Not Working
**Problem**: "INITIATE ANALYSIS" button doesn't respond

**Solutions**:
1. Fill ALL 13 required fields
2. Check browser console for JavaScript errors (F12)
3. Ensure backend is running (check http://localhost:8000)
4. Refresh page and try again

---

## Data Issues

### Invalid Input Values
**Error**: Prediction fails with validation error

**Solutions**:
- Age: Enter number between 20-100
- Blood Pressure: Enter number between 80-250
- Cholesterol: Enter number between 100-500
- Heart Rate: Enter number between 60-220
- ST Depression: Enter number between 0-6

### Missing Fields
**Error**: Some fields appear empty or missing

**Solutions**:
1. Scroll to see all form sections
2. Use NEXT/PREVIOUS buttons to navigate
3. Ensure JavaScript is enabled in browser
4. Try refreshing the page

---

## Advanced Troubleshooting

### Check Backend Status
1. Open browser → Go to http://localhost:8000
2. Should show: `{"message":"Heart Disease Prediction API is running! ❤️"}`

### Check Frontend Status  
1. Open browser → Go to http://localhost:5173
2. Should show the gaming-style heart disease prediction interface

### View Logs
- **Backend logs**: Check the "Backend Server" terminal window
- **Frontend logs**: Check the "Frontend App" terminal window
- **Browser logs**: Press F12 → Console tab

### Manual Testing
Test the API directly:
1. Go to http://localhost:8000/docs
2. Try the `/health` endpoint
3. Test prediction with sample data

---

## Getting Help

### Before Contacting Support:
1. ✅ Try all solutions above
2. ✅ Note exact error messages
3. ✅ Check both terminal windows for errors
4. ✅ Try restarting the entire process

### Information to Include:
- Windows version
- Python version (`python --version`)
- Node.js version (`node --version`)
- Exact error message
- Screenshot of error (if applicable)
- Which step failed

### Contact:
Message the original developer with all the above information for fastest help!

---

## Emergency Reset

If nothing works, try a complete reset:

1. **Stop all processes**:
   - Run `STOP_APP.bat`
   - Close all terminal windows
   - End Python/Node processes in Task Manager

2. **Clean restart**:
   - Restart computer
   - Re-extract transfer-package folder
   - Run `COMPLETE_SETUP.bat` again

3. **Fresh installation**:
   - Uninstall Python and Node.js
   - Restart computer
   - Reinstall both with correct settings
   - Run setup again

This should resolve 95% of all issues! 💪
