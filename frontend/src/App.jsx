import React from "react";
import PatientTable from "./components/PatientTable";
import VitalsForm from "./components/VitalsForm";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Nidan Vitals Dashboard</h1>
      <VitalsForm />
      <PatientTable />
    </div>
  );
}

export default App;
