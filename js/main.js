// Questions Array
const questions = [
  { question: "Enter your First Name" },
  { question: "Enter your Last Name" },
  {
    question: "Enter your Email",
    pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  { question: "Enter your Password", type: "password" },
  { question: "Please re-enter your Password", type: "password" }
];

// Transition Times
const shakeTime = 100; // Shake Transition Time
const switchTime = 200; // Transition between questions

// Initial Position at first question
let position = 0;

// Initial DOM Elements
const formBox = document.querySelector("#form-box");
const nextBtn = document.querySelector("#next-btn");
const prevBtn = document.querySelector("#prev-btn");
const inputGroup = document.querySelector("#input-group");
const inputField = document.querySelector("#input-field");
const inputLabel = document.querySelector("#input-label");
const inputProgress = document.querySelector("#input-progress");
const progress = document.querySelector("#progress-bar");

// Events

// Get question on DOM load
document.addEventListener("DOMContentLoaded", getQuestion);

// Next Btn
nextBtn.addEventListener("click", validate);

// Prev Button Click
prevBtn.addEventListener("click", () => {
  position = position - 1;
  getQuestion();
});

// Input Field Enter Click
inputField.addEventListener("keyup", e => {
  if (e.keyCode == 13) {
    validate();
  }
});

// Functions

// Get question from array & Add to markup
function getQuestion() {
  // get current question
  inputLabel.innerHTML = questions[position].question;
  // Get current type
  inputField.type = questions[position].type || "text";
  // Get current Answer
  inputField.value = questions[position].answer || "";
  //Focus on current element
  inputField.focus();

  // Set Progress Bar Width - Variable to the questions length
  progress.style.width = (position * 100) / questions.length + "%";

  //Add user icon OR back arrow depending on question
  prevBtn.className = position ? "fas fa-arrow-left" : "fas fa-user";

  showQuestion();
}

//Display question to user
function showQuestion() {
  inputGroup.style.opacity = 1;
  inputProgress.style.transition = "";
  inputProgress.style.width = "100%";
}

// Hide Question
function hideQuestion() {
  inputGroup.style.opacity = 0;
  inputLabel.style.marginLeft = 0;
  inputProgress.style.width = 0;
  inputProgress.style.transition = "none";
  inputGroup.style.border = null;
}

// Transfrom to create shake motion
function transform(x, y) {
  formBox.style.transform = `translate(${x}px, ${y}px)`;
}

// Validate Field
function validate() {
  // Make sure pattern matches if there is one
  if (!inputField.value.match(questions[position].pattern || /.+/)) {
    inputFail();
  } else {
    inputPass();
  }
}

// Field Input Fail
function inputFail() {
  formBox.className = "error";
  // Repeat Shake Motion - set i to no. of shakes
  // here (i<6 & shakeTime * 6, 0, 0) bcoz the box moves forward and backward , forward - 3times and backward - 3times
  for (let i = 0; i < 6; i++) {
    setTimeout(transform, shakeTime * i, ((i % 2) * 2 - 1) * 20, 0);
    setTimeout(transform, shakeTime * 6, 0, 0);
    inputField.focus();
  }
}

// Field Input Pass
function inputPass() {
  formBox.className = "";
  setTimeout(transform, shakeTime * 0, 0, 10);
  setTimeout(transform, shakeTime * 1, 0, 0);

  // Store Answer in array
  questions[position].answer = inputField.value;

  // Increment Position
  position++;

  // If new question, hide current and get next
  if (questions[position]) {
    hideQuestion();
    getQuestion();
  } else {
    // Remove if no more questions
    hideQuestion();
    formBox.className = "close";
    progress.style.width = "100%";

    // form Complete
    formComplete();
  }
}

// All field complete - Show h1 end
function formComplete() {
  const h1 = document.createElement("h1");
  h1.classList.add("end");
  let br = () => document.createElement("br");
  h1.appendChild(
    document.createTextNode(
      `Dear ${questions[0].answer} ${questions[1].answer},`
    )
  );
  h1.appendChild(br());
  h1.appendChild(document.createTextNode(`Thank You for registering.`));
  h1.appendChild(br());
  h1.appendChild(
    document.createTextNode(`You will get an confirmation Email shortly.`)
  );
  setTimeout(() => {
    formBox.parentElement.appendChild(h1);
    setTimeout(() => (h1.style.opacity = 1), 50);
  }, 1000);
}
