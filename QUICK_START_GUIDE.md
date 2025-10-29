# Heart Disease Prediction App - Quick Reference

## 🚀 SUPER QUICK START (For Your Friend)

### Step 1: Install Requirements (One-time only)
1. **Python**: Download from https://python.org → Install → CHECK "Add to PATH"
2. **Node.js**: Download from https://nodejs.org → Install with defaults
3. **Restart computer**

### Step 2: Setup App (One-time only)
1. Extract `transfer-package` folder to Desktop
2. Double-click `COMPLETE_SETUP.bat` (takes 5-10 minutes)
3. Wait for "SETUP COMPLETED SUCCESSFULLY!" message

### Step 3: Run App (Every time you want to use it)
1. Double-click `START_APP.bat`
2. Browser opens automatically at http://localhost:5173
3. Start predicting heart disease risk! 🫀

### Step 4: Stop App (When done)
- Double-click `STOP_APP.bat` OR
- Close both terminal windows

---

## 🎮 How to Use the App

1. **Fill out patient information** (13 medical parameters)
2. **Navigate manually** using PREVIOUS/NEXT buttons
3. **Click "INITIATE ANALYSIS"** when all fields completed
4. **Get instant AI prediction** with risk level and recommendations

---

## 🔧 Troubleshooting

### Common Issues:
- **"Python not found"** → Reinstall Python with "Add to PATH" checked
- **"Node not found"** → Reinstall Node.js
- **Port already in use** → Run `STOP_APP.bat` first
- **Model not loading** → Ensure `xgb_heart_model.pkl` is in backend folder

### Still Need Help?
Contact the original developer with specific error messages!

---

## 📋 Medical Parameters Explained

| Parameter | What It Means | Typical Values |
|-----------|---------------|----------------|
| Age | Patient age in years | 20-80 |
| Sex | Biological sex | Female=0, Male=1 |
| Chest Pain | Type of chest pain | 0-3 (None to Severe) |
| Blood Pressure | Resting BP | 90-200 mmHg |
| Cholesterol | Serum cholesterol | 100-400 mg/dL |
| Blood Sugar | Fasting glucose > 120 | No=0, Yes=1 |
| ECG | Resting ECG results | 0-2 (Normal to Abnormal) |
| Heart Rate | Maximum achieved | 60-220 bpm |
| Exercise Angina | Pain during exercise | No=0, Yes=1 |
| ST Depression | ECG ST segment | 0.0-6.0 |
| Slope | Peak exercise ST slope | 0-2 |
| Major Vessels | Colored by fluoroscopy | 0-3 |
| Thalassemia | Blood disorder type | 0-3 |

---

## ⚠️ IMPORTANT MEDICAL DISCLAIMER

**This app is for EDUCATIONAL PURPOSES ONLY!**

- NOT a substitute for professional medical advice
- NOT for actual medical diagnosis
- Always consult healthcare professionals
- In emergency situations, call emergency services

---

*Have fun exploring AI-powered health predictions! 🤖❤️*
