// frontend/src/components/PatientTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { mapFHIRToUI } from "../utils/FHIRAdapter";

export default function PatientTable({ refreshFlag }) {
  const [patients, setPatients] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  // Fetch patients from backend
  useEffect(() => {
    let isMounted = true;

    const fetchPatients = async () => {
      setLoading(true);
      try {
        const query = [];
        if (searchId) query.push(`patientId=${searchId}`);
        if (filter !== "All") query.push(`filter=${filter}`);
        const queryString = query.length ? "?" + query.join("&") : "";

        const res = await axios.get(
          `http://localhost:5000/api/fhir/observation${queryString}`
        );

        if (isMounted) setPatients(res.data);
      } catch (err) {
        console.error(err);
        if (isMounted) setPatients([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPatients();

    return () => {
      isMounted = false;
    };
  }, [searchId, filter, refreshFlag]);

  // Map color string to Tailwind class
  const getColorClass = (color) => {
    return {
      red: "bg-red-500",
      green: "bg-green-500",
      orange: "bg-orange-500",
      blue: "bg-blue-500",
      gray: "bg-gray-400",
    }[color] || "bg-gray-400";
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
        <input
          placeholder="Search Patient ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
        />
        <div className="flex gap-2">
          {["All", "Normal", "Overweight", "Obese"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
                filter === f
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : patients.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No patient found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                {["Patient ID", "BMI", "Systolic BP", "Diastolic BP", "BMI Status", "BP Status"].map(
                  (head) => (
                    <th
                      key={head}
                      className="text-left px-4 py-3 border-b border-gray-200 text-gray-700"
                    >
                      {head}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {patients.map((obs, i) => {
                const { bmi, bmiStatus, bmiColor, systolic, diastolic, bpStatus, bpColor, patientId } =
                  mapFHIRToUI(obs);

                return (
                  <tr
                    key={obs?.id || i}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-2 border-b border-gray-200">{patientId}</td>
                    <td className="px-4 py-2 border-b border-gray-200">{bmi}</td>
                    <td className="px-4 py-2 border-b border-gray-200">{systolic}</td>
                    <td className="px-4 py-2 border-b border-gray-200">{diastolic}</td>
                    <td className="px-4 py-2 border-b border-gray-200">
                      <span
                        className={`px-3 py-1 rounded-full text-white font-semibold text-sm ${getColorClass(
                          bmiColor
                        )}`}
                      >
                        {bmiStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200">
                      <span
                        className={`px-3 py-1 rounded-full text-white font-semibold text-sm ${getColorClass(
                          bpColor
                        )}`}
                      >
                        {bpStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
