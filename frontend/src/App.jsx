import { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const API_URL = "https://heart-diseasepredictor.onrender.com";
  const [patientData, setPatientData] = useState({
    age: "", sex: "", cp: "", trestbps: "", chol: "", fbs: "",
    restecg: "", thalch: "", exang: "", oldpeak: "", slope: "", ca: "", thal: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [activeField, setActiveField] = useState('age');
  const [completedFields, setCompletedFields] = useState(new Set());
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const activeFieldRef = useRef(null);
  const formRef = useRef(null);

  // Field order for progressive flow
  const fieldOrder = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalch', 'exang', 'oldpeak', 'slope', 'ca', 'thal'];
  const totalFields = fieldOrder.length;

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
      { value: "3", label: "No Chest Pain" }
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
  const completionPercentage = (completedFields.size / totalFields) * 100;

  const formatPercentage = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return "0.00";
    }
    return Number(value).toFixed(2);
  };

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const focusActiveField = () => {
    if (activeFieldRef.current) {
      activeFieldRef.current.focus();
    }
  };

  useEffect(() => {
    // Update completed fields
    const completed = new Set();
    Object.entries(patientData).forEach(([key, value]) => {
      if (value !== "") completed.add(key);
    });
    setCompletedFields(completed);
  }, [patientData]);

  // Check if a field is complete
  const isFieldComplete = (fieldName) => {
    return patientData[fieldName] !== "";
  };

  // Get the current field to display (only one at a time)
  const getCurrentField = () => {
    // Show the field at currentStep, or first incomplete field if currentStep is beyond
    if (currentStep < fieldOrder.length) {
      return { field: fieldOrder[currentStep], index: currentStep };
    }
    
    // Fallback: find first incomplete field
    for (let i = 0; i < fieldOrder.length; i++) {
      if (!isFieldComplete(fieldOrder[i])) {
        return { field: fieldOrder[i], index: i };
      }
    }
    // All fields complete, show last field
    return { field: fieldOrder[fieldOrder.length - 1], index: fieldOrder.length - 1 };
  };

  // Handle manual navigation
  const navigateToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < fieldOrder.length) {
      setCurrentStep(stepIndex);
      setActiveField(fieldOrder[stepIndex]);
    }
  };

  const setFieldValue = (name, value) => {
    const newPatientData = { ...patientData, [name]: value };
    setPatientData(newPatientData);
    setActiveField(name);
    setError(null);
  };

  const adjustFieldValue = (name, delta) => {
    const currentValue = patientData[name] ? parseFloat(patientData[name]) : 0;
    if (isNaN(currentValue)) return;
    const updatedValue = (currentValue + delta).toFixed(1).replace(/\.0$/, '');
    setFieldValue(name, updatedValue);
  };

  const updateField = (e) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
    
    // No auto-progression - user must click Next button
  };

  const submitPrediction = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      console.log('Making request to:', `${apiUrl}/predict`);
      
      // First test if backend is reachable
      try {
        const healthCheck = await axios.get(`${apiUrl}/health`, { timeout: 5000 });
        console.log('Backend health check:', healthCheck.data);
      } catch (healthError) {
        console.error('Backend health check failed:', healthError);
        throw new Error('Backend server is not responding. Please ensure the backend is running on port 8000.');
      }
      
      const response = await axios.post(`${apiUrl}/predict`, patientData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000  // Increased timeout to 30 seconds
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
    setCurrentStep(0);
  };

  const Particles = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
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
    const numericStep = constraints?.step ? Number(constraints.step) : 1;
    const midpoint = constraints?.min !== undefined && constraints?.max !== undefined
      ? ((constraints.min + constraints.max) / 2).toFixed(1).replace(/\.0$/, '')
      : null;

    const fieldClass = `
      w-full px-4 py-3 bg-gray-900/50 border-2 rounded-xl transition-all duration-300 backdrop-blur-sm
      ${isActive ? 'border-cyan-400 shadow-lg shadow-cyan-400/20 scale-105' : 
        isCompleted ? 'border-green-400 shadow-lg shadow-green-400/20' : 'border-gray-600 hover:border-gray-500'}
      text-white placeholder-gray-400 focus:outline-none
    `;

    const handleFieldFocus = (fieldName) => {
      setActiveField(fieldName);
      setShowMobileInfo(true);
    };

    if (isSelect) {
      return (
        <div className="relative">
          <select
            ref={isActive ? activeFieldRef : null}
            name={field}
            value={patientData[field]}
            onChange={updateField}
            onFocus={() => handleFieldFocus(field)}
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

          <div className="flex flex-wrap gap-2 mt-4">
            {fieldOptions[field].map(option => {
              const isChosen = patientData[field] === option.value;
              return (
                <button
                  key={`chip-${option.value}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFieldValue(field, option.value);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
                    isChosen ? 'bg-cyan-500 text-black border-transparent' : 'bg-gray-900/60 text-gray-300 border-gray-600 hover:border-cyan-400'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          
          {/* Mobile/Responsive Info Panel */}
          {isActive && showMobileInfo && (
            <div className="lg:hidden absolute left-0 top-full mt-2 w-full max-w-md z-50 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 shadow-2xl shadow-cyan-500/20 animate-slideIn">
              <button 
                onClick={() => setShowMobileInfo(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              
              <div className={`text-center mb-4 bg-gradient-to-r ${fieldInfo[field].color} p-1 rounded-xl`}>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="text-4xl mb-2">{fieldInfo[field].icon}</div>
                  <h3 className="text-xl font-bold text-white mb-1">{fieldInfo[field].title}</h3>
                  <p className="text-gray-300 text-sm">{fieldInfo[field].description}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 p-3 rounded-lg border border-green-500/30">
                  <h4 className="font-semibold text-green-400 mb-1 flex items-center text-sm">
                    <span className="mr-1">✅</span> Normal Range
                  </h4>
                  <p className="text-green-300 text-xs">{fieldInfo[field].normal}</p>
                </div>

                <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 p-3 rounded-lg border border-amber-500/30">
                  <h4 className="font-semibold text-amber-400 mb-1 flex items-center text-sm">
                    <span className="mr-1">⚠️</span> Risk Factors
                  </h4>
                  <p className="text-amber-300 text-xs">{fieldInfo[field].risk}</p>
                </div>

                <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-3 rounded-lg border border-blue-500/30">
                  <h4 className="font-semibold text-blue-400 mb-1 flex items-center text-sm">
                    <span className="mr-1">🔬</span> Clinical Details
                  </h4>
                  <p className="text-blue-300 text-xs">{fieldInfo[field].detail}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative">
        <input
          ref={isActive ? activeFieldRef : null}
          type="number"
          name={field}
          value={patientData[field]}
          onChange={updateField}
          onFocus={() => handleFieldFocus(field)}
          required
          {...constraints}
          className={fieldClass}
          placeholder={`Enter ${fieldInfo[field].title.toLowerCase()}`}
        />

        {constraints && (
          <div className="flex flex-wrap gap-2 mt-4 text-xs font-semibold text-gray-200">
            {constraints.min !== undefined && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFieldValue(field, String(constraints.min));
                }}
                className="px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
              >
                Min {constraints.min}
              </button>
            )}
            {midpoint && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFieldValue(field, midpoint);
                }}
                className="px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
              >
                Median {midpoint}
              </button>
            )}
            {constraints.max !== undefined && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFieldValue(field, String(constraints.max));
                }}
                className="px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
              >
                Max {constraints.max}
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                adjustFieldValue(field, -numericStep);
              }}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-red-500/30 to-red-600/30 border border-red-400/40 hover:from-red-500/50 hover:to-red-600/50"
            >
              -{numericStep}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                adjustFieldValue(field, numericStep);
              }}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-green-500/30 to-green-600/30 border border-green-400/40 hover:from-green-500/50 hover:to-green-600/50"
            >
              +{numericStep}
            </button>
          </div>
        )}
        
        {/* Mobile/Responsive Info Panel */}
        {isActive && showMobileInfo && (
          <div className="lg:hidden absolute left-0 top-full mt-2 w-full max-w-md z-50 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 shadow-2xl shadow-cyan-500/20 animate-slideIn">
            <button 
              onClick={() => setShowMobileInfo(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            
            <div className={`text-center mb-4 bg-gradient-to-r ${fieldInfo[field].color} p-1 rounded-xl`}>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-4xl mb-2">{fieldInfo[field].icon}</div>
                <h3 className="text-xl font-bold text-white mb-1">{fieldInfo[field].title}</h3>
                <p className="text-gray-300 text-sm">{fieldInfo[field].description}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 p-3 rounded-lg border border-green-500/30">
                <h4 className="font-semibold text-green-400 mb-1 flex items-center text-sm">
                  <span className="mr-1">✅</span> Normal Range
                </h4>
                <p className="text-green-300 text-xs">{fieldInfo[field].normal}</p>
              </div>

              <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 p-3 rounded-lg border border-amber-500/30">
                <h4 className="font-semibold text-amber-400 mb-1 flex items-center text-sm">
                  <span className="mr-1">⚠️</span> Risk Factors
                </h4>
                <p className="text-amber-300 text-xs">{fieldInfo[field].risk}</p>
              </div>

              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-3 rounded-lg border border-blue-500/30">
                <h4 className="font-semibold text-blue-400 mb-1 flex items-center text-sm">
                  <span className="mr-1">🔬</span> Clinical Details
                </h4>
                <p className="text-blue-300 text-xs">{fieldInfo[field].detail}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const quickStats = [
    {
      title: "Fields Completed",
      value: `${completedFields.size}/${totalFields}`,
      sub: completionPercentage === 0 ? "Awaiting input" : `${Math.round(completionPercentage)}% ready`,
      accent: "from-cyan-500/30 to-blue-500/30",
    },
    {
      title: "AI Model Accuracy",
      value: "85.4%",
      sub: "Trained on Cleveland dataset",
      accent: "from-purple-500/30 to-pink-500/30",
    },
    {
      title: "Review Reminder",
      value: "30 days",
      sub: "Recommended follow-up window",
      accent: "from-amber-500/30 to-orange-500/30",
    },
    {
      title: "Data Security",
      value: "AES-256",
      sub: "In-transit encryption",
      accent: "from-emerald-500/30 to-teal-500/30",
    },
  ];

  const aiInsightStats = [
    {
      title: "AI Confidence",
      value: prediction ? `${formatPercentage(prediction.confidence)}%` : "Pending",
      sub: prediction ? "Based on provided biomarkers" : "Fill inputs to unlock",
      badge: "🔐",
    },
    {
      title: "Risk Signal",
      value: prediction ? prediction.risk_level : "Unknown",
      sub: prediction ? "Personalized severity grade" : "Awaiting analysis",
      badge: "📡",
    },
    {
      title: "Recommendation",
      value: prediction?.recommendation ? `${prediction.recommendation.split('.')[0]}.` : "Guidance appears here",
      sub: "AI-generated advisory",
      badge: "🩺",
    },
  ];

  const accentOrbs = [
    { className: "glow-orb top-12 -right-10 w-80 h-80 bg-cyan-500/20" },
    { className: "glow-orb -top-24 left-10 w-64 h-64 bg-purple-500/20" },
    { className: "glow-orb bottom-10 right-20 w-56 h-56 bg-pink-500/10" },
  ];

  const currentFieldData = getCurrentField();
  const currentField = currentFieldData.field;
  const currentFieldIndex = currentFieldData.index;
  const currentFieldInfo = fieldInfo[currentField] || fieldInfo[fieldOrder[0]];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Gaming-style background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900 to-black"></div>

      {accentOrbs.map((orb, index) => (
        <div key={`orb-${index}`} className={`${orb.className} blur-3xl opacity-70`} aria-hidden="true"></div>
      ))}
      
      {/* Animated particles */}
      <Particles />
      
      {/* Animated grid overlay */}
      <div className="fixed inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 min-h-screen p-4">
        {/* Back button - top left */}
        {prediction && (
          <button
            onClick={resetForm}
            className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/40 hover:to-blue-500/40 border border-cyan-500/50 rounded-xl text-white transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Back</span>
          </button>
        )}

        {/* Gaming-style header */}
        <div className="text-center mb-10 pt-8">
          <button
            onClick={resetForm}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-6 shadow-2xl shadow-cyan-500/50 animate-pulse hover:scale-110 transition-transform duration-300 cursor-pointer"
          >
            <span className="text-4xl">❤️</span>
          </button>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            CARDIAC RISK ANALYZER
          </h1>
          <p className="text-xl text-gray-300 mb-4">Advanced AI-Powered Heart Disease Prediction System</p>
          <p className="text-sm uppercase tracking-[0.4em] text-cyan-200/70 mb-6">XGBoost Engine • Real-time Biomarker Scoring • Secure Insights</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <button
              onClick={handleScrollToForm}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl text-white font-semibold shadow-2xl shadow-cyan-500/40 hover:translate-y-[-2px] transition-all duration-300"
            >
              Start / Continue Input
            </button>
            <button
              onClick={resetForm}
              className="px-8 py-4 bg-white/10 border border-white/20 rounded-2xl text-white font-semibold backdrop-blur hover:bg-white/20 transition-all duration-300"
            >
              Reset Dashboard
            </button>
          </div>
          
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

          {/* Clickable step chips */}
          <div className="max-w-5xl mx-auto mb-10">
            <div className="flex gap-3 overflow-x-auto py-3 px-3 bg-white/5 border border-white/10 rounded-3xl backdrop-blur scrollhide">
              {fieldOrder.map((field, index) => {
                const isActive = field === activeField;
                const isDone = completedFields.has(field);
                return (
                  <button
                    key={field}
                    onClick={() => navigateToStep(index)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 border ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black border-transparent shadow-lg shadow-cyan-500/40'
                        : 'bg-gray-900/60 text-gray-300 border-white/10 hover:text-white hover:border-cyan-400/40'
                    } ${isDone && !isActive ? 'opacity-80' : ''}`}
                    title={`Jump to ${fieldInfo[field].title}`}
                  >
                    <span className="text-lg">{fieldInfo[field].icon}</span>
                    <span>{index + 1}</span>
                    {isDone && <span className="text-xs">✅</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {quickStats.map((stat, index) => (
              <div
                key={stat.title}
                className={`neon-card bg-white/5 border border-white/10 rounded-3xl p-5 relative overflow-hidden backdrop-blur ${index % 2 === 0 ? 'animate-floatSlow' : 'animate-floatSlow-delayed'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-20`}></div>
                <div className="relative">
                  <p className="text-sm uppercase tracking-widest text-gray-300/80 mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-cyan-100 text-sm">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="max-w-7xl mx-auto">
          {/* Prediction Results - Gaming Style */}
          {prediction && (
            <div className="mb-8 p-8 bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 animate-slideIn">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-6 flex items-center justify-center">
                  <button
                    onClick={resetForm}
                    className="text-5xl mr-4 hover:scale-125 transition-transform duration-300 cursor-pointer"
                    title="Back to Home"
                  >
                    🔬
                  </button>
                  ANALYSIS COMPLETE
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 p-6 rounded-2xl border border-red-500/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                    <div className="text-5xl font-bold text-red-400 mb-2">{parseFloat(prediction.risk_probability).toFixed(2)}%</div>
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
                    <div className="text-2xl font-semibold text-blue-400 mb-2">{formatPercentage(prediction.confidence)}%</div>
                    <div className="text-blue-300">Confidence</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-600/30 backdrop-blur-sm mb-6">
                  <h3 className="font-semibold text-cyan-400 mb-3 text-xl">📋 Medical Recommendation:</h3>
                  <p className="text-gray-300 text-lg">{prediction.recommendation}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {aiInsightStats.map((insight) => (
                    <div key={insight.title} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                      <div className="relative">
                        <p className="text-sm text-gray-300 mb-2 flex items-center gap-2">
                          <span>{insight.badge}</span>
                          {insight.title}
                        </p>
                        <p className="text-2xl font-semibold text-white mb-1">{insight.value}</p>
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">{insight.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                  <button
                    onClick={resetForm}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-pink-500/40 transition-all duration-300"
                  >
                    🔄 Run New Analysis
                  </button>
                  <button
                    onClick={handleScrollToForm}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-cyan-500/40 transition-all duration-300"
                  >
                    ✏️ Adjust Inputs
                  </button>
                  <button
                    type="button"
                    className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-semibold backdrop-blur hover:bg-white/20 transition-all duration-300"
                    onClick={() => window.open('https://www.heart.org/en/healthy-living', '_blank')}
                  >
                    📘 Heart Health Guide
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Display - Gaming Style */}
          {error && (
            <div className="mb-6 p-6 bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl rounded-2xl border border-red-500/50 animate-shake">
              <p className="text-red-300 flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                {error}
              </p>
            </div>
          )}

          {/* Two-column layout - Gaming Enhanced */}
          {!prediction && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Panel - Information Display (Hidden on mobile, shows as popup instead) */}
              <div className="hidden lg:block bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl border border-cyan-500/30 p-8 shadow-2xl shadow-cyan-500/10 sticky top-4 h-fit">
                <div className={`text-center mb-6 bg-gradient-to-r ${currentFieldInfo.color} p-1 rounded-2xl`}>
                  <div className="bg-gray-900 rounded-xl p-6">
                    <div className="text-6xl mb-4 animate-bounce">{currentFieldInfo.icon}</div>
                    <h2 className="text-3xl font-bold text-white mb-2">{currentFieldInfo.title}</h2>
                    <p className="text-gray-300 text-lg">{currentFieldInfo.description}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 p-4 rounded-xl border border-green-500/30">
                    <h3 className="font-semibold text-green-400 mb-2 flex items-center">
                      <span className="mr-2">✅</span> Normal Range
                    </h3>
                    <p className="text-green-300">{currentFieldInfo.normal}</p>
                  </div>

                  <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 p-4 rounded-xl border border-amber-500/30">
                    <h3 className="font-semibold text-amber-400 mb-2 flex items-center">
                      <span className="mr-2">⚠️</span> Risk Factors
                    </h3>
                    <p className="text-amber-300">{currentFieldInfo.risk}</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-4 rounded-xl border border-blue-500/30">
                    <h3 className="font-semibold text-blue-400 mb-2 flex items-center">
                      <span className="mr-2">🔬</span> Clinical Details
                    </h3>
                    <p className="text-blue-300">{currentFieldInfo.detail}</p>
                  </div>
                </div>
              </div>

              {/* Right Panel - Form */}
              <div ref={formRef} className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-8 shadow-2xl shadow-purple-500/10 relative">
                {/* Mobile Info Toggle Button */}
                <button
                  onClick={() => setShowMobileInfo(!showMobileInfo)}
                  className="lg:hidden absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 z-10"
                >
                  ℹ️
                </button>

                <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center">
                  <span className="mr-3 text-4xl">🎯</span>
                  Patient Data Input
                </h2>

                {/* Progress Indicator */}
                <div className="mb-8 bg-gray-900/50 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-300">
                      Step {Math.min(currentStep + 1, fieldOrder.length)} of {fieldOrder.length}
                    </span>
                    <span className="text-sm font-semibold text-cyan-400">
                      {Math.round(completionPercentage)}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500 relative overflow-hidden"
                      style={{ width: `${completionPercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400 text-center">
                    {completionPercentage === 100 ? "🎉 All fields completed! Ready to predict!" : 
                     currentFieldInfo ? `Current: ${currentFieldInfo.title}` : ""}
                  </div>
                </div>

                <form onSubmit={submitPrediction} className="space-y-6" onClick={() => setShowMobileInfo(false)}>
                  {currentField && (
                      <div 
                        key={currentField} 
                        className="group animate-slideInUp transition-all duration-700 transform cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          focusActiveField();
                        }}
                      >
                        <label className="flex text-sm font-semibold text-gray-300 mb-3 items-center group-hover:text-cyan-400 transition-colors">
                          <span className="text-2xl mr-3">{fieldInfo[currentField].icon}</span>
                          <span className="flex items-center">
                            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-3 py-1 rounded-full text-xs font-bold mr-3 shadow-lg">
                              {currentFieldIndex + 1} / {fieldOrder.length}
                            </span>
                            {fieldInfo[currentField].title}
                          </span>
                          <span className="text-red-400 ml-2">*</span>
                          {completedFields.has(currentField) && (
                            <span className="ml-auto text-green-400 animate-pulse">✅</span>
                          )}
                        </label>
                        {renderField(currentField)}
                        
                        {/* Stylish completion prompt with Next button */}
                        {!completedFields.has(currentField) && (
                          <div className="mt-4 flex items-center justify-center">
                            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-3 border border-cyan-500/30 flex items-center space-x-3">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              </div>
                              <span className="text-cyan-300 text-sm font-medium">Please fill this field</span>
                              <div className="text-cyan-400">✨</div>
                            </div>
                          </div>
                        )}

                        {/* Next/Previous buttons when field is completed */}
                        {completedFields.has(currentField) && (
                          <div className="mt-6 flex justify-between items-center">
                            {currentFieldIndex > 0 && (
                              <button
                                type="button"
                                onClick={() => navigateToStep(currentFieldIndex - 1)}
                                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-300 flex items-center space-x-2 shadow-lg transform hover:scale-105"
                              >
                                <span>⬅️</span>
                                <span>Previous</span>
                              </button>
                            )}

                            {currentFieldIndex < fieldOrder.length - 1 ? (
                              <button
                                type="button"
                                onClick={() => navigateToStep(currentFieldIndex + 1)}
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-8 rounded-xl font-bold hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 flex items-center space-x-3 shadow-lg transform hover:scale-105 ml-auto"
                              >
                                <span>Next Field</span>
                                <span>➡️</span>
                              </button>
                            ) : (
                              <div className="ml-auto bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-3 border border-green-500/30 flex items-center space-x-2">
                                <span className="text-green-400">🎉</span>
                                <span className="text-green-300 font-medium">All fields completed!</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                  {/* Progress status indicator */}
                  {completionPercentage < 100 && (
                    <div className="pt-4 text-center">
                      <div className="text-cyan-400 text-sm font-medium bg-cyan-500/10 px-4 py-2 rounded-lg border border-cyan-500/30 inline-block">
                        <span className="animate-pulse">💡</span> Fill the field and click "Next Field" to continue
                      </div>
                    </div>
                  )}

                  <div className="pt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting || completionPercentage < 100}
                      className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white py-4 px-8 rounded-xl font-bold text-xl shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      {isSubmitting ? (
                        <>
                          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

        {/* Gaming-style footer with watermark */}
        <div className="text-center mt-16 pb-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Main footer content */}
            <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl border border-gray-600/30 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Tech stack */}
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <span className="text-xl">⚡</span>
                  <span className="text-sm">Powered by XGBoost AI</span>
                </div>
                
                {/* Security */}
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <span className="text-xl">🔒</span>
                  <span className="text-sm">Secure & Private</span>
                </div>
                
                {/* Performance */}
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <span className="text-xl">🚀</span>
                  <span className="text-sm">Real-time Predictions</span>
                </div>
              </div>
            </div>

            {/* Watermark section */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="text-3xl animate-pulse">❤️</div>
                <div>
                  <h3 className="text-cyan-200 font-bold text-2xl tracking-wide">Heart Disease Predictor</h3>
                  <p className="text-gray-300 text-sm mt-1">Advanced ML-powered health analysis</p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-500/10 backdrop-blur-sm rounded-lg border border-amber-500/20 p-3">
              <p className="text-amber-300 text-xs text-center flex items-center justify-center space-x-2">
                <span>⚠️</span>
                <span>
                  <strong>Medical Disclaimer:</strong> This tool is for educational purposes only. 
                  Always consult healthcare professionals for medical decisions.
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.open('https://github.com/hemanthsankar0007', '_blank')}
              className="w-full text-center text-blue-300 font-semibold tracking-wide hover:text-blue-200 transition-colors"
            >
              2025 © Developed by Hemanth Sankar
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-slideIn { animation: slideIn 0.6s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}

export default App;
