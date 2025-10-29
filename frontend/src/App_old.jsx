// filepath: c:\Users\heman\Desktop\RAM-CAPSTONE\frontend\src\App.jsx
import { useState } from "react";
import axios from "axios";

function App() {
  const [patientData, setPatientData] = useState({
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalch: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const fieldLabels = {
    age: "Age (years)",
    sex: "Gender",
    cp: "Chest Pain Type",
    trestbps: "Resting Blood Pressure (mmHg)",
    chol: "Cholesterol Level (mg/dl)",
    fbs: "Fasting Blood Sugar > 120 mg/dl",
    restecg: "Resting ECG Results",
    thalch: "Maximum Heart Rate Achieved",
    exang: "Exercise Induced Angina",
    oldpeak: "ST Depression (Exercise vs Rest)",
    slope: "Peak Exercise ST Segment Slope",
    ca: "Major Vessels Colored by Fluoroscopy",
    thal: "Thalassemia Type"
  };

  // Define dropdown options for categorical fields (using encoded values)
  const fieldOptions = {
    sex: [
      { value: "0", label: "Female" },
      { value: "1", label: "Male" }
    ],
    cp: [
      { value: "0", label: "Typical Angina" },
      { value: "1", label: "Atypical Angina" },
      { value: "2", label: "Non-Anginal Pain" },
      { value: "3", label: "Asymptomatic" }
    ],
    fbs: [
      { value: "0", label: "False (≤ 120 mg/dl)" },
      { value: "1", label: "True (> 120 mg/dl)" }
    ],
    restecg: [
      { value: "0", label: "Normal" },
      { value: "1", label: "ST-T Wave Abnormality" },
      { value: "2", label: "Left Ventricular Hypertrophy" }
    ],
    exang: [
      { value: "0", label: "No" },
      { value: "1", label: "Yes" }
    ],
    slope: [
      { value: "0", label: "Upsloping" },
      { value: "1", label: "Flat" },
      { value: "2", label: "Downsloping" }
    ],
    ca: [
      { value: "0", label: "0 vessels" },
      { value: "1", label: "1 vessel" },
      { value: "2", label: "2 vessels" },
      { value: "3", label: "3 vessels" }
    ],
    thal: [
      { value: "0", label: "Normal" },
      { value: "1", label: "Fixed Defect" },
      { value: "2", label: "Reversible Defect" },
      { value: "3", label: "Unknown" }
    ]
  };

  // Define input constraints for numeric fields
  const fieldConfig = {
    age: { type: "number", min: 1, max: 120, step: 1 },
    trestbps: { type: "number", min: 60, max: 250, step: 1 },
    chol: { type: "number", min: 50, max: 600, step: 1 },
    thalch: { type: "number", min: 40, max: 220, step: 1 },
    oldpeak: { type: "number", min: 0, max: 10, step: 0.1 }
  };

  const updateField = (e) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value });
    setError(null); // Clear error when user types
  };

  const submitPrediction = async (e) => {
    e.preventDefault();
    console.log("🚀 Form submitted!");
    console.log("📋 Current patient data:", patientData);
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log("📡 Sending request to backend...");
      
      const response = await axios.post('http://localhost:8000/predict', patientData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });
      
      console.log("✅ Received response:", response.data);
      setPrediction(response.data);
      
    } catch (error) {
      console.error('❌ Error occurred:', error);
      
      let errorMessage = 'An unexpected error occurred.';
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to prediction service. Please ensure the backend server is running.';
      } else if (error.response) {
        console.error('📋 Error response:', error.response.data);
        errorMessage = `Server error: ${error.response.data?.detail || error.response.statusText}`;
      } else if (error.request) {
        console.error('📋 No response received:', error.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        console.error('📋 Request setup error:', error.message);
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      console.log("🏁 Request completed, setting isSubmitting to false");
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPatientData({
      age: "", sex: "", cp: "", trestbps: "", chol: "", fbs: "",
      restecg: "", thalch: "", exang: "", oldpeak: "", slope: "", ca: "", thal: ""
    });
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-blue-50 p-4">
      {/* Floating Elements for Visual Appeal */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-red-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-pink-200 rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-200 rounded-full opacity-25 animate-pulse"></div>
      
      <div className="flex items-center justify-center min-h-screen py-8">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-4xl border border-white/20">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-4 shadow-lg">
              <span className="text-3xl text-white">❤️</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Heart Disease Risk Assessment
            </h1>
            <p className="text-gray-600 text-lg">UCI Heart Disease Dataset - Clinical Analysis</p>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Prediction Result */}
          {prediction && (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🔬 Analysis Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-red-600">{prediction.risk_probability}%</div>
                    <div className="text-sm text-gray-600">Risk Probability</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className={`text-lg font-semibold ${
                      prediction.risk_level === 'Low Risk' ? 'text-green-600' :
                      prediction.risk_level === 'Moderate Risk' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {prediction.risk_level}
                    </div>
                    <div className="text-sm text-gray-600">Risk Level</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="text-lg font-semibold text-blue-600">{prediction.confidence}%</div>
                    <div className="text-sm text-gray-600">Confidence</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-2">📋 Recommendation:</h3>
                  <p className="text-gray-700">{prediction.recommendation}</p>
                </div>
                <button
                  onClick={resetForm}
                  className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  New Assessment
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">❌ {error}</p>
            </div>
          )}

          {/* Form Section */}
          {!prediction && (
            <form onSubmit={submitPrediction} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(patientData).map((field) => (
                  <div key={field} className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-red-600 transition-colors">
                      {fieldLabels[field]}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      {fieldOptions[field] ? (
                        // Dropdown for categorical fields
                        <select
                          name={field}
                          value={patientData[field]}
                          onChange={updateField}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-red-300 group-hover:shadow-md appearance-none cursor-pointer"
                        >
                          <option value="">Select {fieldLabels[field]}</option>
                          {fieldOptions[field].map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      ) : (
                        // Number input for numeric fields
                        <input
                          type={fieldConfig[field]?.type || "number"}
                          name={field}
                          value={patientData[field]}
                          onChange={updateField}
                          required
                          min={fieldConfig[field]?.min}
                          max={fieldConfig[field]?.max}
                          step={fieldConfig[field]?.step}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-red-300 group-hover:shadow-md"
                          placeholder={`Enter ${fieldLabels[field].toLowerCase()}`}
                        />
                      )}
                      
                      {/* Dropdown Arrow Icon */}
                      {fieldOptions[field] && (
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Input Indicator for Number Fields */}
                      {!fieldOptions[field] && (
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Help Text for Specific Fields */}
                    {field === 'stressLevel' && (
                      <p className="text-xs text-gray-500 mt-1">Scale: 1 (Very Low) to 10 (Very High)</p>
                    )}
                    {field === 'exerciseHours' && (
                      <p className="text-xs text-gray-500 mt-1">Average hours per week</p>
                    )}
                    {field === 'bloodPressure' && (
                      <p className="text-xs text-gray-500 mt-1">Systolic pressure (top number)</p>
                    )}
                  </div>
                ))}
              </div>            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    <span>Analyze Cardiac Risk</span>
                  </>
                )}
              </button>
            </div>

            {/* Footer Info */}
            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                ⚡ Powered by XGBoost ML Model • 🔒 Your data is secure
              </p>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;