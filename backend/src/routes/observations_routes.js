const express = require("express");
const router = express.Router();
const { addObservation, getObservations } = require("../services/observations_service");
const { createFHIRObservation } = require("../utils/fhirAdapter");

// POST: Add observation
router.post("/", (req, res) => {
  try {
    const obs = req.body;
    if (!obs || !Array.isArray(obs.component) || obs.component.length === 0)
      return res.status(400).json({ error: "'component' array is required" });

    const savedObs = addObservation(obs);
    res.status(201).json(createFHIRObservation(savedObs));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// GET: Return full FHIR observations
router.get("/", (req, res) => {
  try {
    const { patientId } = req.query;
    const obsList = getObservations(patientId);
    const fullFHIR = obsList.map(o => createFHIRObservation(o));
    res.json(fullFHIR);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
