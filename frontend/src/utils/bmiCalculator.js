// frontend/src/utils/bmiCalculator.js
export const calculateBMI = (weight, height) => {
    const bmi = weight / ((height / 100) ** 2);
    let category = "";
    let color = "";

    if (bmi < 18.5) { category = "Underweight"; color = "blue"; }
    else if (bmi < 25) { category = "Normal"; color = "green"; }
    else if (bmi < 30) { category = "Overweight"; color = "orange"; }
    else { category = "Obese"; color = "red"; }

    return { bmi: bmi.toFixed(1), category, color };
};
