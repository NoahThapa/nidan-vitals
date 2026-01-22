// backend/src/utils/fhirAdapter.js

// Helper: safely get value from component by LOINC code
const getComponentValue = (obs, code) =>
  obs.component?.find(c => c.code?.coding?.[0]?.code === code)?.valueQuantity?.value ?? 0;

// Map FHIR Observation → UI-friendly object (optional)
function mapFHIRObservation(obs) {
  const height = getComponentValue(obs, "8302-2");
  const weight = getComponentValue(obs, "29463-7");
  const bmi = getComponentValue(obs, "39156-5");
  const systolic = getComponentValue(obs, "8480-6");
  const diastolic = getComponentValue(obs, "8462-4");
  const date = obs.effectiveDateTime || new Date().toISOString();

  let category = "Unknown";
  let color = "gray";

  if (bmi > 0) {
    if (bmi < 18.5) category = "Underweight", color = "blue";
    else if (bmi < 25) category = "Normal", color = "green";
    else if (bmi < 30) category = "Overweight", color = "orange";
    else category = "Obese", color = "red";
  }

  if (bmi >= 30 || systolic >= 140 || diastolic >= 90) color = "red";

  return { patientId: obs.subject?.reference?.replace("Patient/", "") || "Unknown", bmi, category, color, systolic, diastolic, height, weight, date };
}

// Convert flat observation → full FHIR Observation JSON
function createFHIRObservation({ patientId, height, weight, bmi, systolic, diastolic, date }) {
  return {
    resourceType: "Observation",
    status: "final",
    category: [
      {
        coding: [
          { system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "vital-signs", display: "Vital Signs" }
        ]
      }
    ],
    code: {
      coding: [
        { system: "http://loinc.org", code: "85353-1", display: "Vital signs, weight, height, and BMI panel" }
      ],
      text: "Vital Signs Panel"
    },
    subject: { reference: `Patient/${patientId}` },
    effectiveDateTime: date || new Date().toISOString(),
    component: [
      { code: { coding: [{ system: "http://loinc.org", code: "8302-2", display: "Body height" }] }, valueQuantity: { value: height, unit: "cm", system: "http://unitsofmeasure.org", code: "cm" } },
      { code: { coding: [{ system: "http://loinc.org", code: "29463-7", display: "Body weight" }] }, valueQuantity: { value: weight, unit: "kg", system: "http://unitsofmeasure.org", code: "kg" } },
      { code: { coding: [{ system: "http://loinc.org", code: "39156-5", display: "Body mass index" }] }, valueQuantity: { value: bmi, unit: "kg/m2", system: "http://unitsofmeasure.org", code: "kg/m2" } },
      { code: { coding: [{ system: "http://loinc.org", code: "8480-6", display: "Systolic blood pressure" }] }, valueQuantity: { value: systolic, unit: "mmHg", system: "http://unitsofmeasure.org", code: "mm[Hg]" } },
      { code: { coding: [{ system: "http://loinc.org", code: "8462-4", display: "Diastolic blood pressure" }] }, valueQuantity: { value: diastolic, unit: "mmHg", system: "http://unitsofmeasure.org", code: "mm[Hg]" } }
    ]
  };
}

module.exports = { mapFHIRObservation, createFHIRObservation };
