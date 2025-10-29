import { useState } from "react";
import axios from "axios";

function App() {
  const [patientData, setPatientData] = useState({
    age: "",
    gender: "",
    cholesterol: "",
    bloodPressure: "",
    heartRate: "",
    smoking: "",
    alcoholIntake: "",
    exerciseHours: "",
    familyHistory: "",
    diabetes: "",
    obesity: "",
    stressLevel: "",
    bloodSugar: "",
    exerciseInducedAngina: "",
    chestPainType: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const fieldLabels = {
    age: "Age (years)",
    gender: "Gender",
    cholesterol: "Cholesterol (mg/dl)",
    bloodPressure: "Blood Pressure (mmHg)",
    heartRate: "Heart Rate (bpm)",
    smoking: "Smoking Status",
    alcoholIntake: "Alcohol Intake",
    exerciseHours: "Exercise Hours per Week",
    familyHistory: "Family History of Heart Disease",
    diabetes: "Diabetes",
    obesity: "Obesity",
    stressLevel: "Stress Level (1-10)",
    bloodSugar: "Blood Sugar (mg/dl)",
    exerciseInducedAngina: "Exercise Induced Angina",
    chestPainType: "Chest Pain Type"
  };

  const fieldOptions = {
    gender: ["Male", "Female"],
    smoking: ["Never", "Former", "Current"],
    alcoholIntake: ["None", "Moderate", "Heavy"],
    familyHistory: ["No", "Yes"],
    diabetes: ["No", "Yes"],
    obesity: ["No", "Yes"],
    exerciseInducedAngina: ["No", "Yes"],
    chestPainType: ["Typical Angina", "Atypical Angina", "Non-anginal Pain", "Asymptomatic"]
  };

  const updateField = (e) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value });
    setError(null);
  };

  const submitPrediction = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log("Submitting data:", patientData);
      
      const response = await axios.post('http://localhost:8000/predict', patientData);
      console.log("Response:", response.data);
      
      setPrediction(response.data);
      
    } catch (error) {
      console.error('Error:', error);
      setError('Prediction failed. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPatientData({
      age: "", gender: "", cholesterol: "", bloodPressure: "", heartRate: "",
      smoking: "", alcoholIntake: "", exerciseHours: "", familyHistory: "",
      diabetes: "", obesity: "", stressLevel: "", bloodSugar: "",
      exerciseInducedAngina: "", chestPainType: ""
    });
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-blue-50 p-4">
      <div className="flex items-center justify-center min-h-screen py-8">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-6xl border border-white/20">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-4 shadow-lg">
              <span className="text-3xl text-white">🫀</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Heart Disease Risk Assessment
            </h1>
            <p className="text-gray-600 text-lg">Advanced AI-powered cardiac health analysis</p>
          </div>

          {/* Prediction Results */}
          {prediction && (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">🔬 Analysis Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                  <div className="text-3xl font-bold text-red-600">{prediction.risk_probability}%</div>
                  <div className="text-sm text-gray-600">Risk Probability</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                  <div className={`text-lg font-semibold ${
                    prediction.risk_level === 'Low Risk' ? 'text-green-600' :
                    prediction.risk_level === 'Moderate Risk' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {prediction.risk_level}
                  </div>
                  <div className="text-sm text-gray-600">Risk Level</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                  <div className="text-lg font-semibold text-blue-600">{prediction.confidence}%</div>
                  <div className="text-sm text-gray-600">Confidence</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">📋 Recommendation:</h3>
                <p className="text-gray-700">{prediction.recommendation}</p>
              </div>
              <div className="text-center mt-4">
                <button
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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

          {/* Form */}
          {!prediction && (
            <form onSubmit={submitPrediction} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(patientData).map((field) => (
                  <div key={field} className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {fieldLabels[field]} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      {fieldOptions[field] ? (
                        <select
                          name={field}
                          value={patientData[field]}
                          onChange={updateField}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all duration-300 bg-white"
                        >
                          <option value="">Select {fieldLabels[field]}</option>
                          {fieldOptions[field].map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="number"
                          name={field}
                          value={patientData[field]}
                          onChange={updateField}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all duration-300 bg-white"
                          placeholder={`Enter ${fieldLabels[field].toLowerCase()}`}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
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
            </form>
          )}

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              ⚡ Powered by XGBoost ML Model • 🔒 Your data is secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
