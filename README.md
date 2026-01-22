FHIR Vital Signs Tracker

A simple web application to record and view patient vital signs using FHIR Observation standard.
Frontend is built with React + TailwindCSS, and backend with Node.js + Express. Observations are stored in-memory for demonstration purposes.

📚 Technical Stack

Backend:

Language: JavaScript (Node.js)

Framework: Express.js

Libraries:

uuid → Generate unique IDs for observations

cors → Enable cross-origin requests

nodemon → Auto-restart server during development

Frontend:

Language: JavaScript

Framework: React.js (Functional Components + Hooks)

Libraries:

axios → HTTP requests

tailwindcss → Styling

Data:

Observations stored in-memory (observations array) — no database required

⚙️ Setup Instructions
1. Backend

Open terminal and go to backend folder:

cd backend


Initialize Node project (if not already):

npm init -y


Install dependencies:

npm install express uuid cors
npm install --save-dev nodemon


Start backend:

npm run dev


Backend runs on: http://localhost:5000

2. Frontend

Open terminal and go to frontend folder:

cd frontend


Start frontend:

npm install
npm run dev


Frontend runs on: http://localhost:3000

Now open http://localhost:3000 in your browser to use the app.


Notes on TailwindCSS

Tailwind is included in the project and configured via tailwind.config.js.

Styles are applied using utility classes directly in React components.

Make sure index.css includes:

@tailwind base;
@tailwind components;
@tailwind utilities;


No extra setup required after installing node_modules.

🚀 Features

Add new patient vital signs (Height, Weight, BMI, Systolic & Diastolic BP)

View patient observations in a table

Search patients by ID

Filter patients by BMI Status: Underweight, Normal, Overweight, Obese

Color-coded status badges for BMI and Blood Pressure

📡 API Endpoints

POST /api/fhir/observation

Add a new observation

Request body: FHIR Observation JSON (with component array for vitals)

Response: Saved observation in FHIR format

GET /api/fhir/observation

Get all observations

Optional query: ?patientId=p-101 to filter by patient ID

Response: Array of FHIR Observations