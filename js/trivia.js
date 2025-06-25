/* German Javier 2025 */

//  función autoejecutable
(function() {'use strict';

    const categoriesData = [
    {
        name: "Ciencia",
        questions: [
            { question: "La Tierra es plana.", choices: ["Verdadero", "Falso"], answer: "Falso" },
            { question: "El agua hierve a 100 grados Celsius.", choices: ["Verdadero", "Falso"], answer: "Verdadero" },
            { question: "¿Qué planeta es conocido como el Planeta Rojo?", choices: ["Tierra", "Marte", "Júpiter", "Venus"], answer: "Marte" },
            { question: "El símbolo químico del oro es Au.", choices: ["Verdadero", "Falso"], answer: "Verdadero" },
            { question: "¿Qué gas absorben las plantas de la atmósfera?", choices: ["Oxígeno", "Dióxido de carbono", "Nitrógeno", "Hidrógeno"], answer: "Dióxido de carbono" }
        ]
    },
    {
        name: "Historia",
        questions: [
            { question: "¿En qué año llegó Cristóbal Colón a América?", choices: ["1492", "1500", "1485", "1510"], answer: "1492" },
            { question: "La Segunda Guerra Mundial terminó en 1945.", choices: ["Verdadero", "Falso"], answer: "Verdadero" },
            { question: "¿Quién fue el primer presidente de Estados Unidos?", choices: ["George Washington", "Abraham Lincoln", "Thomas Jefferson", "John Adams"], answer: "George Washington" },
            { question: "La Revolución Francesa comenzó en 1789.", choices: ["Verdadero", "Falso"], answer: "Verdadero" },
            { question: "¿Qué imperio construyó el Coliseo en Roma?", choices: ["Griego", "Egipcio", "Romano", "Persa"], answer: "Romano" }
        ]
    },
    {
        name: "Geografía",
        questions: [
            { question: "¿Cuál es el río más largo del mundo?", choices: ["Nilo", "Amazonas", "Yangtsé", "Mississippi"], answer: "Amazonas" },
            { question: "El Monte Everest es la montaña más alta del mundo.", choices: ["Verdadero", "Falso"], answer: "Verdadero" },
            { question: "¿Qué país tiene la mayor población del mundo?", choices: ["India", "Estados Unidos", "China", "Indonesia"], answer: "China" },
            { question: "El desierto del Sahara está en Asia.", choices: ["Verdadero", "Falso"], answer: "Falso" },
            { question: "¿En qué continente está Brasil?", choices: ["Asia", "África", "América", "Europa"], answer: "América" }
        ]
    },
    {
    name: "Programación",
    questions: [
        { question: "¿Qué significa HTML?", choices: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "High Text Machine Language", "Hyper Text Markdown Language"], answer: "Hyper Text Markup Language" },
        { question: "Java y JavaScript son lo mismo.", choices: ["Verdadero", "Falso"], answer: "Falso" },
        { question: "¿Cuál de estos es un lenguaje de programación?", choices: ["HTML", "CSS", "Python", "SQL"], answer: "Python" },
        { question: "¿Qué símbolo se usa para comentarios en JavaScript?", choices: ["//", "/* */", "#", "<!-- -->"], answer: "//" },
        { question: "¿Qué valor booleano retorna: Boolean(0)?", choices: ["true", "false"], answer: "false" }
    ]
}
];


    // Clona las categorías para evitar cambios en el array
    function cloneCategories() {
        return JSON.parse(JSON.stringify(categoriesData));
    }

    const welcomeScreen = document.getElementById('welcome-screen');
    const startYesBtn = document.getElementById('start-yes');
    const startNoBtn = document.getElementById('start-no');
    const playerInfoScreen = document.getElementById('player-info');
    const playerNameInput = document.getElementById('player-name');
    const nameValidation = document.getElementById('name-validation');
    const submitNameBtn = document.getElementById('submit-name');
    const questionScreen = document.getElementById('question-screen');
    const categoryProgressElem = document.getElementById('category-progress');
    const categoryNameElem = document.getElementById('category-name');
    const questionTextElem = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const nextQuestionBtn = document.getElementById('next-question');
    const summaryScreen = document.getElementById('summary');
    const playerSummary = document.getElementById('player-summary');
    const scoreSummary = document.getElementById('score-summary');
    const rankingTableBody = document.getElementById('ranking-table-body');
    const playAgainBtn = document.getElementById('play-again');

    let player = { name: '', correct: 0, incorrect: 0 };
    let categories = cloneCategories();
    let currentCategoryIndex = 0;
    let currentQuestionIndex = 0;

    let ranking = JSON.parse(localStorage.getItem('triviaRanking') || '[]');

    function resetGameState() {
        player.correct = 0;
        player.incorrect = 0;
        categories = cloneCategories();
        currentCategoryIndex = 0;
        currentQuestionIndex = 0;
    }

    // mostrar/ocultar elementos duarnte el juego
    function showEl(el) { el.classList.remove('hidden'); }
    function hideEl(el) { el.classList.add('hidden'); }

    function validatePlayerName() {
    const val = playerNameInput.value.trim();
    const lowerVal = val.toLowerCase(); // lo pasamos a minúscula

    // revisa si ya existe en el ranking
    let nameUsed = false;
    for (let i = 0; i < ranking.length; i++) {
        if (ranking[i].name.toLowerCase() === lowerVal) {
            nameUsed = true;
            break;
        }
    }

    if (val.length < 2) {
        nameValidation.textContent = 'El nombre debe tener al menos 2 caracteres';
        submitNameBtn.disabled = true;
    } else if (nameUsed) {
        nameValidation.textContent = 'Ese nombre ya está en uso, elige otro';
        submitNameBtn.disabled = true;
    } else {
        nameValidation.textContent = '';
        submitNameBtn.disabled = false;
    }
}


    function renderQuestion() {
        nextQuestionBtn.disabled = true;
        answersContainer.innerHTML = '';

        // obtener la categoría actual
        const cat = categories[currentCategoryIndex];
        // obtener la pregunta actual
        const ques = cat.questions[currentQuestionIndex];

        categoryNameElem.textContent = `Categoría: ${cat.name}`;
        categoryProgressElem.textContent = `Categoría ${currentCategoryIndex+1} de ${categories.length} · Pregunta ${currentQuestionIndex+1} de ${cat.questions.length}`;
        questionTextElem.textContent = ques.question;

        ques.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'answer-option';
        btn.type = 'button';
        btn.textContent = choice;
        btn.setAttribute('role', 'listitem');
        btn.addEventListener('click', () => handleAnswer(btn, ques.answer));
        answersContainer.appendChild(btn);
        });
    }

    function handleAnswer(buttonClicked, correctAnswer) {
        const buttons = answersContainer.querySelectorAll('button.answer-option');
        buttons.forEach(btn => btn.disabled = true);
        nextQuestionBtn.disabled = false;

        if (buttonClicked.textContent === correctAnswer) {
        buttonClicked.classList.add('correct');
        player.correct++;
        } else {
        buttonClicked.classList.add('incorrect');
        player.incorrect++;
        buttons.forEach(btn => {
            if (btn.textContent === correctAnswer) {
            btn.classList.add('correct');
            }
        });
        }
    }

    function nextStep() {
        currentQuestionIndex++;

        if (currentQuestionIndex >= categories[currentCategoryIndex].questions.length) {
        currentCategoryIndex++;
        currentQuestionIndex = 0;
        }

        if (currentCategoryIndex >= categories.length) {
        showSummary();
        } else {
        renderQuestion();
        }
    }

    function showSummary() {
        hideEl(questionScreen);
        hideEl(playerInfoScreen);
        hideEl(welcomeScreen);

        playerSummary.textContent = `Jugador: ${player.name}`;
        scoreSummary.textContent = `Respuestas correctas: ${player.correct} | Respuestas incorrectas: ${player.incorrect}`;

        ranking.push({ name: player.name, correct: player.correct });
        ranking.sort((a, b) => b.correct - a.correct);
        if (ranking.length > 20) ranking.length = 20;
        localStorage.setItem('triviaRanking', JSON.stringify(ranking));

        rankingTableBody.innerHTML = '';
        ranking.slice(0, 5).forEach((entry, idx) => {
        const tr = document.createElement('tr');
        const rankTd = document.createElement('td');
        const nameTd = document.createElement('td');
        const scoreTd = document.createElement('td');

        rankTd.textContent = idx + 1;
        nameTd.textContent = entry.name;
        scoreTd.textContent = entry.correct;

        tr.appendChild(rankTd);
        tr.appendChild(nameTd);
        tr.appendChild(scoreTd);
        rankingTableBody.appendChild(tr);
        });

        showEl(summaryScreen);
    }

    function restartGame() {
        resetGameState();
        player.name = '';
        playerNameInput.value = '';
        submitNameBtn.disabled = true;
        nameValidation.textContent = '';
        hideEl(summaryScreen);
        showEl(welcomeScreen);
    }

    startYesBtn.onclick = () => {
        hideEl(welcomeScreen);
        showEl(playerInfoScreen);
        playerNameInput.focus();
    };

    startNoBtn.onclick = () => {
        alert("¡No hay problema! Vuelve cuando quieras.");
    };

    playerNameInput.oninput = validatePlayerName;

    submitNameBtn.onclick = () => {
        player.name = playerNameInput.value.trim();
        hideEl(playerInfoScreen);
        showEl(questionScreen);
        renderQuestion();
    };

    nextQuestionBtn.onclick = () => {
        nextStep();
    };

    playAgainBtn.onclick = restartGame;
})();
