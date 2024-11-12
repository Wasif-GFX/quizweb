// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAGeQnDznFBxRYleYxe2BQmKCTb3JVd4s",
  authDomain: "quizweb-pk.firebaseapp.com",
  databaseURL: "https://quizweb-pk-default-rtdb.firebaseio.com",
  projectId: "quizweb-pk",
  storageBucket: "quizweb-pk.appspot.com",
  messagingSenderId: "81490295577",
  appId: "1:81490295577:web:28d59efd22056fcd93e388",
  measurementId: "G-9NS71VTBR7",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase references
const auth = firebase.auth();
const database = firebase.database();

// Signup function
function signUp(email, password) {
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      database.ref("users/" + user.uid).set({
        email: user.email,
        score: 0,
      });
      alert("Signup successful! You can now login.");
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

// Login function
function logIn(email, password) {
  auth
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Login successful!");
      document.getElementById("auth-container").style.display = "none";
      document.getElementById("todo-container").style.display = "block";
      initializeQuiz();
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

// Form handlers
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("logEmail").value;
    const password = document.getElementById("logPas").value;
    logIn(email, password);
  });

document
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("signEmail").value;
    const password = document.getElementById("signPas").value;
    signUp(email, password);
  });

// Quiz logic
let questions = [
  {
    question: "What is the purpose of a logo?",
    option1: "To create a unique identifier for a brand",
    option2: "To describe the product in detail",
    option3: "To fill space on marketing materials",
    corrAnswer: "To create a unique identifier for a brand",
  },
  {
    question: "Which file format is ideal for web graphics with transparency?",
    option1: ".jpg",
    option2: ".png",
    option3: ".gif",
    corrAnswer: ".png",
  },
  {
    question: "In design, what is kerning?",
    option1: "Spacing between lines of text",
    option2: "Adjustment of space between individual letters",
    option3: "Creating a new font",
    corrAnswer: "Adjustment of space between individual letters",
  },
  {
    question: "What is a vector graphic?",
    option1: "An image that loses quality when resized",
    option2: "An image made of pixels",
    option3: "An image made of mathematical paths",
    corrAnswer: "An image made of mathematical paths",
  },
  {
    question: "Which color mode is used for print design?",
    option1: "RGB",
    option2: "CMYK",
    option3: "HSV",
    corrAnswer: "CMYK",
  },
  {
    question: "What does DPI stand for?",
    option1: "Dots per inch",
    option2: "Digital picture index",
    option3: "Design pixel interval",
    corrAnswer: "Dots per inch",
  },
  {
    question:
      "In Adobe Photoshop, which tool is used to select an area based on color?",
    option1: "Move Tool",
    option2: "Magic Wand Tool",
    option3: "Brush Tool",
    corrAnswer: "Magic Wand Tool",
  },
  {
    question: "What is the main function of layers in graphic design software?",
    option1: "To combine all elements into one image",
    option2: "To separate and organize different elements",
    option3: "To increase file size",
    corrAnswer: "To separate and organize different elements",
  },
  {
    question: "Which typeface is typically used for body text in print?",
    option1: "Sans-serif",
    option2: "Serif",
    option3: "Script",
    corrAnswer: "Serif",
  },
  {
    question: "What does the pen tool in design software create?",
    option1: "Text layers",
    option2: "Vector paths and shapes",
    option3: "Image filters",
    corrAnswer: "Vector paths and shapes",
  },
];

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 120; // 2 minutes
const questionElement = document.getElementById("ques");
const option1Label = document.getElementById("opt1");
const option2Label = document.getElementById("opt2");
const option3Label = document.getElementById("opt3");
const nextButton = document.getElementById("btn");
const timerElement = document.getElementById("timer");
let timerInterval;

// Initialize quiz
function initializeQuiz() {
  loadQuestion();
  startTimer();
}

// Function to load a question
function loadQuestion() {
  if (currentQuestionIndex < questions.length) {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    option1Label.textContent = currentQuestion.option1;
    option2Label.textContent = currentQuestion.option2;
    option3Label.textContent = currentQuestion.option3;
  } else {
    // End quiz if no more questions
    clearInterval(timerInterval);
    saveScoreAndLogout();
  }
}

// Function to handle option selection
function clicked() {
  nextButton.disabled = false;
}

// Function to go to the next question and restart the timer
function nextQuestion() {
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (selectedOption) {
    const selectedAnswer = selectedOption.nextElementSibling.textContent;
    if (selectedAnswer === questions[currentQuestionIndex].corrAnswer) {
      score += 1; // Increase score if answer is correct
    }
    selectedOption.checked = false; // Uncheck the selected option for the next question
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    loadQuestion();
    nextButton.disabled = true;
    restartTimer(); // Restart timer for the new question
  } else {
    // End the quiz if there are no more questions
    clearInterval(timerInterval);
    saveScoreAndLogout();
  }
}

// Function to restart the timer for each new question
function restartTimer() {
  clearInterval(timerInterval); // Clear any existing timer
  timeLeft = 120; // Reset time (e.g., 2 minutes)
  startTimer(); // Start the timer again
}

// Function to start the timer
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      saveScoreAndLogout();
    }
  }, 1000);
}

// Function to show quiz results and automatically log out
function saveScoreAndLogout() {
  const user = auth.currentUser;
  if (user) {
    // Update the user's score in the database
    database
      .ref("users/" + user.uid)
      .update({
        score: score,
      })
      .then(() => {
        // Show results to the user
        const popup = document.createElement("div");
        popup.className = "custom-popup";
        popup.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your Score: ${score} / ${questions.length}</p>
        <button onclick="closePopupAndLogout()">Close</button>
      `;
        document.body.appendChild(popup);
      });
  }
}

// Function to close the results popup and log out the user
function closePopupAndLogout() {
  document.querySelector(".custom-popup").remove();
  logOut();
}

// Logout function
function logOut() {
  auth
    .signOut()
    .then(() => {
      alert("Logged out successfully.");
      document.getElementById("auth-container").style.display = "block";
      document.getElementById("todo-container").style.display = "none";
      clearInterval(timerInterval);
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

// Monitor auth state
auth.onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("todo-container").style.display = "block";
    initializeQuiz();
  } else {
    document.getElementById("auth-container").style.display = "block";
    document.getElementById("todo-container").style.display = "none";
  }
});
