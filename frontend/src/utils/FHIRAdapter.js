export const mapFHIRToUI = (obs) => {
  const bmi = obs.component.find(c => c.code.coding[0].code === "39156-5")?.valueQuantity?.value || 0;
  const systolic = obs.component.find(c => c.code.coding[0].code === "8480-6")?.valueQuantity?.value || 0;
  const diastolic = obs.component.find(c => c.code.coding[0].code === "8462-4")?.valueQuantity?.value || 0;
  const date = obs.effectiveDateTime || new Date().toISOString();
  let category="", color="";
  if(bmi<18.5){category="Underweight"; color="blue";}
  else if(bmi<25){category="Normal"; color="green";}
  else if(bmi<30){category="Overweight"; color="orange";}
  else{category="Obese"; color="red";}
  if(bmi>=30||systolic>=140||diastolic>=90) color="red";

  return { patientId: obs.patientId || obs.subject.reference.replace("Patient/",""), bmi, category, color, systolic, diastolic, date };
};
