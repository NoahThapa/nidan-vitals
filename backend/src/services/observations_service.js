const observations = require("../data/stores");
const { mapFHIRObservation } = require("../utils/fhirAdapter");

// Add new observation with validation
const addObservation = (obs) => {
  const height = obs.component.find(c => c.code.coding[0].code === "8302-2")?.valueQuantity?.value;
  const weight = obs.component.find(c => c.code.coding[0].code === "29463-7")?.valueQuantity?.value;
  const systolic = obs.component.find(c => c.code.coding[0].code === "8480-6")?.valueQuantity?.value;
  const diastolic = obs.component.find(c => c.code.coding[0].code === "8462-4")?.valueQuantity?.value;

  if (!height && !weight && !systolic && !diastolic) {
    throw new Error("Cannot store empty observation");
  }

  observations.push(obs);
  return obs;
};

// GET observations with optional search & filter
const getObservations = (patientId, filter) => {
  let result = observations;

  if (patientId) {
    result = result.filter(o => o.subject.reference === `Patient/${patientId}`);
  }

  if (filter && filter !== "All") {
    result = result.filter(o => {
      const mapped = mapFHIRObservation(o);
      if (filter === "Normal") return mapped.bmi >= 18.5 && mapped.bmi < 25;
      if (filter === "Overweight") return mapped.bmi >= 25 && mapped.bmi < 30;
      if (filter === "Obese") return mapped.bmi >= 30;
      return true;
    });
  }

  return result;
};

module.exports = { addObservation, getObservations };
