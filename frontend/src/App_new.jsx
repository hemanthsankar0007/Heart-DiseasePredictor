import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const API_URL = "https://heart-disease-backend-p4bm.onrender.com";

  const [patientData, setPatientData] = useState({
    age: '',
    sex: '',
    cp: '',
    trestbps: '',
    chol: '',
    fbs: '',
    restecg: '',
    thalch: '',
    exang: '',
    oldpeak: '',
    slope: '',
    ca: '',
    thal: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeFeature, setActiveFeature] = useState('age');

  const featureInfo = {
    age: {
      title: "Age",
      description: "Patient's age in years. Age is a significant risk factor for heart disease.",
      normalRange: "18-100 years",
      riskFactors: "Risk increases significantly after age 45 (men) and 55 (women)",
      details: "Aging causes changes in the heart muscle, blood vessels, and heart rhythm.",
      icon: "🎂"
    },
    sex: {
      title: "Gender",
      description: "Biological sex of the patient.",
      normalRange: "Male (1) or Female (0)",
      riskFactors: "Men have higher early risk, women's risk rises after menopause",
      details: "Hormones play a huge role in cardiovascular health.",
      icon: "👥"
    },
    cp: {
      title: "Chest Pain Type",
      description: "Classification of chest pain.",
      normalRange: "Asymptomatic (3)",
      riskFactors: "Typical angina (0) indicates highest risk",
      details: "0=Typical, 1=Atypical, 2=Non-anginal, 3=Asymptomatic",
      icon: "💔"
    },
    trestbps: {
      title: "Resting Blood Pressure",
      description: "Blood pressure in mmHg.",
      normalRange: "90-120",
      riskFactors: "≥140 indicates hypertension",
      details: "High BP forces the heart to work harder.",
      icon: "🩺"
    },
    chol: {
      title: "Cholesterol",
      description: "Serum cholesterol in mg/dl.",
      normalRange: "<200 mg/dl",
      riskFactors: "≥240 mg/dl is high",
      details: "High cholesterol = artery blockage risk.",
      icon: "🧪"
    },
    fbs: {
      title: "Fasting Blood Sugar",
      description: "Indicates diabetes risk.",
      normalRange: "≤120 mg/dl",
      riskFactors: ">120 mg/dl indicates diabetes",
      details: "Diabetes heavily increases cardiac risk.",
      icon: "🍯"
    },
    restecg: {
      title: "Resting ECG",
      description: "ECG at rest.",
      normalRange: "Normal (0)",
      riskFactors: "Abnormal readings indicate issues",
      details: "0=Normal, 1=ST-T abnormality, 2=LV hypertrophy",
      icon: "📈"
    },
    thalch: {
      title: "Max Heart Rate",
      description: "Peak heart rate during stress test.",
      normalRange: "220 - age",
      riskFactors: "Low max HR = poor fitness",
      details: "Higher HR capacity = stronger heart.",
      icon: "💓"
    },
    exang: {
      title: "Exercise Angina",
      description: "Chest pain during exercise.",
      normalRange: "No (0)",
      riskFactors: "Yes (1) indicates coronary blockage",
      details: "Exercise angina is a major red flag.",
      icon: "🏃‍♂️"
    },
    oldpeak: {
      title: "ST Depression",
      description: "ST depression on ECG.",
      normalRange: "0.0 - 1.0",
      riskFactors: ">2.0 indicates serious disease",
      details: "Shows oxygen shortage in heart muscle.",
      icon: "📉"
    },
    slope: {
      title: "ST Slope",
      description: "Slope of ST segment.",
      normalRange: "Upsloping (0)",
      riskFactors: "Downsloping (2) = highest risk",
      details: "0=Upslope, 1=Flat, 2=Downsloping",
      icon: "📊"
    },
    ca: {
      title: "Major Vessels Blocked",
      description: "0-3 blocked vessels.",
      normalRange: "0",
      riskFactors: "More blockages = higher risk",
      details: "Direct indicator of coronary artery disease.",
      icon: "🔍"
    },
    thal: {
      title: "Thalassemia",
      description: "Blood disorder affecting oxygen flow.",
      normalRange: "0=Normal",
      riskFactors: "2=Reversible defect",
      details: "Affects blood oxygen delivery.",
      icon: "🩸"
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prev => ({
      ...prev,
      [name]: value
    }));
    setActiveFeature(name);
  };

  const renderField = (fieldName, label, options = null) => {
    const isActive = activeFeature === fieldName;

    if (options) {
      return (
        <div className={`${isActive ? 'ring-2 ring-blue-500' : ''}`}>
          <label className="block mb-2 font-semibold">{label}</label>
          <select
            name={fieldName}
            value={patientData[fieldName]}
            onChange={handleInputChange}
            onFocus={() => setActiveFeature(fieldName)}
            className="w-full p-3 border rounded-lg"
            required
          >
            <option value="">Select {label}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div className={`${isActive ? 'ring-2 ring-blue-500' : ''}`}>
        <label className="block mb-2 font-semibold">{label}</label>
        <input
          type="number"
          name={fieldName}
          value={patientData[fieldName]}
          onChange={handleInputChange}
          onFocus={() => setActiveFeature(fieldName)}
          className="w-full p-3 border rounded-lg"
          step="0.1"
          required
        />
      </div>
    );
  };

  const submitPrediction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await axios.post(
        `${API_URL}/predict`,
        patientData,
        { timeout: 20000 }
      );

      setPrediction(response.data);
    } catch (err) {
      setError("Backend error: " + (err.response?.data?.detail || "Unable to reach prediction API."));
    } finally {
      setLoading(false);
    }
  };

  const currentFeature = featureInfo[activeFeature];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4 text-center">Heart Disease Predictor</h1>
        <p className="text-center text-gray-600 mb-10">
          Enter patient data → get AI-based heart disease prediction
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT PANEL */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">{currentFeature.icon}</span>
              {currentFeature.title}
            </h2>

            <p className="text-gray-700 mb-4">{currentFeature.description}</p>

            <div className="p-4 bg-green-50 rounded-lg mb-3">
              <strong>Normal Range:</strong> {currentFeature.normalRange}
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg mb-3">
              <strong>Risk Factors:</strong> {currentFeature.riskFactors}
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <strong>Clinical Notes:</strong> {currentFeature.details}
            </div>
          </div>

          {/* RIGHT PANEL (FORM) */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6">Patient Data</h2>

            <form onSubmit={submitPrediction} className="space-y-5">

              {renderField("age", "Age")}
              {renderField("sex", "Gender", [
                { value: "0", label: "Female" },
                { value: "1", label: "Male" }
              ])}

              {renderField("cp", "Chest Pain Type", [
                { value: "0", label: "Typical Angina" },
                { value: "1", label: "Atypical Angina" },
                { value: "2", label: "Non-Anginal" },
                { value: "3", label: "Asymptomatic" }
              ])}

              {renderField("trestbps", "Resting BP")}
              {renderField("chol", "Cholesterol")}
              {renderField("fbs", "Fasting Blood Sugar", [
                { value: "0", label: "Normal" },
                { value: "1", label: "High" }
              ])}

              {renderField("restecg", "Rest ECG", [
                { value: "0", label: "Normal" },
                { value: "1", label: "Abnormal" },
                { value: "2", label: "LV Hypertrophy" }
              ])}

              {renderField("thalch", "Max Heart Rate")}
              {renderField("exang", "Exercise Angina", [
                { value: "0", label: "No" },
                { value: "1", label: "Yes" }
              ])}

              {renderField("oldpeak", "ST Depression")}
              {renderField("slope", "ST Slope", [
                { value: "0", label: "Upsloping" },
                { value: "1", label: "Flat" },
                { value: "2", label: "Downsloping" }
              ])}

              {renderField("ca", "Major Vessels", [
                { value: "0", label: "0" },
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" }
              ])}

              {renderField("thal", "Thalassemia", [
                { value: "0", label: "Normal" },
                { value: "1", label: "Fixed Defect" },
                { value: "2", label: "Reversible Defect" }
              ])}

              <button 
                type="submit" 
                className="w-full bg-red-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-red-700 transition"
              >
                {loading ? "Analyzing..." : "Predict"}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
                ❌ {error}
              </div>
            )}

            {prediction && (
              <div className="mt-6 p-6 bg-gray-50 rounded-xl border">
                <h3 className="text-xl font-bold mb-4">Results</h3>

                <p><strong>Risk Probability:</strong> {prediction.risk_probability}%</p>
                <p><strong>Risk Level:</strong> {prediction.risk_level}</p>
                <p><strong>Recommendation:</strong> {prediction.recommendation}</p>
                <p><strong>Confidence:</strong> {prediction.confidence}%</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
