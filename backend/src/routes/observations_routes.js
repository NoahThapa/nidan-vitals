const express = require("express");
const router = express.Router();
const { addObservation, getObservations } = require("../services/observations_service");
const { mapFHIRObservation } = require("../utils/fhirAdapter");

// POST /api/fhir/observation
router.post("/", (req, res) => {
  try {
    const obs = req.body;

    // Validate observation
    if (!obs || !Array.isArray(obs.component) || obs.component.length === 0) {
      return res.status(400).json({ error: "Invalid observation: 'component' array is required" });
    }

    const savedObs = addObservation(obs);
    res.status(201).json(mapFHIRObservation(savedObs));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/fhir/observation
router.get("/", (req, res) => {
  try {
    const { patientId, filter } = req.query;
    const observations = getObservations(patientId, filter) || []; // ensure an array

    const mapped = observations.map((obs) => {
      // Safely map only if component exists
      if (!obs.component || !Array.isArray(obs.component)) return null;
      return mapFHIRObservation(obs);
    }).filter(Boolean); // remove nulls

    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
