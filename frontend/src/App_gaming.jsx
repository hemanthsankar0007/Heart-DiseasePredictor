import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [patientData, setPatientData] = useState({
    age: "", sex: "", cp: "", trestbps: "", chol: "", fbs: "",
    restecg: "", thalch: "", exang: "", oldpeak: "", slope: "", ca: "", thal: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [activeField, setActiveField] = useState('age');
  const [completedFields, setCompletedFields] = useState(new Set());
  const [showParticles, setShowParticles] = useState(true);

  // Gaming-style field information
  const fieldInfo = {
    age: {
      title: "Age Analysis",
      icon: "👤",
      description: "Your chronological age in years",
      normal: "Adult range: 18-65 years",
      risk: "Risk increases significantly after 45 (men) and 55 (women)",
      detail: "Age is the strongest predictor of cardiovascular disease. As we age, arteries naturally stiffen and heart muscle weakens.",
      color: "from-purple-500 to-pink-500"
    },
    sex: {
      title: "Biological Sex",
      icon: "⚥",
      description: "Biological sex impacts heart disease risk patterns",
      normal: "Both sexes can develop heart disease",
      risk: "Men have higher risk at younger ages, women's risk increases post-menopause",
      detail: "Hormonal differences affect cardiovascular health. Estrogen provides some protection before menopause.",
      color: "from-blue-500 to-cyan-500"
    },
    cp: {
      title: "Chest Pain Analysis",
      icon: "💓",
      description: "Type and pattern of chest discomfort",
      normal: "No chest pain or non-cardiac pain",
      risk: "Typical angina indicates possible coronary artery disease",
      detail: "Different chest pain types suggest varying levels of cardiac involvement and urgency.",
      color: "from-red-500 to-orange-500"
    },
    trestbps: {
      title: "Blood Pressure Monitor",
      icon: "🩺",
      description: "Resting systolic blood pressure measurement",
      normal: "Optimal: <120 mmHg, Normal: 120-129 mmHg",
      risk: "High: >140 mmHg indicates hypertension",
      detail: "Blood pressure measures the force of blood against artery walls. High pressure damages vessels over time.",
      color: "from-green-500 to-teal-500"
    },
    chol: {
      title: "Cholesterol Levels",
      icon: "🧪",
      description: "Total serum cholesterol concentration",
      normal: "Desirable: <200 mg/dL",
      risk: "High: >240 mg/dL significantly increases risk",
      detail: "Cholesterol builds up in arteries, forming plaques that can block blood flow to the heart.",
      color: "from-yellow-500 to-amber-500"
    },
    fbs: {
      title: "Blood Sugar Status",
      icon: "🍯",
      description: "Fasting blood glucose levels",
      normal: "Normal: <100 mg/dL fasting",
      risk: "Diabetes: >126 mg/dL doubles heart disease risk",
      detail: "High blood sugar damages blood vessels and increases atherosclerosis risk.",
      color: "from-orange-500 to-red-500"
    },
    restecg: {
      title: "ECG Analysis",
      icon: "📈",
      description: "Resting electrocardiogram results",
      normal: "Normal electrical activity patterns",
      risk: "Abnormalities may indicate heart muscle damage",
      detail: "ECG measures electrical activity of the heart, revealing rhythm and structural problems.",
      color: "from-indigo-500 to-purple-500"
    },
    thalch: {
      title: "Maximum Heart Rate",
      icon: "💝",
      description: "Peak heart rate achieved during exercise",
      normal: "Age-predicted maximum: 220 - age",
      risk: "Low max heart rate may indicate poor fitness or heart disease",
      detail: "Higher maximum heart rate generally indicates better cardiovascular fitness.",
      color: "from-pink-500 to-rose-500"
    },
    exang: {
      title: "Exercise Angina",
      icon: "🏃",
      description: "Chest pain triggered by physical activity",
      normal: "No exercise-induced chest pain",
      risk: "Exercise angina strongly suggests coronary artery disease",
      detail: "Chest pain during exercise indicates inadequate blood flow to heart muscle.",
      color: "from-cyan-500 to-blue-500"
    },
    oldpeak: {
      title: "ST Depression",
      icon: "📊",
      description: "Exercise-induced ST segment depression",
      normal: "Minimal or no ST depression (<1.0)",
      risk: "Significant depression (>2.0) indicates ischemia",
      detail: "ST depression on ECG during exercise suggests reduced blood flow to heart muscle.",
      color: "from-violet-500 to-purple-500"
    },
    slope: {
      title: "ST Slope Pattern",
      icon: "📈",
      description: "Slope of peak exercise ST segment",
      normal: "Upsloping pattern is most favorable",
      risk: "Flat or downsloping patterns suggest coronary disease",
      detail: "The shape of ST segment changes during exercise provides diagnostic information.",
      color: "from-emerald-500 to-green-500"
    },
    ca: {
      title: "Vessel Blockage",
      icon: "🫀",
      description: "Major vessels with significant narrowing",
      normal: "0 vessels with blockage",
      risk: "Each blocked vessel significantly increases risk",
      detail: "Coronary angiography reveals blocked arteries supplying the heart muscle.",
      color: "from-red-500 to-pink-500"
    },
    thal: {
      title: "Stress Test Results",
      icon: "🔬",
      description: "Thalassemia stress test findings",
      normal: "Normal perfusion patterns",
      risk: "Fixed or reversible defects indicate heart muscle damage",
      detail: "Nuclear stress tests show blood flow patterns to different areas of heart muscle.",
      color: "from-blue-500 to-indigo-500"
    }
  };

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
      { value: "0", label: "Normal (≤ 120 mg/dl)" },
      { value: "1", label: "High (> 120 mg/dl)" }
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

  const fieldConstraints = {
    age: { min: 1, max: 120, step: 1 },
    trestbps: { min: 60, max: 250, step: 1 },
    chol: { min: 50, max: 600, step: 1 },
    thalch: { min: 40, max: 220, step: 1 },
    oldpeak: { min: 0, max: 10, step: 0.1 }
  };

  // Calculate completion percentage
  const completionPercentage = (completedFields.size / Object.keys(patientData).length) * 100;

  useEffect(() => {
    // Update completed fields
    const completed = new Set();
    Object.entries(patientData).forEach(([key, value]) => {
      if (value !== "") completed.add(key);
    });
    setCompletedFields(completed);
  }, [patientData]);

  const updateField = (e) => {
    const { name, value } = e.target;
    setPatientData({ ...patientData, [name]: value });
    setActiveField(name);
    setError(null);
  };

  const submitPrediction = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:8000/predict', patientData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      
      setPrediction(response.data);
    } catch (error) {
      console.error('Prediction error:', error);
      if (error.code === 'ECONNREFUSED') {
        setError('Cannot connect to prediction service. Please ensure the backend server is running.');
      } else if (error.response) {
        setError(`Prediction failed: ${error.response.data?.detail || error.response.statusText}`);
      } else {
        setError(error.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
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
    setActiveField('age');
    setCompletedFields(new Set());
  };

  const Particles = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  );

  const renderField = (field) => {
    const isCompleted = completedFields.has(field);
    const isActive = activeField === field;
    const isSelect = fieldOptions[field];
    const constraints = fieldConstraints[field];

    const fieldClass = `
      w-full px-4 py-3 bg-gray-900/50 border-2 rounded-xl transition-all duration-300 backdrop-blur-sm
      ${isActive ? 'border-cyan-400 shadow-lg shadow-cyan-400/20 scale-105' : 
        isCompleted ? 'border-green-400 shadow-lg shadow-green-400/20' : 'border-gray-600 hover:border-gray-500'}
      text-white placeholder-gray-400 focus:outline-none
    `;

    if (isSelect) {
      return (
        <select
          name={field}
          value={patientData[field]}
          onChange={updateField}
          onFocus={() => setActiveField(field)}
          required
          className={fieldClass}
        >
          <option value="" className="bg-gray-800">Select {fieldInfo[field].title}</option>
          {fieldOptions[field].map(option => (
            <option key={option.value} value={option.value} className="bg-gray-800">
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="number"
        name={field}
        value={patientData[field]}
        onChange={updateField}
        onFocus={() => setActiveField(field)}
        required
        {...constraints}
        className={fieldClass}
        placeholder={`Enter ${fieldInfo[field].title.toLowerCase()}`}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Gaming-style background effects */}
      <div className="fixed inset-0 bg-gradient-radial from-blue-900/20 via-gray-900 to-black"></div>
      
      {/* Animated particles */}
      {showParticles && <Particles />}
      
      {/* Animated grid overlay */}
      <div className="fixed inset-0 opacity-10">
        <div className="w-full h-full bg-grid-pattern animate-pulse"></div>
      </div>

      <div className="relative z-10 min-h-screen p-4">
        {/* Gaming-style header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-6 shadow-2xl animate-pulse">
            <span className="text-4xl">❤️</span>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            CARDIAC RISK ANALYZER
          </h1>
          <p className="text-xl text-gray-300 mb-4">Advanced AI-Powered Heart Disease Prediction System</p>
          
          {/* Gaming-style progress bar */}
          <div className="max-w-md mx-auto mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{Math.round(completionPercentage)}%</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${completionPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="max-w-7xl mx-auto">
          {/* Prediction Results - Gaming Style */}
          {prediction && (
            <div className="mb-8 p-8 bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-6 flex items-center justify-center">
                  <span className="text-5xl mr-4">🔬</span>
                  ANALYSIS COMPLETE
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 p-6 rounded-2xl border border-red-500/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                    <div className="text-5xl font-bold text-red-400 mb-2">{prediction.risk_probability}%</div>
                    <div className="text-red-300">Risk Probability</div>
                  </div>
                  
                  <div className={`p-6 rounded-2xl border backdrop-blur-sm transform hover:scale-105 transition-all duration-300 ${
                    prediction.risk_level === 'Low Risk' ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30' :
                    prediction.risk_level === 'Moderate Risk' ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30' :
                    'bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30'
                  }`}>
                    <div className={`text-2xl font-semibold mb-2 ${
                      prediction.risk_level === 'Low Risk' ? 'text-green-400' :
                      prediction.risk_level === 'Moderate Risk' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {prediction.risk_level}
                    </div>
                    <div className="text-gray-300">Risk Level</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-6 rounded-2xl border border-blue-500/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                    <div className="text-2xl font-semibold text-blue-400 mb-2">{prediction.confidence}%</div>
                    <div className="text-blue-300">Confidence</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-600/30 backdrop-blur-sm mb-6">
                  <h3 className="font-semibold text-cyan-400 mb-3 text-xl">📋 Medical Recommendation:</h3>
                  <p className="text-gray-300 text-lg">{prediction.recommendation}</p>
                </div>
                
                <button
                  onClick={resetForm}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:from-purple-600 hover:to-pink-600"
                >
                  🔄 New Analysis
                </button>
              </div>
            </div>
          )}

          {/* Error Display - Gaming Style */}
          {error && (
            <div className="mb-6 p-6 bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl rounded-2xl border border-red-500/50">
              <p className="text-red-300 flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                {error}
              </p>
            </div>
          )}

          {/* Two-column layout - Gaming Enhanced */}
          {!prediction && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Panel - Information Display */}
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl border border-cyan-500/30 p-8 shadow-2xl shadow-cyan-500/10 sticky top-4 h-fit">
                <div className={`text-center mb-6 bg-gradient-to-r ${fieldInfo[activeField].color} p-1 rounded-2xl`}>
                  <div className="bg-gray-900 rounded-xl p-6">
                    <div className="text-6xl mb-4 animate-bounce">{fieldInfo[activeField].icon}</div>
                    <h2 className="text-3xl font-bold text-white mb-2">{fieldInfo[activeField].title}</h2>
                    <p className="text-gray-300 text-lg">{fieldInfo[activeField].description}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 p-4 rounded-xl border border-green-500/30">
                    <h3 className="font-semibold text-green-400 mb-2 flex items-center">
                      <span className="mr-2">✅</span> Normal Range
                    </h3>
                    <p className="text-green-300">{fieldInfo[activeField].normal}</p>
                  </div>

                  <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 p-4 rounded-xl border border-amber-500/30">
                    <h3 className="font-semibold text-amber-400 mb-2 flex items-center">
                      <span className="mr-2">⚠️</span> Risk Factors
                    </h3>
                    <p className="text-amber-300">{fieldInfo[activeField].risk}</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-4 rounded-xl border border-blue-500/30">
                    <h3 className="font-semibold text-blue-400 mb-2 flex items-center">
                      <span className="mr-2">🔬</span> Clinical Details
                    </h3>
                    <p className="text-blue-300">{fieldInfo[activeField].detail}</p>
                  </div>
                </div>
              </div>

              {/* Right Panel - Form */}
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-8 shadow-2xl shadow-purple-500/10">
                <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center">
                  <span className="mr-3 text-4xl">🎯</span>
                  Patient Data Input
                </h2>

                <form onSubmit={submitPrediction} className="space-y-6">
                  {Object.keys(patientData).map((field, index) => (
                    <div key={field} className="group">
                      <label className="flex items-center text-sm font-semibold text-gray-300 mb-3 group-hover:text-cyan-400 transition-colors">
                        <span className="text-2xl mr-3">{fieldInfo[field].icon}</span>
                        {fieldInfo[field].title}
                        <span className="text-red-400 ml-2">*</span>
                        {completedFields.has(field) && (
                          <span className="ml-auto text-green-400 animate-pulse">✅</span>
                        )}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}

                  <div className="pt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting || completionPercentage < 100}
                      className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white py-4 px-8 rounded-xl font-bold text-xl shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      {isSubmitting ? (
                        <>
                          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-2xl">ANALYZING...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-3xl">🚀</span>
                          <span className="text-2xl">INITIATE ANALYSIS</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Gaming-style footer */}
        <div className="text-center mt-12 pb-8">
          <div className="max-w-md mx-auto bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl border border-gray-600/30 p-6">
            <p className="text-gray-400 flex items-center justify-center space-x-2">
              <span className="text-xl">⚡</span>
              <span>Powered by XGBoost AI</span>
              <span className="text-xl">🔒</span>
              <span>Secure & Private</span>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .bg-gradient-radial {
          background: radial-gradient(ellipse at top, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}

export default App;
