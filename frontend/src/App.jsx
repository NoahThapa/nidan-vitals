import React, { useState } from "react";
import PatientTable from "./components/PatientTable";
import VitalsForm from "./components/VitalsForm";

function App() {
  // State to trigger refresh in PatientTable
  const [refreshFlag, setRefreshFlag] = useState(0);

  // Callback to increment refreshFlag when a new patient is added
  const handleNewPatient = () => {
    setRefreshFlag((prev) => prev + 1);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-2xl font-bold mb-4">Nidan Vitals Dashboard</h1>

      {/* Vitals form with callback */}
      <VitalsForm onNewPatient={handleNewPatient} />

      {/* Patient table receives refreshFlag to reload data */}
      <PatientTable refreshFlag={refreshFlag} />
    </div>
  );
}

export default App;
