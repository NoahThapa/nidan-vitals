// frontend/src/components/VitalsForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { calculateBMI } from "../utils/bmiCalculator";

export default function VitalsForm({ onNewPatient }) {
  const [formData, setFormData] = useState({
    patientId: "",
    height: "",
    weight: "",
    systolic: "",
    diastolic: "",
  });

  const [bmiData, setBmiData] = useState({ bmi: 0, category: "", color: "" });
  const [loading, setLoading] = useState(false);

  // Update form and calculate BMI in real-time
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const height = name === "height" ? value : formData.height;
    const weight = name === "weight" ? value : formData.weight;

    if (height && weight && !isNaN(height) && !isNaN(weight)) {
      setBmiData(calculateBMI(Number(weight), Number(height)));
    } else {
      setBmiData({ bmi: 0, category: "", color: "" });
    }
  };

  // Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const heightValue = Number(formData.height);
    const weightValue = Number(formData.weight);
    const systolicValue = Number(formData.systolic) || 0;
    const diastolicValue = Number(formData.diastolic) || 0;

    if (!formData.patientId || !heightValue || !weightValue) {
      alert("Patient ID, Height, and Weight must be valid numbers!");
      return;
    }

    const payload = {
      resourceType: "Observation",
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "vital-signs",
            },
          ],
        },
      ],
      code: {
        coding: [{ system: "http://loinc.org", code: "85353-1" }],
        text: "Vital Signs Panel",
      },
      subject: { reference: `Patient/${formData.patientId}` },
      effectiveDateTime: new Date().toISOString(),
      component: [
        { code: { coding: [{ code: "8302-2" }] }, valueQuantity: { value: heightValue, unit: "cm" } },
        { code: { coding: [{ code: "29463-7" }] }, valueQuantity: { value: weightValue, unit: "kg" } },
        { code: { coding: [{ code: "39156-5" }] }, valueQuantity: { value: parseFloat(bmiData.bmi), unit: "kg/m2" } },
        { code: { coding: [{ code: "8480-6" }] }, valueQuantity: { value: systolicValue, unit: "mmHg" } },
        { code: { coding: [{ code: "8462-4" }] }, valueQuantity: { value: diastolicValue, unit: "mmHg" } },
      ],
    };

    try {
      setLoading(true);
      console.log("Sending payload:", JSON.stringify(payload, null, 2));
      await axios.post("http://localhost:5000/api/fhir/observation", payload);
      alert("Vitals saved!");
      setFormData({ patientId: "", height: "", weight: "", systolic: "", diastolic: "" });
      setBmiData({ bmi: 0, category: "", color: "" });
      if (onNewPatient) onNewPatient();
    } catch (err) {
      console.error(err);
      alert("Error saving vitals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border mb-4 rounded space-y-2 bg-white shadow-sm">
      <input
        type="text"
        name="patientId"
        placeholder="Patient ID"
        value={formData.patientId}
        onChange={handleChange}
        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="number"
        min="0"
        name="height"
        placeholder="Height (cm)"
        value={formData.height}
        onChange={handleChange}
        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="number"
        min="0"
        name="weight"
        placeholder="Weight (kg)"
        value={formData.weight}
        onChange={handleChange}
        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="number"
        min="0"
        name="systolic"
        placeholder="Systolic BP"
        value={formData.systolic}
        onChange={handleChange}
        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="number"
        min="0"
        name="diastolic"
        placeholder="Diastolic BP"
        value={formData.diastolic}
        onChange={handleChange}
        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {bmiData.bmi > 0 && (
        <p style={{ color: bmiData.color }}>
          BMI: {bmiData.bmi} ({bmiData.category})
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className={`bg-blue-500 text-white px-4 py-2 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600 cursor-pointer"
        }`}
      >
        {loading ? "Saving..." : "Save Vitals"}
      </button>
    </form>
  );
}
