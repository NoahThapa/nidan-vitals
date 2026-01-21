const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const observationRoutes = require("./routes/observations_routes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/fhir/observation", observationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
