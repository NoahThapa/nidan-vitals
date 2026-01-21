// frontend/src/components/VitalsForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { calculateBMI } from "../utils/bmiCalculator";

export default function VitalsForm({ onNewPatient }) {
    const [formData, setFormData] = useState({ patientId:"", height:"", weight:"", systolic:"", diastolic:"" });
    const [bmiData, setBmiData] = useState({ bmi:0, category:"", color:"" });

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});

        const h = name==="height" ? value : formData.height;
        const w = name==="weight" ? value : formData.weight;
        if(h && w) setBmiData(calculateBMI(Number(w), Number(h)));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const payload = {
            resourceType:"Observation",
            status:"final",
            category:[{coding:[{system:"http://terminology.hl7.org/CodeSystem/observation-category", code:"vital-signs"}]}],
            code:{coding:[{system:"http://loinc.org", code:"85353-1"}], text:"Vital Signs Panel"},
            subject:{reference:`Patient/${formData.patientId}`},
            effectiveDateTime: new Date().toISOString(),
            component:[
                {code:{coding:[{code:"8302-2"}]}, valueQuantity:{value:Number(formData.height), unit:"cm"}},
                {code:{coding:[{code:"29463-7"}]}, valueQuantity:{value:Number(formData.weight), unit:"kg"}},
                {code:{coding:[{code:"39156-5"}]}, valueQuantity:{value:Number(bmiData.bmi), unit:"kg/m2"}},
                {code:{coding:[{code:"8480-6"}]}, valueQuantity:{value:Number(formData.systolic), unit:"mmHg"}},
                {code:{coding:[{code:"8462-4"}]}, valueQuantity:{value:Number(formData.diastolic), unit:"mmHg"}}
            ]
        };
        await axios.post("http://localhost:5000/api/fhir/observation", payload);
        alert("Vitals saved!");
        onNewPatient();
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border mb-4 rounded space-y-2">
            <input name="patientId" placeholder="Patient ID" value={formData.patientId} onChange={handleChange} className="border p-1 rounded w-full"/>
            <input name="height" placeholder="Height (cm)" value={formData.height} onChange={handleChange} className="border p-1 rounded w-full"/>
            <input name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} className="border p-1 rounded w-full"/>
            <input name="systolic" placeholder="Systolic BP" value={formData.systolic} onChange={handleChange} className="border p-1 rounded w-full"/>
            <input name="diastolic" placeholder="Diastolic BP" value={formData.diastolic} onChange={handleChange} className="border p-1 rounded w-full"/>
            <p style={{color:bmiData.color}}>BMI: {bmiData.bmi} ({bmiData.category})</p>
            <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">Save Vitals</button>
        </form>
    );
}
