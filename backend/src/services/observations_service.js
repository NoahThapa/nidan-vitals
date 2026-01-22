const observations = require("../data/stores");
const { createFHIRObservation } = require("../utils/fhirAdapter");
const { v4: uuidv4 } = require("uuid");

// Validate observation payload
const validateObservation = (obs) => {
  if (!obs.component || !Array.isArray(obs.component)) throw new Error("Observation must have a component array");

  const getValue = (code) =>
    Number(obs.component.find(c => c.code?.coding?.[0]?.code === code)?.valueQuantity?.value ?? 0);

  const height = getValue("8302-2");
  const weight = getValue("29463-7");
  const systolic = getValue("8480-6");
  const diastolic = getValue("8462-4");

  if (!height || !weight) throw new Error("Height and Weight are required");

  return { height, weight, systolic, diastolic };
};

// Add or replace observation by Patient ID
const addObservation = (obsPayload) => {
  const patientId = obsPayload.subject?.reference?.replace("Patient/", "") || obsPayload.patientId;
  const { height, weight, systolic, diastolic } = validateObservation(obsPayload);

  const bmi = obsPayload.component.find(c => c.code?.coding?.[0]?.code === "39156-5")?.valueQuantity?.value ?? 0;

  // Check if observation for this patient already exists
  const index = observations.findIndex(o => (o.subject?.reference?.replace("Patient/", "") || o.patientId) === patientId);
  const newObs = { id: uuidv4(), patientId, height, weight, systolic, diastolic, bmi, date: obsPayload.effectiveDateTime || new Date().toISOString(), subject: { reference: `Patient/${patientId}` } };

  if (index >= 0) {
    observations[index] = newObs; // Replace existing
  } else {
    observations.push(newObs);
  }

  return newObs;
};

// Get all observations (optionally filter by Patient ID)
const getObservations = (patientId) => {
  let result = observations;
  if (patientId) result = result.filter(o => (o.subject?.reference?.replace("Patient/", "") || o.patientId) === patientId);
  return result;
};

module.exports = { addObservation, getObservations };
