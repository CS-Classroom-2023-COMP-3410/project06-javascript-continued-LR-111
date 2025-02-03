document.addEventListener("DOMContentLoaded", function () {
  const table = document.getElementById("periodic-table");
  const themeToggle = document.getElementById("theme-toggle");

  // ✅ Ensure Dark Mode is applied on page load (if previously enabled)
  if (localStorage.getItem("dark-mode") === "enabled") {
      enableDarkMode();
  }

  generateTable();

  // ✅ Toggle Dark Mode when button is clicked
  themeToggle.addEventListener("click", () => {
      if (document.body.classList.contains("dark-mode")) {
          disableDarkMode();
      } else {
          enableDarkMode();
      }
  });
});

function generateTable(filteredElements = elements) {
  const table = document.getElementById("periodic-table");
  table.innerHTML = ""; // Clear existing table

  filteredElements.forEach((element) => {
      const div = document.createElement("div");
      div.classList.add("element");
      div.innerText = element.symbol;
      div.dataset.number = element.number;
      div.dataset.group = element.group;
      div.dataset.state = element.state;
      div.draggable = true; // Make element draggable
      // Drag events
      div.addEventListener("dragstart", handleDragStart);
      div.addEventListener("dragover", handleDragOver);
      div.addEventListener("drop", handleDrop);
      div.addEventListener("dragend", handleDragEnd);

      div.onclick = () => showDetails(element);
      table.appendChild(div);
  });
}

let draggedElement = null;


function handleDragStart(event) {
  draggedElement = event.target;
  event.dataTransfer.setData("text/plain", draggedElement.dataset.number);
  event.target.style.opacity = "0.5"; // Reduce opacity when dragging
}

function handleDragOver(event) {
  event.preventDefault();
  event.target.classList.add("drag-over");
}

function handleDrop(event) {
  event.preventDefault();
  event.target.classList.remove("drag-over");

  if (draggedElement !== event.target) {
      // Swap positions
      let temp = draggedElement.innerHTML;
      draggedElement.innerHTML = event.target.innerHTML;
      event.target.innerHTML = temp;
  }
}

function handleDragEnd(event) {
  event.target.style.opacity = "1"; // Restore opacity
  document.querySelectorAll(".element").forEach(el => el.classList.remove("drag-over"));
}


function showDetails(element) {
  const details = document.getElementById("element-details");
  details.classList.remove("hidden");
  details.innerHTML = `
      <h2>${element.name} (${element.symbol})</h2>
      <p>Atomic Number: ${element.number}</p>
      <p>Group: ${element.group}</p>
      <p>State: ${element.state.charAt(0).toUpperCase() + element.state.slice(1)}</p>
  `;

  // ✅ Remove previous highlights
  document.querySelectorAll(".element").forEach((el) => el.classList.remove("highlight"));

  // ✅ Highlight selected element and its group
  document.querySelectorAll(`[data-group="${element.group}"]`).forEach((el) => el.classList.add("highlight"));
}

function searchElement() {
  const input = document.getElementById("search").value.trim().toLowerCase();
  const isNumeric = /^\d+$/.test(input);
  let matchedElements = [];

  if (!input) {
      matchedElements = elements;
  } else if (isNumeric) {
      matchedElements = elements.filter((e) => e.number.toString().includes(input));
  } else {
      const symbolElement = elements.find((e) => e.symbol.toLowerCase() === input);
      matchedElements = symbolElement
          ? [symbolElement]
          : elements.filter((e) => e.name.toLowerCase().includes(input));
  }

  generateTable(matchedElements);
}

function filterByState() {
  const stateFilter = document.getElementById("state-filter").value;

  if (stateFilter === "all") {
      generateTable(elements);
  } else {
      const filteredElements = elements.filter((e) => e.state === stateFilter);
      generateTable(filteredElements);
  }
}

function enableDarkMode() {
  document.body.classList.add("dark-mode");
  localStorage.setItem("dark-mode", "enabled");
  document.getElementById("theme-toggle").textContent = "☀️ Light Mode";
}

function disableDarkMode() {
  document.body.classList.remove("dark-mode");
  localStorage.setItem("dark-mode", "disabled");
  document.getElementById("theme-toggle").textContent = "🌙 Dark Mode";
}


