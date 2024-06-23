// variables to keep track of quiz state
// currentQuestionIndex set to 0 for first question in array from questions.js
var currentQuestionIndex = 0;
//current questions times 10. 10 questions currently in questions.js should equal 100 seconds.
var time = questions.length * 10;
var timer;

// variables to reference the Document Object Model (DOM) elements inside index.html
var questionsEl = document.getElementById('questions');
var timerEl = document.getElementById('time');
var choicesEl = document.getElementById('choices');
var submitBtn = document.getElementById('submit');
var startBtn = document.getElementById('start');
var initialsEl = document.getElementById('initials');
var responseEl = document.getElementById('response');

// function to hide the start screen, start the quiz and start the timer (1000 milliseconds = 1 second)
function startQuiz() {
  var startScreenEl = document.getElementById('start-screen');
  startScreenEl.setAttribute('class', 'hide');
  questionsEl.removeAttribute('class');
  timer = setInterval(clockTick, 1000);
  timerEl.textContent = time;
  getQuestion();
}
startBtn.onclick = startQuiz;

// function gets the current question from the array, updates the question and clears out the old question
function getQuestion() {
  var currentQuestion = questions[currentQuestionIndex];
  var questionEl = document.getElementById('current');
  questionEl.textContent = currentQuestion.question;
  choicesEl.innerHTML = '';
  // for loop over question choices by length
  for (var i = 0; i < currentQuestion.choices.length; i++) {
    var choice = currentQuestion.choices[i];
    var choiceNode = document.createElement('button');
    choiceNode.setAttribute('class', 'choice');
    choiceNode.setAttribute('value', choice);
    choiceNode.textContent = i + 1 + '. ' + choice;
    choicesEl.appendChild(choiceNode);
  }
}

// function to check if choice button is clicked, check if right or wrong, reduces time for wrong answer,
// moves to the next question and checks if any more questions exist
function questionClick(event) {
  var buttonEl = event.target;
  if (!buttonEl.matches('.choice')) {
    return;
  }
  if (buttonEl.value !== questions[currentQuestionIndex].answer) {
    time -= 10;
    if (time < 0) {
      time = 0;
    }
    timerEl.textContent = time;
    responseEl.textContent = 'Wrong!';
  } else {
    responseEl.textContent = 'Correct!';
  }
  responseEl.setAttribute('class', 'response');
  setTimeout(function () {
    responseEl.setAttribute('class', 'response hide');
  }, 1000);
  currentQuestionIndex++;
  if (time <= 0 || currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}
choicesEl.onclick = questionClick;

// function to end the quiz, show the 'game-over'screen, and final score
function quizEnd() {
  clearInterval(timer);
  var endScreenEl = document.getElementById('game-over');
  endScreenEl.removeAttribute('class');
  var finalScoreEl = document.getElementById('final-score');
  finalScoreEl.textContent = time;
  questionsEl.setAttribute('class', 'hide');
}

// function to update the clock and check if time has run out
function clockTick() {
  time--;
  timerEl.textContent = time;
  if (time <= 0) {
    quizEnd();
  }
}

// function gets the initials input, gets previous high scores, and saves to local storage
function saveHighscore() {
  var initials = initialsEl.value.trim();
  if (initials !== '') {
    var highscores =
      JSON.parse(window.localStorage.getItem('highscores')) || [];
    var newScore = {
      score: time,
      initials: initials,
    };
    highscores.push(newScore);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));
    window.location.href = 'highscores.html';
  }
}
submitBtn.onclick = saveHighscore;