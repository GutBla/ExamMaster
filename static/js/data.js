// data.js
async function loadQuestions() {
    const response = await fetch('../Pregunta.json');
    const data = await response.json();
    return data;
}