function generateQuizQuestion() {
  const questionElement = document.getElementById("quiz-question");
  const optionsContainer = document.getElementById("quiz-options");
  const feedbackElement = document.getElementById("quiz-feedback");

  // Clear previous options and feedback
  optionsContainer.innerHTML = "";
  feedbackElement.textContent = "";

  // Pick a random element
  const randomElement = elements[Math.floor(Math.random() * elements.length)];
  
  // Generate question
  const questionType = Math.random() < 0.5 ? "name" : "symbol"; // Randomly choose question type
  let correctAnswer, questionText;

  if (questionType === "name") {
      questionText = `What is the symbol for ${randomElement.name}?`;
      correctAnswer = randomElement.symbol;
  } else {
      questionText = `Which element has the symbol ${randomElement.symbol}?`;
      correctAnswer = randomElement.name;
  }

  questionElement.textContent = questionText;

  // Generate wrong options
  let options = [correctAnswer];
  while (options.length < 4) {
      const randomOption = elements[Math.floor(Math.random() * elements.length)];
      const optionText = questionType === "name" ? randomOption.symbol : randomOption.name;

      if (!options.includes(optionText)) {
          options.push(optionText);
      }
  }

  // Shuffle options
  options.sort(() => Math.random() - 0.5);

  // Create buttons for options
  options.forEach(option => {
      const button = document.createElement("button");
      button.textContent = option;
      button.onclick = () => checkAnswer(button, correctAnswer);
      optionsContainer.appendChild(button);
  });
}

function checkAnswer(button, correctAnswer) {
  const feedbackElement = document.getElementById("quiz-feedback");
  
  if (button.textContent === correctAnswer) {
      button.classList.add("correct");
      feedbackElement.textContent = "✅ Correct!";
  } else {
      button.classList.add("incorrect");
      feedbackElement.textContent = "❌ Incorrect. Try again!";
  }

  // Disable all buttons after answering
  document.querySelectorAll("#quiz-options button").forEach(btn => btn.disabled = true);
}

// Load first quiz question when page loads
document.addEventListener("DOMContentLoaded", generateQuizQuestion);


// ✅ Debugging: Show voice search activation
document.getElementById("voice-search").addEventListener("click", function () {
  console.log("🔍 Voice Recognition Started");

  // ✅ Check if browser supports Speech Recognition
  if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition. Please use Google Chrome.");
      return;
  }

  // ✅ Create a Speech Recognition instance
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();

  // ✅ Update UI to show listening status
  document.getElementById("voice-status").textContent = "🎤 Listening... Speak an element name.";

  recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      
      console.log("🎤 Recognized Speech:", transcript); // ✅ Debugging output

      // ✅ Show recognized text in the search box
      document.getElementById("search").value = transcript;

      // ✅ Perform search
      searchByVoice(transcript);
  };

  recognition.onerror = function (event) {
      console.error("❌ Speech Recognition Error:", event.error);
      document.getElementById("voice-status").textContent = "❌ Voice search error. Try again.";
  };

  recognition.onend = function () {
      console.log("✅ Voice Recognition Ended");
      document.getElementById("voice-status").textContent = "";
  };
});

// ✅ Improved Search Function
function searchByVoice(query) {
  let foundElement = elements.find(el => el.name.toLowerCase() === query);

  if (!foundElement) {
      // ✅ Try partial match
      foundElement = elements.find(el => el.name.toLowerCase().includes(query));

      if (!foundElement) {
          console.log("⚠️ No match found for:", query);
          document.getElementById("voice-status").textContent = "⚠️ Element not found. Try again.";
          return;
      }
  }

  console.log("✅ Matched Element:", foundElement.name); // ✅ Debugging output

  // ✅ Display Element Details
  const details = document.getElementById("element-details");
  details.classList.remove("hidden");
  details.innerHTML = `
      <h2>${foundElement.name} (${foundElement.symbol})</h2>
      <p>Atomic Number: ${foundElement.number}</p>
      <p>Group: ${foundElement.group}</p>
  `;

  // ✅ Remove previous highlights
  document.querySelectorAll(".element").forEach(el => el.classList.remove("highlight"));

  // ✅ Highlight found element
  const matchingElement = document.querySelector(`[data-number="${foundElement.number}"]`);
  if (matchingElement) {
      matchingElement.classList.add("highlight");
  }
}
