import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  console.error("VITE_API_URL is not defined");
}

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

function App() {
  const [patientData, setPatientData] = useState({
    age: "", sex: "", cp: "", trestbps: "", chol: "", fbs: "",
    restecg: "", thalch: "", exang: "", oldpeak: "", slope: "", ca: "", thal: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const submitPrediction = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await api.get("/health");

      const res = await api.post("/predict", patientData);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={submitPrediction} className="space-y-4 w-full max-w-md">
        {Object.keys(patientData).map((key) => (
          <input
            key={key}
            type="text"
            placeholder={key}
            value={patientData[key]}
            onChange={(e) =>
              setPatientData({ ...patientData, [key]: e.target.value })
            }
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded"
            required
          />
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-3 bg-cyan-500 text-black font-bold rounded"
        >
          {isSubmitting ? "Analyzing..." : "INITIATE ANALYSIS"}
        </button>

        {error && <p className="text-red-400">{error}</p>}
        {prediction && (
          <pre className="bg-gray-900 p-4 rounded">
            {JSON.stringify(prediction, null, 2)}
          </pre>
        )}
      </form>
    </div>
  );
}

export default App;
