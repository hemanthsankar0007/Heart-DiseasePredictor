import { useState, useEffect, useRef } from "react";
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
  const [activeField, setActiveField] = useState("age");
  const [completedFields, setCompletedFields] = useState(new Set());
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const activeFieldRef = useRef(null);
  const formRef = useRef(null);

  const fieldOrder = [
    "age","sex","cp","trestbps","chol","fbs",
    "restecg","thalch","exang","oldpeak","slope","ca","thal"
  ];

  const totalFields = fieldOrder.length;

  const completionPercentage =
    (completedFields.size / totalFields) * 100;

  useEffect(() => {
    const completed = new Set();
    Object.entries(patientData).forEach(([k, v]) => {
      if (v !== "") completed.add(k);
    });
    setCompletedFields(completed);
  }, [patientData]);

  const setFieldValue = (name, value) => {
    setPatientData(prev => ({ ...prev, [name]: value }));
    setActiveField(name);
    setError(null);
  };

  const updateField = e => {
    const { name, value } = e.target;
    setFieldValue(name, value);
  };

  const navigateToStep = index => {
    if (index >= 0 && index < fieldOrder.length) {
      setCurrentStep(index);
      setActiveField(fieldOrder[index]);
    }
  };

  const submitPrediction = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const apiUrl =
      import.meta.env.VITE_API_URL || "http://localhost:8000";

    try {
      await axios.get(`${apiUrl}/health`, { timeout: 5000 });

      const res = await axios.post(
        `${apiUrl}/predict`,
        patientData,
        { headers: { "Content-Type": "application/json" } }
      );

      setPrediction(res.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.detail || "Prediction failed");
      } else {
        setError("Backend not reachable");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPatientData({
      age:"",sex:"",cp:"",trestbps:"",chol:"",
      fbs:"",restecg:"",thalch:"",
      exang:"",oldpeak:"",slope:"",ca:"",thal:""
    });
    setPrediction(null);
    setError(null);
    setActiveField("age");
    setCompletedFields(new Set());
    setCurrentStep(0);
  };

  const currentField = fieldOrder[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        ❤️ Cardiac Risk Analyzer
      </h1>

      <form
        ref={formRef}
        onSubmit={submitPrediction}
        className="max-w-xl mx-auto space-y-4"
      >
        <input
          ref={activeFieldRef}
          name={currentField}
          value={patientData[currentField]}
          onChange={updateField}
          placeholder={currentField}
          className="w-full p-4 rounded bg-gray-900 border border-gray-700"
          required
        />

        <div className="flex justify-between">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => navigateToStep(currentStep - 1)}
              className="px-4 py-2 bg-gray-700 rounded"
            >
              ⬅ Prev
            </button>
          )}

          {currentStep < fieldOrder.length - 1 ? (
            <button
              type="button"
              onClick={() => navigateToStep(currentStep + 1)}
              className="px-4 py-2 bg-cyan-500 text-black rounded ml-auto"
            >
              Next ➡
            </button>
          ) : (
            <span className="ml-auto text-green-400">
              ✅ All fields done
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={completionPercentage < 100 || isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded font-bold text-xl"
        >
          {isSubmitting ? "ANALYZING..." : "INITIATE ANALYSIS"}
        </button>
      </form>

      {error && (
        <p className="text-red-400 text-center mt-4">
          ⚠️ {error}
        </p>
      )}

      {prediction && (
        <pre className="max-w-xl mx-auto mt-6 p-4 bg-black/40 rounded">
{JSON.stringify(prediction, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
