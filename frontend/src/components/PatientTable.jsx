import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PatientTable({ refreshFlag }) {
  const [patients, setPatients] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);

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
        if (isMounted) setPatients([]);
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPatients();

    return () => {
      isMounted = false;
    };
  }, [searchId, filter, refreshFlag]);

  const getPatientData = (obs) => {
    const bmi =
      obs.component.find((c) => c.code.coding[0].code === "39156-5")
        ?.valueQuantity?.value || 0;

    const systolic =
      obs.component.find((c) => c.code.coding[0].code === "8480-6")
        ?.valueQuantity?.value || 0;

    const diastolic =
      obs.component.find((c) => c.code.coding[0].code === "8462-4")
        ?.valueQuantity?.value || 0;

    let category = "";
    let color = "";

    if (bmi < 18.5) {
      category = "Underweight";
      color = "blue-500";
    } else if (bmi < 25) {
      category = "Normal";
      color = "green-500";
    } else if (bmi < 30) {
      category = "Overweight";
      color = "orange-500";
    } else {
      category = "Obese";
      color = "red-600";
    }

    // Red alert override
    if (bmi >= 30 || systolic >= 140 || diastolic >= 90) color = "red-700";

    return { bmi, category, color, systolic, diastolic };
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
                {["Patient ID", "BMI", "Systolic BP", "Diastolic BP", "Status"].map(
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
                const { bmi, category, color, systolic, diastolic } =
                  getPatientData(obs);

                return (
                  <tr
                    key={i}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-2 border-b border-gray-200">
                      {obs.subject.reference.replace("Patient/", "")}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200">{bmi}</td>
                    <td className="px-4 py-2 border-b border-gray-200">{systolic}</td>
                    <td className="px-4 py-2 border-b border-gray-200">{diastolic}</td>
                    <td className="px-4 py-2 border-b border-gray-200">
                      <span
                        className={`px-3 py-1 rounded-full text-white font-semibold text-sm bg-${color}`}
                      >
                        {category}
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
