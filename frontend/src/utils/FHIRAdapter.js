export const mapFHIRToUI = (obs) => {
  const components = obs.component || [];

  const getValue = (code) =>
    Number(
      components.find(c => c.code?.coding?.[0]?.code === code)
        ?.valueQuantity?.value || 0
    );

  const bmi = getValue("39156-5");
  const systolic = getValue("8480-6");
  const diastolic = getValue("8462-4");

  // ---- BMI STATUS ----
  let bmiStatus = "Underweight";
  let bmiColor = "gray";

  if (bmi >= 18.5 && bmi < 25) {
    bmiStatus = "Normal";
    bmiColor = "green";
  } else if (bmi >= 25 && bmi < 30) {
    bmiStatus = "Overweight";
    bmiColor = "orange";
  } else if (bmi >= 30) {
    bmiStatus = "Obese";
    bmiColor = "red";
  }
  


  // ---- BP STATUS ----
  let bpStatus = "Normal";
  let bpColor = "green";

  if (systolic >= 140 || diastolic >= 90) {
    bpStatus = "High";
    bpColor = "red";
  } else if (systolic >= 120 || diastolic >= 80) {
    bpStatus = "Elevated";
    bpColor = "orange";
  }

  return {
    patientId: obs.subject?.reference?.replace("Patient/", "") || "Unknown",
    bmi,
    systolic,
    diastolic,
    bmiStatus,
    bpStatus,
    bmiColor,
    bpColor,
    date: obs.effectiveDateTime
  };
};
