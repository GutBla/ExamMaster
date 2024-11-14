let flashcardIndex = 0;
let questions = [];
let totalFlashcards = 0; // Total de tarjetas
let score = 0;
let incorrectCount = 0;
let quizQuestions = [];
let currentQuestionIndex = 0;
let totalQuestions = 20;
let randomOrder = [];

document.addEventListener("DOMContentLoaded", async () => {
    // Cargar preguntas desde el archivo JSON
    questions = await loadQuestions();
    totalFlashcards = questions.length; // Asignamos el total de tarjetas

    // Verificar qué sección cargar
    if (document.getElementById("flashcard-container")) {
        displayFlashcard(flashcardIndex);
    }
    if (document.getElementById("quiz-container")) {
        startQuiz();
    }
    if (document.getElementById("questions-table")) {
        populateTable(questions); // Mostrar todas las preguntas inicialmente
    }
});

// Función para cargar preguntas desde el archivo JSON
async function loadQuestions() {
    const response = await fetch('../Pregunta.json');
    const data = await response.json();
    return data;
}

// Función para mostrar Flashcards
function displayFlashcard(index) {
    const question = questions[index];
    document.getElementById("flashcard-question").textContent = question.Pregunta;
    document.getElementById("flashcard-answer").textContent = question[`Opciones_${question.Opcion_Correcta}`];
    document.getElementById("flashcard-answer").style.display = "none";

    // Actualizar el contador de tarjetas
    document.getElementById("flashcard-counter").textContent = `${index + 1} / ${totalFlashcards}`;
}

// Función para mostrar la respuesta de la flashcard
function showAnswer() {
    document.getElementById("flashcard-answer").style.display = "block";
}

// Función para pasar a la siguiente tarjeta
function nextFlashcard() {
    flashcardIndex = (flashcardIndex + 1) % questions.length;
    displayFlashcard(flashcardIndex);
}

// Función para ir a la tarjeta anterior
function previousFlashcard() {
    flashcardIndex = (flashcardIndex - 1 + questions.length) % questions.length;
    displayFlashcard(flashcardIndex);
}

// Funciones del Cuestionario
function startQuiz() {
    quizQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, totalQuestions);
    displayQuestion();
}

function displayQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        showQuizResult();
        return;
    }
    const question = quizQuestions[currentQuestionIndex];
    document.getElementById("quiz-question").textContent = question.Pregunta;
    document.getElementById("quiz-options").innerHTML = generateOptions(question);

    // Actualizar el contador de preguntas
    updateQuestionCounter();
}

function generateOptions(question) {
    return ['A', 'B', 'C', 'D', 'E'].map(letter => {
        const option = question[`Opciones_${letter}`];
        return option ? `<button onclick="checkAnswer('${letter}', '${question.Opcion_Correcta}')">${option}</button>` : '';
    }).join('');
}

function checkAnswer(selected, correct) {
    const question = quizQuestions[currentQuestionIndex];
    const selectedAnswer = question[`Opciones_${selected}`];
    const correctAnswer = question[`Opciones_${correct}`];
    
    if (selected === correct) {
        score++;
        showModal(`¡Correcto! Respuesta correcta: ${correctAnswer}`, 'green');
    } else {
        incorrectCount++;
        showModal(`Incorrecto. Respuesta correcta: ${correctAnswer}`, 'red');
    }
}

function showModal(message, color) {
    const modal = document.getElementById("response-modal");
    const modalText = document.getElementById("modal-text");
    
    // Actualizamos el mensaje y el color de fondo según la respuesta
    modalText.textContent = message;
    modal.classList.remove('green', 'red'); // Eliminar clases anteriores
    modal.classList.add(color); // Agregar color según el resultado (verde o rojo)
    
    // Mostrar el modal con el efecto de desvanecimiento
    modal.style.display = "block";
    modal.classList.add("fade-in");
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById("response-modal");
    modal.style.display = "none";
    modal.classList.remove("fade-in"); // Eliminar animación de entrada
    currentQuestionIndex++;
    displayQuestion();
}

function updateQuestionCounter() {
    const counterElement = document.getElementById("question-counter");
    counterElement.textContent = `Pregunta ${currentQuestionIndex + 1} de ${totalQuestions}`;
}

function showQuizResult() {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("quiz-score").style.display = "block";
    document.getElementById("score").textContent = `Puntaje: ${score} / ${quizQuestions.length}`;
    document.getElementById("incorrect-count").textContent = `Incorrectas: ${incorrectCount}`;
}

// Función para llenar la tabla con las preguntas
function populateTable(filteredQuestions) {
    const tableBody = document.querySelector("#questions-table tbody");
    tableBody.innerHTML = filteredQuestions.map(q => ` 
        <tr>
            <td>${q.Id_Pregunta}</td>
            <td>${q.Pregunta}</td>
            <td>${q[`Opciones_${q.Opcion_Correcta}`]}</td>
        </tr>
    `).join('');
}

// Función para buscar preguntas en tiempo real
function searchQuestions() {
    const query = document.getElementById("search-input").value.toLowerCase();
    
    const filteredQuestions = questions.filter(q => {
        const preguntaMatch = q.Pregunta.toLowerCase().includes(query); // Buscar por texto de la pregunta
        const idMatch = q.Id_Pregunta.toString().includes(query); // Buscar por Id_Pregunta
        return preguntaMatch || idMatch; // Coincidir si alguno de los dos filtros es verdadero
    });

    populateTable(filteredQuestions);  // Actualizar la tabla con las preguntas filtradas
}
