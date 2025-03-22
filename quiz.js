const landingPage = document.getElementById('landing-page');
const quizSection = document.getElementById('quiz-section');
const resultsSection = document.getElementById('results-section');
const startQuizBtn = document.getElementById('start-quiz');
const restartQuizBtn = document.getElementById('restart-quiz');
const questionNumber = document.getElementById('question-number');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswers = Array(10).fill(null);
let timeLeft = 300; // 5 minutes in seconds
let timer;

startQuizBtn.addEventListener('click', startQuiz);
prevBtn.addEventListener('click', showPreviousQuestion);
nextBtn.addEventListener('click', showNextQuestion);
restartQuizBtn.addEventListener('click', () => location.reload());

async function fetchQuestions() {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
    const data = await response.json();
    questions = data.results.map(q => ({
      question: q.question,
      options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
      correctAnswer: q.correct_answer
    }));
  } catch (error) {
    console.error('Error fetching questions:', error);
    questions = [];
  }
}

function startQuiz() {
  landingPage.classList.add('hidden');
  quizSection.classList.remove('hidden');
  fetchQuestions().then(() => {
    displayQuestion();
    startTimer();
  });
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showResults();
    }
  }, 1000);
}

function displayQuestion() {
  const question = questions[currentQuestionIndex];
  questionNumber.textContent = currentQuestionIndex + 1;
  questionText.innerHTML = question.question;
  optionsContainer.innerHTML = '';
  question.options.forEach(option => {
    const optionElement = document.createElement('div');
    optionElement.classList.add('option');
    optionElement.innerHTML = option;
    if (selectedAnswers[currentQuestionIndex] === option) {
      optionElement.classList.add('selected');
    }
    optionElement.addEventListener('click', () => {
      selectedAnswers[currentQuestionIndex] = option;
      document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
      optionElement.classList.add('selected');
    });
    optionsContainer.appendChild(optionElement);
  });

  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.textContent = currentQuestionIndex === 9 ? 'Submit' : 'Next';
}

function showPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
  }
}

function showNextQuestion() {
  if (currentQuestionIndex < 9) {
    currentQuestionIndex++;
    displayQuestion();
  } else {
    calculateScore();
    showResults();
  }
}

function calculateScore() {
  score = 0;
  selectedAnswers.forEach((answer, index) => {
    if (answer === questions[index].correctAnswer) score++;
  });
}

function showResults() {
  clearInterval(timer);
  quizSection.classList.add('hidden');
  resultsSection.classList.remove('hidden');
  scoreDisplay.textContent = score;
}
// Add this function to handle smooth transitions between sections
function transitionSection(outSection, inSection) {
    outSection.style.transition = 'opacity 0.5s ease';
    outSection.style.opacity = '0';
    setTimeout(() => {
      outSection.classList.add('hidden');
      inSection.classList.remove('hidden');
      inSection.style.transition = 'opacity 0.5s ease';
      inSection.style.opacity = '1';
    }, 500);
  }
  
  // Update startQuiz to use transition
  function startQuiz() {
    transitionSection(landingPage, quizSection);
    fetchQuestions().then(() => {
      displayQuestion();
      startTimer();
    });
  }
  
  // Update showResults to use transition
  function showResults() {
    clearInterval(timer);
    transitionSection(quizSection, resultsSection);
    scoreDisplay.textContent = score;
  }