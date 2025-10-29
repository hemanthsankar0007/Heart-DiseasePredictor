import React, { useState } from 'react';
import axios from 'axios';

function App() {
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

  // Feature information for the left side descriptions
  const featureInfo = {
    age: {
      title: "Age",
      description: "Patient's age in years. Age is a significant risk factor for heart disease.",
      normalRange: "18-100 years",
      riskFactors: "Risk increases significantly after age 45 (men) and 55 (women)",
      details: "Aging causes changes in the heart muscle, blood vessels, and heart rhythm that can increase cardiovascular risk.",
      icon: "🎂"
    },
    sex: {
      title: "Gender",
      description: "Biological sex of the patient. Men generally have higher risk of heart disease at younger ages.",
      normalRange: "Male (1) or Female (0)",
      riskFactors: "Men have higher risk before age 55, women's risk increases after menopause",
      details: "Hormonal differences, particularly estrogen levels, affect cardiovascular health.",
      icon: "👥"
    },
    cp: {
      title: "Chest Pain Type",
      description: "Classification of chest pain experienced by the patient.",
      normalRange: "Asymptomatic (3) is often associated with lower immediate risk",
      riskFactors: "Typical angina (0) indicates highest cardiac risk",
      details: "Types: 0=Typical Angina, 1=Atypical Angina, 2=Non-Anginal Pain, 3=Asymptomatic",
      icon: "💔"
    },
    trestbps: {
      title: "Resting Blood Pressure",
      description: "Blood pressure measured when the patient is at rest, in mmHg.",
      normalRange: "90-120 mmHg (systolic)",
      riskFactors: "≥140 mmHg indicates hypertension, major risk factor",
      details: "High blood pressure forces the heart to work harder, potentially leading to heart disease.",
      icon: "🩺"
    },
    chol: {
      title: "Cholesterol Level",
      description: "Serum cholesterol level measured in mg/dl.",
      normalRange: "<200 mg/dl is desirable",
      riskFactors: "≥240 mg/dl is high risk, 200-239 mg/dl is borderline high",
      details: "High cholesterol can lead to plaque buildup in arteries, restricting blood flow.",
      icon: "🧪"
    },
    fbs: {
      title: "Fasting Blood Sugar",
      description: "Blood sugar level after fasting, indicates diabetes risk.",
      normalRange: "≤120 mg/dl is normal (0)",
      riskFactors: ">120 mg/dl (1) indicates diabetes, major cardiovascular risk factor",
      details: "Diabetes significantly increases the risk of heart disease and stroke.",
      icon: "🍯"
    },
    restecg: {
      title: "Resting ECG Results",
      description: "Electrocardiogram results when patient is at rest.",
      normalRange: "Normal (0) indicates healthy electrical activity",
      riskFactors: "Abnormal patterns may indicate underlying heart problems",
      details: "Types: 0=Normal, 1=ST-T wave abnormality, 2=Left ventricular hypertrophy",
      icon: "📈"
    },
    thalch: {
      title: "Maximum Heart Rate",
      description: "Highest heart rate achieved during exercise or stress test.",
      normalRange: "220 minus age (approximate maximum)",
      riskFactors: "Lower max heart rate may indicate poor cardiovascular fitness",
      details: "Higher maximum heart rate generally indicates better cardiovascular health.",
      icon: "💓"
    },
    exang: {
      title: "Exercise Induced Angina",
      description: "Whether chest pain occurs during exercise or physical exertion.",
      normalRange: "No (0) is normal",
      riskFactors: "Yes (1) indicates reduced blood flow to heart during exercise",
      details: "Exercise-induced angina suggests coronary artery disease.",
      icon: "🏃‍♂️"
    },
    oldpeak: {
      title: "ST Depression",
      description: "ST depression induced by exercise relative to rest on ECG.",
      normalRange: "0.0-1.0 is generally normal",
      riskFactors: ">2.0 indicates significant coronary artery disease",
      details: "ST depression reflects insufficient blood supply to heart muscle during stress.",
      icon: "📉"
    },
    slope: {
      title: "Peak Exercise ST Segment Slope",
      description: "The slope of the peak exercise ST segment on ECG.",
      normalRange: "Upsloping (0) is healthiest",
      riskFactors: "Downsloping (2) indicates highest risk",
      details: "Types: 0=Upsloping, 1=Flat, 2=Downsloping. Reflects heart's response to exercise.",
      icon: "📊"
    },
    ca: {
      title: "Major Vessels Colored by Fluoroscopy",
      description: "Number of major coronary vessels with significant blockage (0-3).",
      normalRange: "0 vessels blocked is ideal",
      riskFactors: "More blocked vessels = higher risk",
      details: "Fluoroscopy reveals blocked coronary arteries. More blockages mean reduced blood flow.",
      icon: "🔍"
    },
    thal: {
      title: "Thalassemia",
      description: "Blood disorder affecting hemoglobin production and oxygen transport.",
      normalRange: "Normal (0) or fixed defect (1)",
      riskFactors: "Reversible defect (2) may indicate cardiac issues",
      details: "Types: 0=Normal, 1=Fixed Defect, 2=Reversible Defect. Affects heart's oxygen supply.",
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
        <div className={`transition-all duration-200 ${isActive ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
          <select
            name={fieldName}
            value={patientData[fieldName]}
            onChange={handleInputChange}
            onFocus={() => setActiveFeature(fieldName)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            required
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div className={`transition-all duration-200 ${isActive ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
        <input
          type="number"
          name={fieldName}
          value={patientData[fieldName]}
          onChange={handleInputChange}
          onFocus={() => setActiveFeature(fieldName)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
      const response = await axios.post('http://localhost:8000/predict', patientData);
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentFeature = featureInfo[activeFeature];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg">
              <span className="text-2xl text-white">❤️</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Heart Disease Risk Calculator</h1>
              <p className="text-gray-600 mt-1">UCI Heart Disease Dataset - Advanced Cardiac Risk Assessment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Feature Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">{currentFeature.icon}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentFeature.title}</h2>
                </div>
                
                <p className="text-gray-700 text-base leading-relaxed mb-6">
                  {currentFeature.description}
                </p>
                
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                      <span className="mr-2">✅</span>
                      Normal Range
                    </h4>
                    <p className="text-green-700 text-sm">{currentFeature.normalRange}</p>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                      <span className="mr-2">⚠️</span>
                      Risk Factors
                    </h4>
                    <p className="text-amber-700 text-sm">{currentFeature.riskFactors}</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <span className="mr-2">🔬</span>
                      Clinical Details
                    </h4>
                    <p className="text-blue-700 text-sm">{currentFeature.details}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Input Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Information</h2>
                <p className="text-gray-600">Enter patient data for cardiac risk assessment</p>
              </div>

              <form onSubmit={submitPrediction} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {renderField('age', 'Age (years)')}
                  
                  {renderField('sex', 'Gender', [
                    { value: '0', label: 'Female' },
                    { value: '1', label: 'Male' }
                  ])}
                  
                  {renderField('cp', 'Chest Pain Type', [
                    { value: '0', label: 'Typical Angina' },
                    { value: '1', label: 'Atypical Angina' },
                    { value: '2', label: 'Non-Anginal Pain' },
                    { value: '3', label: 'Asymptomatic' }
                  ])}
                  
                  {renderField('trestbps', 'Resting Blood Pressure (mmHg)')}
                  {renderField('chol', 'Cholesterol Level (mg/dl)')}
                  
                  {renderField('fbs', 'Fasting Blood Sugar', [
                    { value: '0', label: '≤ 120 mg/dl (Normal)' },
                    { value: '1', label: '> 120 mg/dl (High)' }
                  ])}
                  
                  {renderField('restecg', 'Resting ECG Results', [
                    { value: '0', label: 'Normal' },
                    { value: '1', label: 'ST-T Wave Abnormality' },
                    { value: '2', label: 'Left Ventricular Hypertrophy' }
                  ])}
                  
                  {renderField('thalch', 'Maximum Heart Rate Achieved')}
                  
                  {renderField('exang', 'Exercise Induced Angina', [
                    { value: '0', label: 'No' },
                    { value: '1', label: 'Yes' }
                  ])}
                  
                  {renderField('oldpeak', 'ST Depression (Exercise vs Rest)')}
                  
                  {renderField('slope', 'Peak Exercise ST Segment Slope', [
                    { value: '0', label: 'Upsloping' },
                    { value: '1', label: 'Flat' },
                    { value: '2', label: 'Downsloping' }
                  ])}
                  
                  {renderField('ca', 'Major Vessels Colored by Fluoroscopy', [
                    { value: '0', label: '0 vessels' },
                    { value: '1', label: '1 vessel' },
                    { value: '2', label: '2 vessels' },
                    { value: '3', label: '3 vessels' }
                  ])}
                  
                  {renderField('thal', 'Thalassemia', [
                    { value: '0', label: 'Normal' },
                    { value: '1', label: 'Fixed Defect' },
                    { value: '2', label: 'Reversible Defect' }
                  ])}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-pink-700 focus:ring-4 focus:ring-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing Risk...</span>
                    </div>
                  ) : (
                    'Calculate Heart Disease Risk'
                  )}
                </button>
              </form>

              {/* Error Display */}
              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500">❌</span>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Results Display */}
              {prediction && (
                <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center">
                    <span className="mr-2">🔬</span>
                    Risk Assessment Results
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <h4 className="font-semibold text-gray-700 mb-2">Risk Probability</h4>
                      <div className="text-3xl font-bold text-red-600">
                        {prediction.risk_probability}%
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <h4 className="font-semibold text-gray-700 mb-2">Risk Level</h4>
                      <div className={`text-2xl font-bold ${
                        prediction.risk_level === 'Low Risk' ? 'text-green-600' :
                        prediction.risk_level === 'Moderate Risk' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {prediction.risk_level}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <span className="mr-2">📋</span>
                      Clinical Recommendation
                    </h4>
                    <p className="text-blue-700 leading-relaxed">{prediction.recommendation}</p>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Confidence: <span className="font-semibold">{prediction.confidence}%</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
