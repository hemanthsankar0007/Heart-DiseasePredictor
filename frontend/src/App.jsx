import { useState, useEffect, useRef } from "react";
import axios from "axios";

/* ===================== API CONFIG (FIXED) ===================== */
const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  console.error("❌ VITE_API_URL is not defined");
}

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});
/* ============================================================= */

function App() {
  const [patientData, setPatientData] = useState({
    age: "", sex: "", cp: "", trestbps: "", chol: "", fbs: "",
    restecg: "", thalch: "", exang: "", oldpeak: "", slope: "", ca: "", thal: ""
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

  useEffect(() => {
    const completed = new Set();
    Object.entries(patientData).forEach(([k, v]) => {
      if (v !== "") completed.add(k);
    });
    setCompletedFields(completed);
  }, [patientData]);

  const completionPercentage = (completedFields.size / totalFields) * 100;

  /* ===================== 🔥 FIXED FUNCTION 🔥 ===================== */
  const submitPrediction = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("➡️ Calling backend:", API_BASE);

      // health check
      await api.get("/health");

      // prediction
      const res = await api.post("/predict", patientData);
      setPrediction(res.data);

    } catch (err) {
      console.error("❌ Prediction error:", err);

      if (err.response) {
        setError(err.response.data?.detail || "Prediction failed");
      } else {
        setError("Backend not reachable");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  /* =============================================================== */

  const resetForm = () => {
    setPatientData({
      age: "", sex: "", cp: "", trestbps: "", chol: "", fbs: "",
      restecg: "", thalch: "", exang: "", oldpeak: "", slope: "", ca: "", thal: ""
    });
    setPrediction(null);
    setError(null);
    setActiveField("age");
    setCompletedFields(new Set());
    setCurrentStep(0);
  };

  /* ===================== UI (UNCHANGED) ===================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="max-w-3xl mx-auto p-6">

        <h1 className="text-4xl font-bold text-center mb-8">
          ❤️ Cardiac Risk Analyzer
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-900/40 border border-red-500 rounded">
            {error}
          </div>
        )}

        {prediction && (
          <div className="mb-6 p-6 bg-black/60 border border-cyan-500 rounded">
            <h2 className="text-2xl mb-4">Analysis Result</h2>
            <pre className="text-sm">
              {JSON.stringify(prediction, null, 2)}
            </pre>
            <button
              onClick={resetForm}
              className="mt-4 px-4 py-2 bg-cyan-500 text-black rounded"
            >
              New Analysis
            </button>
          </div>
        )}

        {!prediction && (
          <form ref={formRef} onSubmit={submitPrediction} className="space-y-4">
            {fieldOrder.map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                value={patientData[field]}
                onChange={(e) =>
                  setPatientData({ ...patientData, [field]: e.target.value })
                }
                placeholder={field}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded"
                required
              />
            ))}

            <button
              type="submit"
              disabled={completionPercentage < 100 || isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold rounded disabled:opacity-50"
            >
              {isSubmitting ? "ANALYZING..." : "INITIATE ANALYSIS"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
