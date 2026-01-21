import axios from "axios";

export const fetchObservations = async (patientId, filter) => {
  const query = [];
  if(patientId) query.push(`patientId=${patientId}`);
  if(filter && filter!=="All") query.push(`filter=${filter}`);
  const queryString = query.length ? "?"+query.join("&") : "";
  const res = await axios.get(`http://localhost:5000/api/fhir/observation${queryString}`);
  return res.data;
};

export const postObservation = async (obs) => {
  const res = await axios.post(`http://localhost:5000/api/fhir/observation`, obs);
  return res.data;
};
