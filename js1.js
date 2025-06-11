document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const API_URL = "https://mysystembsit.onlinewebshop.net"; // Replace with your actual API URL
  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");
  const startButton = document.getElementById("start-btn");
  const restartButton = document.getElementById("restart-btn");
  const shareButton = document.getElementById("share-btn");
  const backButton = document.getElementById("back-btn");

  const questionText = document.getElementById("question-text");
  const answersContainer = document.getElementById("answers-container");
  const currentQuestionSpan = document.getElementById("current-question");
  const totalQuestionsSpan = document.getElementById("total-questions");
  const scoreSpan = document.getElementById("score");
  const finalScoreSpan = document.getElementById("final-score");
  const resultMessage = document.getElementById("result-message");
  const progressBar = document.getElementById("progress");
  const timerElement = document.getElementById("time-left");

  // Modal logic
  const modal = document.getElementById("info-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const closeModal = document.getElementById("close-modal");

  // High Score Modal logic
  const showHighscoreBtn = document.getElementById("show-highscore-btn");
  const highscoreModal = document.getElementById("highscore-modal");
  const closeHighscoreModal = document.getElementById("close-highscore-modal");
  const modalLeaderboardList = document.getElementById("modal-leaderboard-list");

  // Mechanics and Rules modal
  document.getElementById("mechanics-btn").onclick = function() {
    modalTitle.textContent = "Game Mechanics";
    modalBody.innerHTML = `
      <ul style="padding-left:1.2em;">
        <li>Make two groups to perform the game.</li>
        <li>Choose the correct answer in the game provided.</li>
        <li>Each correct answer will recieve a +5 points, while uncorrect answer will recieve a -5 points.</li>
        <li>After the series of answering the question, it shows the correct answer and points in every question.</li>
        <li>The Group who got the highest score will recognize as a winner.</li>
      </ul>
    `;
    modal.classList.add("active");
  };
  document.getElementById("rules-btn").onclick = function() {
    modalTitle.textContent = "Rules";
    modalBody.innerHTML = `
      <ul style="padding-left:1.2em;">
        <li>There are two selected categories: Single bulb and RGB bulb.</li>
        <li>Each category has 3 levels: EASY, AVERAGE, and HARD.</li>
        <li>Each level contains 5 questions.</li>
        <li>15 seconds to answer each question.</li>
      </ul>
    `;
    modal.classList.add("active");
  };
  closeModal.onclick = function() {
    modal.classList.remove("active");
  };
  window.onclick = function(event) {
    if (event.target === modal) modal.classList.remove("active");
  };

  // High Score Modal logic
  if (showHighscoreBtn) {
  showHighscoreBtn.addEventListener("click", function () {
  fetch(`${API_URL}/get_scores.php`)
    .then(res => res.json())
    .then(scores => {
      modalLeaderboardList.innerHTML = "";
      const difficultyLabels = {
        all: "All Levels",
        easy: "Easy",
        average: "Average",
        hard: "Hard"
      };
      const categoryLabels = {
        singleBulb: "Single Bulb",
        rgbBulb: "RGB Bulb"
      };

      Object.keys(difficultyLabels).forEach(diff => {
        const section = document.createElement("li");
        section.style.listStyle = "none";
        section.style.marginBottom = "1.5em";
        section.innerHTML = `<div style="font-weight:bold;color:#4361ee;font-size:1.1em;margin-bottom:0.8em;">
          <i class="fas fa-trophy"></i> ${difficultyLabels[diff]}
        </div>`;
        
        let hasAny = false;
        
        Object.keys(categoryLabels).forEach(cat => {
          const group = scores[diff][cat];
          if (group && group.length) {
            hasAny = true;
            const catTitle = `<div style="font-weight:600;color:#3f8efc;font-size:1em;margin:1em 0 0.5em;">
              ${categoryLabels[cat]}
            </div>`;
            
            const subList = document.createElement("ol");
            subList.style.paddingLeft = "1.2em";
            
            group.forEach((s, i) => {
              let trophy = "";
              if (i === 0) trophy = "🥇 ";
              else if (i === 1) trophy = "🥈 ";
              else if (i === 2) trophy = "🥉 ";
              
              const li = document.createElement("li");
              li.innerHTML = `${trophy}<strong>${s.group_name}</strong> - 
                <span style="color:#4361ee;font-weight:600;">${s.score}</span>`;
              
              // Add rank number
              if (i > 2) {
                li.style.color = "#666";
                li.style.fontSize = "0.95em";
              }
              
              subList.appendChild(li);
            });
            
            section.innerHTML += catTitle;
            section.appendChild(subList);
          }
        });
        
        if (!hasAny) {
          section.innerHTML += `<div style="color:#888;font-size:0.98em;text-align:center;padding:1em;">
            No scores yet for this difficulty level
          </div>`;
        }
        
        modalLeaderboardList.appendChild(section);
      });
      
      highscoreModal.classList.add("active");
    });
});
}

if (closeHighscoreModal) {
  closeHighscoreModal.addEventListener("click", function () {
    highscoreModal.classList.remove("active");
  });
}

// Optional: Close modal when clicking outside content
window.addEventListener("click", function (e) {
  if (e.target === highscoreModal) {
    highscoreModal.classList.remove("active");
  }
});

    // Add reset logic
const resetBtn = document.getElementById("reset-scores-btn");
if (resetBtn) {
  resetBtn.onclick = function() {
    if (confirm("Are you sure you want to reset all group scores?")) {
      fetch(`${API_URL}/reset_scores.php`)
        .then(res => res.text())
        .then(msg => {
          modalLeaderboardList.innerHTML = "<li>No scores yet.</li>";
          // resetBtn.style.display = "none"; // REMOVE or COMMENT THIS LINE
          alert(msg);
          // Also update the leaderboard on the result screen if visible
          const leaderboard = document.getElementById("leaderboard");
          const list = document.getElementById("leaderboard-list");
          if (leaderboard && list) {
            leaderboard.style.display = "none";
            list.innerHTML = "";
          }
        });
    }
  };
}

// Fisher-Yates shuffle function
  function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

  // Only keep your actual quiz questions for Single Bulb and RGB Bulb
  const quizData = {
    singleBulb: [
      // EASY (5 questions)
      //number 1 question
      {
        question: "When you turn on the red bulb in the simulator, what color is projected on the screen?",
        answers: [
          { text: "Blue", correct: false },
          { text: "Red", correct: true },
          { text: "Green", correct: false },
          { text: "White", correct: false },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },
      //number 2 question
      {
        question: " In the simulator, if you place a red filter in front of a red bulb, what do you see?",
        answers: [
          { text: "The light disappears", correct: false },
          { text: "The light appears dim blue", correct: false },
          { text: "Red light passes through clearly", correct: true },
          { text: "Green light appears", correct: false },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },
      //number 3 question
      {
        question: "In the eye model of the simulator, which cells respond when red light enters the eye?",
        answers: [
          { text: "Only green cones", correct: false },
          { text: "Only rod cells", correct: false },
          { text: "Only red cones", correct: true },
          { text: "All cone cells equally", correct: false },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },
      //number 4 question
      {
        question: "When the bulb is turned off in the simulator, what happens to the screen?",
        answers: [
          { text: "It turns white", correct: false },
          { text: "It glows blue", correct: false },
          { text: "It stays lit faintly", correct: false },
          { text: "It becomes completely black", correct: true },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },
      //number 5 question
      {
        question: "What color appears on the screen when you turn on the green bulb with no filter?",
        answers: [
          { text: "Black", correct: false },
          { text: "Green", correct: true },
          { text: "Blue", correct: false },
          { text: "Yellow", correct: false },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },
      //number 6 question
      {
        question: "What color passes through a yellow filter?",
        answers: [
          { text: "Only red", correct: false },
          { text: "Only green", correct: false },
          { text: "Red and green", correct: true },
          { text: "Blue", correct: false },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },
      //number 7 question
      {
        question: "What color of light does a cyan filter allow through?",
        answers: [
          { text: "Red only", correct: false },
          { text: "Blue and green", correct: true },
          { text: "Green only", correct: false },
          { text: "Red and blue", correct: false },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },
      //number 8 question
      {
        question: "What happens when magenta light passes through a green filter?",
        answers: [
          { text: "Red light passes", correct: false },
          { text: "Blue light passes", correct: false },
          { text: "No light passes", correct: true },
          { text: "Magenta light passes", correct: false },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },
      //number 9 question
      {
        question: "If white light goes through a cyan filter, what color is seen?",
        answers: [
          { text: "Blue and green", correct: true },
          { text: "Red only", correct: false },
          { text: "Yellow", correct: false },
          { text: "Black", correct: false },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },
      //number 10 question
      {
        question: "Which filter allows only red and green light to pass?",
        answers: [
          { text: "Cyan", correct: false },
          { text: "Magenta", correct: false },
          { text: "Yellow", correct: true },
          { text: "Blue", correct: false },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },
      //number 11 question
      {
        question: "What color is seen when white light passes through a magenta filter?",
        answers: [
          { text: "Red and green", correct: false },
          { text: "Red and blue", correct: true },
          { text: "Blue and green", correct: false },
          { text: "All colors", correct: false },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },
      //number 12 question
      {
        question: "What happens if a blue bulb shines through a yellow filter",
        answers: [
          { text: "Blue light passes", correct: false },
          { text: "Green light passes", correct: false },
          { text: "Red light passes", correct: false },
          { text: "No light passes", correct: true },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },
      //number 13 question
      {
        question: "Which filter would block green light?",
        answers: [
          { text: "Cyan", correct: false },
          { text: "Yellow", correct: false },
          { text: "Magenta", correct: true },
          { text: "None", correct: false },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },
      //number 14 question
      {
        question: "What color results from white light passing through both a cyan and yellow filter?",
        answers: [
          { text: "Blue", correct: false },
          { text: "Green", correct: true },
          { text: "Red", correct: false },
          { text: "Magenta", correct: false },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },
      //number 15 question
      {
        question: "A red bulb shines through a cyan filter. What is seen?",
        answers: [
          { text: "Red", correct: false },
          { text: "Cyan", correct: false },
          { text: "No light", correct: true },
          { text: "Green", correct: false },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },
      //number 16 question
      {
        question: "Which two filters together will allow only blue light to pass?",
        answers: [
          { text: "Cyan + Yellow", correct: false },
          { text: "Cyan + Magenta", correct: true },
          { text: "Yellow + Magenta", correct: false },
          { text: "Red + Green", correct: false },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },
      //number 17 question
      {
        question: "What light does a cyan filter block?",
        answers: [
          { text: "Green", correct: false },
          { text: "Blue", correct: false },
          { text: "Red", correct: true },
          { text: "Cyan", correct: false },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },
      //number 18 question
      {
        question: "hat light does a yellow filter block?",
        answers: [
          { text: "Red", correct: false },
          { text: "Blue", correct: true },
          { text: "Green", correct: false },
          { text: "Yellow", correct: false },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },
      //number 19 question
      {
        question: "Which filter combination will block all light from a magenta bulb?",
        answers: [
          { text: "Cyan filter", correct: false },
          { text: "Green filter", correct: true },
          { text: "Red filter", correct: false },
          { text: "Blue filter", correct: false },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },
      //number 20 question
      {
        question: "A magenta filter allows which colors to pass?",
        answers: [
          { text: "Red and green", correct: false },
          { text: "Red and blue", correct: true },
          { text: "Green and blue", correct: false },
          { text: "Only red", correct: false },
        ],
        difficulty: "easy",
        category: "Single Bulb"
      },

      // MEDIUM (5 questions)
      //number 1 question
      {
        question: "In the simulator, what do you see when a red bulb shines through a green filter?",
        answers: [
          { text: "Red light passes through", correct: false },
          { text: "Green light appears", correct: false },
          { text: "The screen stays black ", correct: true },
          { text: "Purple light appears", correct: false },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },
      //number 2 question
      {
        question: "What happens in the simulator when a blue filter is placed in front of a green bulb?",
        answers: [
          { text: "Blue light passes through", correct: false },
          { text: "Green light passes through", correct: false },
          { text: "The screen turns yellow", correct: false },
          { text: "No light passes through", correct: true },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },
      //number 3 question
      {
        question: "hen you use a filter, what does it do in the simulator?",
        answers: [
          { text: "Blocks all light", correct: false },
          { text: "Changes the light to white", correct: false },
          { text: "Let’s only one color of light pass ", correct: true },
          { text: "Makes the light brighter", correct: false },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },
      //number 4 question
      {
        question: "If you shine a green bulb through a blue filter, what is observed on the screen?",
        answers: [
          { text: "Green light", correct: false },
          { text: "Blue light", correct: false },
          { text: "the screen remains dark", correct: true },
          { text: "Cyan light", correct: false },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },
      //number 5 question
      {
        question: "What happens when a blue bulb shines on a red object in the simulator?",
        answers: [
          { text: "The object glows red", correct: false },
          { text: "The object looks black", correct: true },
          { text: "The object reflects blue", correct: false },
          { text: "The object turns purple", correct: false },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },
      //number 6 question
      {
        question: "What color light passes through a red filter?",
        answers: [
          { text: "Blue", correct: false },
          { text: "Green", correct: false },
          { text: "Red", correct: true },
          { text: "Yellow", correct: false },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },
      //number 7 question
      {
        question: "Which colors does a yellow filter allow through?",
        answers: [
          { text: "Red and Green", correct: true },
          { text: "Blue and Green", correct: false },
          { text: "Red and Blue", correct: false },
          { text: "Green only", correct: false },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },
      //number 8 question
      {
        question: "What color does a cyan filter transmit?",
        answers: [
          { text: "Red only", correct: false },
          { text: "Blue and Green", correct: true },
          { text: "Green only", correct: false },
          { text: "Red and Blue", correct: false },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },
      //number 9 question
      {
        question: "What color light is blocked by a magenta filter?",
        answers: [
          { text: "Red", correct: false },
          { text: "Blue", correct: false },
          { text: "Green", correct: true },
          { text: "Yellow", correct: false },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },
      //number 10 question
      {
        question: "Which color filter blocks blue light?",
        answers: [
          { text: "Blue", correct: false },
          { text: "Yellow", correct: true },
          { text: "Red", correct: false },
          { text: "Cyan", correct: false },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },
      //number 11 question
      {
        question: "What color light passes through a green filter?",
        answers: [
          { text: "Red", correct: false },
          { text: "Green", correct: true },
          { text: "Blue", correct: false },
          { text: "Yellow", correct: false },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },
      //number 12 question
      {
        question: "What color light passes through a blue filter?",
        answers: [
          { text: "Blue", correct: true },
          { text: "Red", correct: false },
          { text: "Yellow", correct: false },
          { text: "Green", correct: false },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },
      //number 13 question
      {
        question: "If white light passes through a cyan filter, what colors do you see?",
        answers: [
          { text: "Red only", correct: false },
          { text: "Blue and Green", correct: true },
          { text: "Red and Green", correct: false },
          { text: "Blue only", correct: false },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },
      //number 14 question
      {
        question: "What colors does a magenta filter allow through?",
        answers: [
          { text: "Red and Blue", correct: true },
          { text: "Red and Green", correct: false },
          { text: "Blue and Green", correct: false },
          { text: "All colors", correct: false },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },
      //number 15 question
      {
        question: "What color light does a yellow filter block?",
        answers: [
          { text: "Red", correct: false },
          { text: "Green", correct: false },
          { text: "Blue", correct: true },
          { text: "Yellow", correct: false },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },
      //number 16 question
      {
        question: "Which filter would block red light?",
        answers: [
          { text: "Red", correct: false },
          { text: "Blue", correct: true },
          { text: "Green", correct: false },
          { text: "Yellow", correct: false },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },
      //number 17 question
      {
        question: "If a blue light shines through a red filter, what color do you see?",
        answers: [
          { text: "Blue", correct: false },
          { text: "Red", correct: false },
          { text: "No light", correct: true },
          { text: "Purple", correct: false },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },
      //number 18 question
      {
        question: "What happens when white light passes through a green filter?",
        answers: [
          { text: "Only green light passes through", correct: true },
          { text: "Only red light passes through", correct: false },
          { text: "No light passes through", correct: false },
          { text: "All light passes through", correct: false },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },
      //number 19 question
      {
        question: "What color is seen when a red bulb shines through a green filter?",
        answers: [
          { text: "Red", correct: false },
          { text: "Green", correct: false },
          { text: "Yellow", correct: false },
          { text: "No light", correct: true },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },
      //number 20 question
      {
        question: "Why do filters only allow certain colors through?",
        answers: [
          { text: "Because of light reflection", correct: false },
          { text: "Because they absorb other colors", correct: true },
          { text: "Because they make light brighter", correct: false },
          { text: "Because they change light color randomly", correct: false },
        ],
        difficulty: "average",
        category: "Single Bulb"
      },

      // HARD (5 questions)
      //number 1 question
      {
        question: "When red light passes through a cyan filter in the simulator, what happens?",
        answers: [
          { text: "The light turns purple", correct: false },
          { text: "Red light is visible", correct: false },
          { text: "No light reaches the screen", correct: true },
          { text: "The light turns green", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      },
      //number 2 question
      {
        question: "In the simulator, which filter blocks red light from a red bulb?",
        answers: [
          { text: "Red filter", correct: false },
          { text: "Green filter", correct: true },
          { text: "Cyan filter", correct: false },
          { text: "No filter can block it", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      },
      //number 3 question
      {
        question: " If a person has red-green colorblindness (as shown in the simulator), how would they perceive the red bulb light?",
        answers: [
          { text: "As clearly red", correct: false },
          { text: "As gray or faded", correct: true },
          { text: "As green", correct: false },
          { text: "As yellow", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      },
      //number 4 question
      {
        question: "When a green bulb shines through a red filter in the simulator, what do you observe?",
        answers: [
          { text: "Green light shines through", correct: false },
          { text: "Red light appears", correct: false },
          { text: "No light passes through", correct: true },
          { text: "The light becomes yellow", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      },
      //number 5 question
      {
        question: "In the simulator, why doesn't a blue filter allow red light from the red bulb to pass?",
        answers: [
          { text: "Because red light is absorbed by the blue filter ", correct: true },
          { text: "Because red light is reflected", correct: false },
          { text: "Because red and blue mix", correct: false },
          { text: "Because the bulb is too dim", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      },
      //number 6 question
      {
        question: "When white light passes through a cyan filter followed by a magenta filter, what color emerges?",
        answers: [
          { text: "Blue", correct: true },
          { text: "Green", correct: false },
          { text: "Red", correct: false },
          { text: "Yellow", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      },
      //number 7 question
      {
        question: "A yellow filter allows red and green light to pass. If you shine a green light through a yellow filter, what happens?",
        answers: [
          { text: "Light passes unchanged", correct: true },
          { text: "No light passes", correct: false },
          { text: "Light becomes yellow", correct: false },
          { text: "Light becomes red", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      },
      //number 8 question
      {
        question: "hat is the result of combining a red bulb with a cyan filter?",
        answers: [
          { text: "Red light", correct: false },
          { text: "Cyan light", correct: false },
          { text: "No light passes", correct: true },
          { text: "Magenta light", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      },
      //number 9 question
      {
        question: "Which filter combination will allow only green light to pass through white light?",
        answers: [
          { text: "Yellow and cyan filters", correct: true },
          { text: "Magenta and cyan filters", correct: false },
          { text: "Yellow and magenta filters", correct: false },
          { text: "Red and blue filters", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      },
      //number 10 question
      {
        question: "Why does a magenta filter block green light?",
        answers: [
          { text: "Because green is complementary to magenta and absorbed", correct: true },
          { text: "Because magenta is a mix of green and blue", correct: false },
          { text: "Because green light has a shorter wavelength than magenta", correct: false },
          { text: "Because filters reflect green light only", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      },
      //number 11 question
      {
        question: "When white light passes through a red filter and then through a green filter, what color do you observe?",
        answers: [
          { text: "Yellow", correct: false },
          { text: "White", correct: false },
          { text: "Black (no light)", correct: true },
          { text: "Magenta", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      },
      //number 12 question
      {
        question: "Which of the following filters would transmit blue and green light but block red light?",
        answers: [
          { text: "Yellow filter", correct: false },
          { text: "Cyan filter", correct: true },
          { text: "Magenta filter", correct: false },
          { text: "Red filter", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      },
      //number 13 question
      {
        question: "What would happen if you pass blue light through a yellow filter?",
        answers: [
          { text: "It will pass as blue", correct: false },
          { text: "It will pass as yellow", correct: false },
          { text: "It will be blocked completely", correct: true },
          { text: "It will pass as green", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      },
      //number 14 question
      {
        question: "A white bulb shines through a magenta filter, then a cyan filter. What color will you see?",
        answers: [
          { text: "Blue", correct: true },
          { text: "Red", correct: false },
          { text: "Green", correct: false },
          { text: "Black (no light)", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      },
      //number 15 question
      {
        question: "Which statement correctly explains why filters appear colored?",
        answers: [
          { text: "They emit their own light in specific colors", correct: false },
          { text: "They absorb certain wavelengths and transmit others", correct: true },
          { text: "They reflect all colors except the one shown", correct: false },
          { text: "They scatter light to create color", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      },
      //number 16 question
      {
        question: "If a red bulb shines through a cyan filter, why does no light come through?",
        answers: [
          { text: "Because cyan filters block red light", correct: true },
          { text: "Because red and cyan are the same colors", correct: false },
          { text: "Because red light is absorbed and blue light passes", correct: false },
          { text: "Because red light has a longer wavelength than cyan", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      },
      //number 17 question
      {
        question: "Which of these color combinations from light produce white light?",
        answers: [
          { text: "Red and green", correct: false },
          { text: "Green and blue", correct: false },
          { text: "Red, green, and blue", correct: true },
          { text: "Cyan and magenta", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      },
      //number 18 question
      {
        question: "What color does a yellow filter block in the visible spectrum?",
        answers: [
          { text: "Red", correct: false },
          { text: "Green", correct: false },
          { text: "Blue", correct: true },
          { text: "Yellow", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      },
      //number 19 question
      {
        question: "Why does combining a red filter with a green filter block all light?",
        answers: [
          { text: "They both absorb each other’s colors", correct: true },
          { text: "Red and green light cancel each other", correct: false },
          { text: "Filters do not block light", correct: false },
          { text: "The filters mix to create black pigment", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      },
      //number 20 question
      {
        question: "How does the wavelength of light relate to the color passed through a filter?",
        answers: [
          { text: "Filters only pass light of longer wavelengths", correct: false },
          { text: "Filters only pass light with wavelengths matching their color", correct: true },
          { text: "Filters change the wavelength of the light passing through", correct: false },
          { text: "Wavelength does not affect color transmission", correct: false },
        ],
        difficulty: "hard",
        category: "Single Bulb"
      }
    ],

    // RGB Bulb questions
    rgbBulb: [
      // EASY (5 questions)
      //number 1 question
      {
        question: "What color shows when you turn on red and green lights?",
        answers: [
          { text: "Blue", correct: false },
          { text: "Yellow", correct: true },
          { text: "Purple", correct: false },
          { text: "Black", correct: false },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },
      //number 2 question
      {
        question: "You turn on red, green, and blue lights. What color do you get?",
        answers: [
          { text: "White", correct: true },
          { text: "Red", correct: false },
          { text: "Black", correct: false },
          { text: "Orange", correct: false },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },
      //number 3 question
      {
        question: "What color do you see when only the green light is on?",
        answers: [
          { text: "Green", correct: true },
          { text: "Blue", correct: false },
          { text: "Yellow", correct: false },
          { text: "Red", correct: false },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },
      //number 4 question
      {
        question: "If no lights are on, what color is the screen?",
        answers: [
          { text: "Red", correct: false },
          { text: "White", correct: false },
          { text: "Black", correct: true },
          { text: "Blue", correct: false },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },
      //number 5 question
      {
        question: "You turn on red and blue lights. What color appears?",
        answers: [
          { text: "Yellow", correct: false },
          { text: "Magenta", correct: true },
          { text: "Cyan", correct: false },
          { text: "Green", correct: false },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },
      //number 6 question
      {
        question: "What happens when you turn on the red bulb only?",
        answers: [
          { text: "You see green", correct: false },
          { text: "You see red", correct: true },
          { text: "You see blue", correct: false },
          { text: "You see black", correct: false },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },
      //number 7 question
      {
        question: "What color do you see if red and green bulbs are on?",
        answers: [
          { text: "Yellow", correct: true },
          { text: "Orange", correct: false },
          { text: "Purple", correct: false },
          { text: "Green", correct: false },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },
      //number 8 question
      {
        question: "What color do you see if red and blue bulbs are on?",
        answers: [
          { text: "Green", correct: false },
          { text: "Purple", correct: true },
          { text: "Cyan", correct: false },
          { text: "Yellow", correct: false },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },
      //number 9 question
      {
        question: "What color do you see if green and blue bulbs are on?",
        answers: [
          { text: "Orange", correct: false },
          { text: "White", correct: false },
          { text: "Cyan", correct: true },
          { text: "Red", correct: false },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },
      //number 10 question
      {
        question: "What happens if all three bulbs (red, green, blue) are at 100%?",
        answers: [
          { text: "You see yellow", correct: false },
          { text: "You see white", correct: true },
          { text: "You see black", correct: false },
          { text: "You see green", correct: false },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },
      //number 11 question
      {
        question: "What do you see if all bulbs are turned off?",
        answers: [
          { text: "White", correct: false },
          { text: "Gray", correct: false },
          { text: "Black", correct: true },
          { text: "Red", correct: false },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },
      //number 12 question
      {
        question: "You turn on only the blue bulb. What color do you see?",
        answers: [
          { text: "Blue", correct: true },
          { text: "Green", correct: false },
          { text: "Yellow", correct: false },
          { text: "Pink", correct: false },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },
      //number 13 question
      {
        question: "You turn on red = 100% and green = 100%, but blue = 0%. What color is seen?",
        answers: [
          { text: "Yellow", correct: true },
          { text: "White", correct: false },
          { text: "Cyan", correct: false },
          { text: "Blue", correct: false },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },
      //number 14 question
      {
        question: "If you want to see purple, which bulbs should you turn on?",
        answers: [
          { text: "Green and Blue", correct: false },
          { text: "Red and Blue", correct: true },
          { text: "Red and Green", correct: false },
          { text: "All three", correct: false },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },
      //number 15 question
      {
        question: "Which light color helps you see cyan?",
        answers: [
          { text: "Red only", correct: false },
          { text: "Red and Green", correct: false },
          { text: "Green and Blue", correct: true },
          { text: "Blue and Red", correct: false },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },
      //number 16 question
      {
        question: "What color is made with equal red and green, but no blue?",
        answers: [
          { text: "Purple", correct: false },
          { text: "White", correct: false },
          { text: "Yellow", correct: true },
          { text: "Cyan", correct: false },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },
      //number 17 question
      {
        question: "If you want white light, what should you do?",
        answers: [
          { text: "Use blue only", correct: false },
          { text: "Use red and blue", correct: false },
          { text: "Use green only", correct: false },
          { text: "Use red, green, and blue", correct: true },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },
      //number 18 question
      {
        question: "Which two colors make magenta?",
        answers: [
          { text: "Red + Green", correct: false },
          { text: "Red + Blue", correct: true },
          { text: "Green + Blue", correct: false },
          { text: "Blue + White", correct: false },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },
      //number 19 question
      {
        question: ". Which light is not needed to make yellow?",
        answers: [
          { text: "Red", correct: false },
          { text: "Green", correct: false },
          { text: "Blue", correct: true },
          { text: "All are needed", correct: false },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },
      //number 20 question
      {
        question: "Why does the brain \"see\" white when all RGB lights are on?",
        answers: [
          { text: "The eyes mix the lights", correct: false },
          { text: "The brain ignores the light", correct: false },
          { text: "The colors cancel each other", correct: false },
          { text: "The brain adds the lights", correct: true },
        ],
        difficulty: "easy",
        category: "RGB Bulb"
      },

      // Average (5 questions)
      //number 1 question
      {
        question: "You turn on red and green. The screen is yellow. You want it to look white. What should you do?",
        answers: [
          { text: "Turn off all lights", correct: false },
          { text: "Add blue light", correct: true },
          { text: " Add more red", correct: false },
          { text: "Remove green", correct: false },
        ],
        difficulty: "average",
        category: "RGB Bulb"
      },
      //number 2 question
      {
        question: "You want to make cyan. Which two lights do you need?",
        answers: [
          { text: "Green and blue", correct: true },
          { text: "Red and green", correct: false },
          { text: "Red and blue", correct: false },
          { text: "Blue and yellow", correct: false },
        ],
        difficulty: "average",
        category: "RGB Bulb"
      },
      //number 3 question
      {
        question: "You make white light. How can you make it dimmer but keep the color?",
        answers: [
          { text: "Turn off green", correct: false },
          { text: "Make all lights less bright", correct: true },
          { text: "Use only red", correct: false },
          { text: "Add a filter", correct: false },
        ],
        difficulty: "average",
        category: "RGB Bulb"
      },
      //number 4 question
      {
        question: "You make magenta (red + blue). It looks too red. What can you do?",
        answers: [
          { text: "Turn off red", correct: false },
          { text: "Add more green", correct: false },
          { text: "Add more blue", correct: true },
          { text: "Turn off all lights", correct: false },
        ],
        difficulty: "average",
        category: "RGB Bulb"
      },
      //number 5 question
      {
        question: "You want the screen to be purple. Which lights do you turn on?",
        answers: [
          { text: "Blue and red", correct: true },
          { text: "Green and blue", correct: false },
          { text: "Red and green", correct: false },
          { text: "Green only", correct: false },
        ],
        difficulty: "average",
        category: "RGB Bulb"
      },
      //number 6 question
      {
        question: "If the red bulb is 100% and the others are 0%, what color will the person see?",
        answers: [
          { text: "White", correct: false },
          { text: "Red", correct: true },
          { text: "Green", correct: false },
          { text: "Yellow", correct: false },
        ],
        difficulty: "average",
        category: "RGB Bulb"
      },
      //number 7 question
      {
        question: "You turn on red = 100% and blue = 100%, green = 0%. What color do you see?",
        answers: [
          { text: "Magenta", correct: true },
          { text: "White", correct: false },
          { text: "Blue", correct: false },
          { text: "Yellow", correct: false },
        ],
        difficulty: "average",
        category: "RGB Bulb"
      },
      //number 8 question
      {
        question: "To make cyan, which two bulbs should be ON?",
        answers: [
          { text: "Red and Green", correct: false },
          { text: "Green and Blue", correct: true },
          { text: "Red and Blue", correct: false },
          { text: "Red and Cyan", correct: false },
        ],
        difficulty: "average",
        category: "RGB Bulb"
      },
      //number 9 question
      {
        question: "You want to see yellow. Which bulbs should be turned on?",
        answers: [
          { text: "Red and Blue", correct: false },
          { text: "Green and Blue", correct: false },
          { text: "Red and Green", correct: true },
          { text: "All three", correct: false },
        ],
        difficulty: "average",
        category: "RGB Bulb"
      },
      //number 10 question
      {
        question: "What do you see if all bulbs (R, G, B) are OFF?",
        answers: [
          { text: "White", correct: false },
          { text: "Gray", correct: false },
          { text: "Black", correct: true },
          { text: "Cyan", correct: false },
        ],
        difficulty: "average",
        category: "RGB Bulb"
      },
      //number 12 question
      {
        question: "What color will you see if only the green bulb is ON?",
        answers: [
          { text: "Yellow", correct: false },
          { text: "Blue", correct: false },
          { text: "Green", correct: true },
          { text: "White", correct: false },
        ],
        difficulty: "average",
        category: "RGB Bulb"
      },
      //number 13 question
      {
        question: "You want to see white light. What should you do?",
        answers: [
          { text: "Turn on only blue", correct: false },
          { text: "Turn on red and green", correct: false },
          { text: "Turn on red, green, and blue", correct: true },
          { text: "Turn off all bulbs", correct: false },
        ],
        difficulty: "average",
        category: "RGB Bulb"
      },
      //number 14 question
      {
        question: "What happens if you turn on red = 100%, green = 0%, blue = 100%?",
        answers: [
          { text: "White", correct: true },
          { text: "Cyan", correct: false },
          { text: "Magenta", correct: true },
          { text: "Green", correct: false },
        ],
        difficulty: "average",
        category: "RGB Bulb"
      },
      //number 15 question
      {
        question: "What color do you get if red = 100%, green = 100%, blue = 100%?",
        answers: [
          { text: "White", correct: true },
          { text: "Yellow", correct: false },
          { text: "Cyan", correct: false },
          { text: "Black", correct: false },
        ],
        difficulty: "average",
        category: "RGB Bulb"
      },
      //number 16 question
      {
        question: "Which bulb is not needed to make cyan?",
        answers: [
          { text: "Blue", correct: false },
          { text: "Green", correct: false },
          { text: "Red", correct: true },
          { text: "None", correct: false },
        ],
        difficulty: "average",
        category: "RGB Bulb"
      },
      //number 17 question
      {
        question: "You turn on only the red and green bulbs. What color is seen?",
        answers: [
          { text: "Blue", correct: false },
          { text: "Yellow", correct: true },
          { text: "White", correct: false },
          { text: "Red", correct: false },
        ],
        difficulty: "average",
        category: "RGB Bulb"
      },
      //number 18 question
      {
        question: "You turn on red = 100%, green = 0%, blue = 0%. What color is shown?",
        answers: [
          { text: "Black", correct: false },
          { text: "Blue", correct: false },
          { text: "Red", correct: true },
          { text: "Green", correct: false },
        ],
        difficulty: "average",
        category: "RGB Bulb"
      },
      //number 19 question
      {
        question: "Which two bulbs give purple or magenta?",
        answers: [
          { text: "Red + Blue", correct: true },
          { text: "Green + Blue", correct: false },
          { text: "Red + Gree", correct: false },
          { text: "Blue + Cyan", correct: false },
        ],
        difficulty: "average",
        category: "RGB Bulb"
      },
      //number 20 question
      {
        question: "Why do we see white when all bulbs are ON?",
        answers: [
          { text: "White light is reflected", correct: false },
          { text: "The brain mixes all the colors", correct: true },
          { text: "Only green is seen", correct: false },
          { text: "The eyes ignore the light", correct: false },
        ],
        difficulty: "average",
        category: "RGB Bulb"
      },

      // HARD (5 questions)
      //number 1 question
      {
        question: "You turn on red = 100%, green = 100%, and blue = 50%. What does the screen look like?",
        answers: [
          { text: "Blue", correct: false },
          { text: "Warm white", correct: true },
          { text: "Green", correct: false },
          { text: "Yellow", correct: false },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
      //number 2 question
      {
        question: "You turn on red = 0%, green = 100%, blue = 100%. What color do you see?",
        answers: [
          { text: "Yellow", correct: false },
          { text: "White", correct: false },
          { text: "Cyan", correct: true },
          { text: "Pink", correct: false },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
      //number 3 question
      {
        question: "You want a cooler (bluish) white light. What do you change?",
        answers: [
          { text: "Add more red", correct: false },
          { text: "Add more blue ", correct: true },
          { text: "Remove green", correct: false },
          { text: "Turn off all lights", correct: false },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
      //number 4 question
      {
        question: "You mix red and green. You place a blue filter in front. What do you see?",
        answers: [
          { text: "Blue", correct: false },
          { text: "Red", correct: false },
          { text: "Green", correct: false },
          { text: "Black ", correct: true },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
      //number 5 question
      {
        question: "You use red, green, and blue to make white. Then you turn off green. What color do you see now?",
        answers: [
          { text: "Cyan", correct: false },
          { text: "Blue", correct: false },
          { text: "Magenta", correct: true },
          { text: "White", correct: false },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
      //number 6 question
      {
        question: "Red and green are ON. Blue is OFF. The color looks yellow. Why?",
        answers: [
          { text: "The brain deletes the blue", correct: false },
          { text: "The brain adds red and green", correct: true },
          { text: "The light becomes hotter", correct: false },
          { text: "Only the red light is strong", correct: false },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
      //number 7 question
      {
        question: "You turn on red = 100%, green = 50%, blue = 0%. What color do you most likely see?",
        answers: [
          { text: "Yellow", correct: false },
          { text: "Orange", correct: true },
          { text: "Magenta", correct: false },
          { text: "Brown", correct: false },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
      //number 8 question
      {
        question: "Which RGB settings can also make white (besides 100% for all)?",
        answers: [
          { text: "Red 50%, Green 50%, Blue 50%", correct: true },
          { text: "Red 100%, Green 0%, Blue 100%", correct: false },
          { text: "Red 0%, Green 0%, Blue 100%", correct: false },
          { text: "Red 100%, Green 100%, Blue 0%", correct: false },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
      //number 9 question
      {
        question: "If only the blue bulb is ON, why does the eye see blue?",
        answers: [
          { text: "The eye blocks other lights", correct: false },
          { text: "Blue light hits the blue cone cells in the eye", correct: true },
          { text: "The brain sees everything blue", correct: false },
          { text: "Red and green cones turn off", correct: false },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
      //number 10 question
      {
        question: "You see magenta on the screen. Which color is not being used?",
        answers: [
          { text: "Red", correct: false },
          { text: "Blue", correct: false },
          { text: "Green", correct: true },
          { text: "All are used", correct: false },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
      //number 11 question
      {
        question: "Which setting gives the darkest yellow?",
        answers: [
          { text: "Red 50%, Green 50%, Blue 0%", correct: true },
          { text: "Red 100%, Green 100%, Blue 0%", correct: false },
          { text: "Red 100%, Green 0%, Blue 0%", correct: false },
          { text: "Red 25%, Green 25%, Blue 25%", correct: false },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
      //number 12 question
      {
        question: "Red = 0%, Green = 100%, Blue = 100% — what color and why?",
        answers: [
          { text: "Cyan, because green + blue = cyan", correct: true },
          { text: "White, because all are ON", correct: false },
          { text: "Purple, because of mixing", correct: false },
          { text: "Black, because red is OFF", correct: false },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
      //number 13 question
      {
        question: "The brain makes color from light. This is called:",
        answers: [
          { text: "Subtraction", correct: false },
          { text: "Reflection", correct: false },
          { text: "Additive mixing", correct: true },
          { text: "White", correct: false },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
      //number 14 question
      {
        question: " You want a lighter magenta. What should you do?",
        answers: [
          { text: "Turn off the green bulb", correct: false },
          { text: "Add green bulb", correct: false },
          { text: "Lower red and blue", correct: true },
          { text: "Turn off all bulbs", correct: false },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
      //number 15 question
      {
        question: "Which mix gives the purest white?",
        answers: [
          { text: "R 100%, G 100%, B 100%", correct: true },
          { text: "R 75%, G 100%, B 25%", correct: false },
          { text: "R 50%, G 50%, B 100%", correct: false },
          { text: "R 100%, G 0%, B 100%", correct: false },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
      //number 16 question
      {
        question: "Why do we not see colors if all bulbs are off?",
        answers: [
          { text: "No light goes into the eyes", correct: true },
          { text: "The eyes are closed", correct: false },
          { text: "Only blue is missing", correct: false },
          { text: "White light is too weak", correct: false },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
      //number 17 question  
      {
        question: "YWhat is the main job of RGB bulbs in the PhET sim?",
        answers: [
          { text: "Show shadows", correct: false },
          { text: "Teach light colors mix to make new colors", correct: true },
          { text: "Make art", correct: false },
          { text: "Only show red", correct: false },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
      //number 18 question
      {
        question: "If a person sees yellow but the blue light is added, what happens?",
        answers: [
          { text: "Color turns green", correct: false },
          { text: "Color turns white", correct: true },
          { text: "olor turns red", correct: false },
          { text: "Color turns blue", correct: false },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
      //number 19 question
      {
        question: "Red = 100%, Green = 100%, Blue = 25%. What is the color seen?",
        answers: [
          { text: "White", correct: false },
          { text: "Yellowish-white", correct: true },
          { text: "Purple", correct: false },
          { text: "Cyan", correct: false },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
      //number 20 question
      {
        question: " Which setting will give a color close to pink?",
        answers: [
          { text: "Red 100%, Green 50%, Blue 50%", correct: false },
          { text: "Red 100%, Green 0%, Blue 100%", correct: false },
          { text: "Red 100%, Green 0%, Blue 50%", correct: true },
          { text: "Red 0%, Green 0%, Blue 100%", correct: false },
        ],
        difficulty: "hard",
        category: "RGB Bulb"
      },
    ]
  };

  // Combine all questions into a single array for now
  let quizQuestions = [
    ...quizData.singleBulb,
    ...quizData.rgbBulb
  ];

  // Analytics object
  let analytics = {
    categoryPerformance: {},
    difficultyPerformance: {},
    timePerQuestion: [],
    averageTimePerQuestion: 0,
    totalTimeTaken: 0,
    questionsAnswered: 0,
    correctByCategory: {},
    totalByCategory: {},
    correctByDifficulty: {},
    totalByDifficulty: {},
  };

  // QUIZ STATE VARS
  let currentQuestionIndex = 0;
  let score = 0;
  let answersDisabled = false;
  let timerInterval;
  let timeLeft = 15;
  let questionStartTime = 0;

  // Set initial values safely
  if (totalQuestionsSpan) totalQuestionsSpan.textContent = quizQuestions.length;
  const maxScoreSpan = document.getElementById("max-score");
  if (maxScoreSpan) maxScoreSpan.textContent = quizQuestions.length;

  // Track selected category and difficulty
  let selectedCategory = "singleBulb";
  let selectedDifficulty = "all";

  // Listen for category radio changes
  document.querySelectorAll('input[name="category"]').forEach(radio => {
    radio.addEventListener("change", function (e) {
      selectedCategory = e.target.value;
    });
  });

  // Listen for difficulty radio changes
  document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
    radio.addEventListener("change", function (e) {
      selectedDifficulty = e.target.value;
    });
  });

  function getQuestionsByCategoryAndDifficulty(category, difficulty) {
  let questions = quizData[category] || [];
  if (difficulty === "all") {
    // Pick 5 random from each level
    let allQuestions = [];
    ["easy", "average", "hard"].forEach(level => {
      let filtered = questions.filter(q => q.difficulty === level);
      shuffleArray(filtered);
      allQuestions = allQuestions.concat(filtered.slice(0, 5));
    });
    shuffleArray(allQuestions); // Optional: shuffle the combined 15
    return allQuestions;
  }
  // For specific level, pick 5 random
  let filtered = questions.filter(q => q.difficulty === difficulty);
  shuffleArray(filtered);
  return filtered.slice(0, 5);
}

  function startQuiz() {
  analytics = {
    categoryPerformance: {},
    difficultyPerformance: {},
    timePerQuestion: [],
    averageTimePerQuestion: 0,
    totalTimeTaken: 0,
    questionsAnswered: 0,
    correctByCategory: {},
    totalByCategory: {},
    correctByDifficulty: {},
    totalByDifficulty: {},
  };

  currentQuestionIndex = 0;
  score = 0;
  if (scoreSpan) scoreSpan.textContent = 0;

    // Use the new filter
    quizQuestions = getQuestionsByCategoryAndDifficulty(selectedCategory, selectedDifficulty);
    shuffleArray(quizQuestions); // <-- ADD THIS LINE

    if (totalQuestionsSpan) totalQuestionsSpan.textContent = quizQuestions.length;
  const maxScoreSpan = document.getElementById("max-score");
  if (maxScoreSpan) maxScoreSpan.textContent = quizQuestions.length * 5;

  startScreen.classList.remove("active");
  setTimeout(() => {
    quizScreen.classList.add("active");
    showQuestion();
  }, 300);
}

  function showQuestion() {
    answersDisabled = false;
    resetTimer();

    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (currentQuestionSpan) currentQuestionSpan.textContent = currentQuestionIndex + 1;
    const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
    if (progressBar) progressBar.style.width = progressPercent + "%";
    if (questionText) questionText.textContent = currentQuestion.question;

    // Update category badge
    const categoryBadge = document.getElementById("current-category");
    if (categoryBadge) {
      categoryBadge.textContent = currentQuestion.category || "";
    }

    if (answersContainer) answersContainer.innerHTML = "";

    currentQuestion.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.textContent = answer.text;
      button.classList.add("answer-btn");
      button.dataset.correct = answer.correct;
      button.dataset.index = index;

      // Add letter indicators (A, B, C, D)
      const letterIndicator = document.createElement("span");
      letterIndicator.textContent = String.fromCharCode(65 + index) + ": ";
      letterIndicator.style.marginRight = "8px";
      letterIndicator.style.opacity = "0.7";
      button.prepend(letterIndicator);

      button.addEventListener("click", selectAnswer);

      button.style.opacity = "0";
      button.style.transform = "translateY(20px)";
      answersContainer.appendChild(button);

      setTimeout(() => {
        button.style.transition = "all 0.3s ease";
        button.style.opacity = "1";
        button.style.transform = "translateY(0)";
      }, 100 * index);
    });

    questionStartTime = Date.now();

    const category = currentQuestion.category || "";
    const difficulty = currentQuestion.difficulty || "easy";

    if (!analytics.totalByCategory[category]) {
      analytics.totalByCategory[category] = 0;
      analytics.correctByCategory[category] = 0;
    }
    if (!analytics.totalByDifficulty[difficulty]) {
      analytics.totalByDifficulty[difficulty] = 0;
      analytics.correctByDifficulty[difficulty] = 0;
    }
    analytics.totalByCategory[category]++;
    analytics.totalByDifficulty[difficulty]++;

    startTimer();
  }

  function startTimer() {
    timeLeft = 15;
    if (timerElement) timerElement.textContent = timeLeft;
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timerElement) timerElement.textContent = timeLeft;
      if (timeLeft <= 5 && timerElement) {
        timerElement.style.color = "#f72585";
      } else if (timerElement) {
        timerElement.style.color = "";
      }
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timeOut();
      }
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timerInterval);
    if (timerElement) timerElement.style.color = "";
  }

  function timeOut() {
    answersDisabled = true;
    Array.from(answersContainer.children).forEach((button) => {
      if (button.dataset.correct === "true") {
        button.classList.add("correct");
      }
    });
    setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex < quizQuestions.length) {
        showQuestion();
      } else {
        showResults();
      }
    }, 1500);
  }

  function selectAnswer(event) {
    if (answersDisabled) return;
    answersDisabled = true;
    resetTimer();

    const selectedButton = event.target.closest(".answer-btn");
    const isCorrect = selectedButton.dataset.correct === "true";

    answersContainer.querySelectorAll(".answer-btn").forEach((button) => {
      if (button.dataset.correct === "true") {
        button.classList.add("correct");
      } else if (button === selectedButton) {
        button.classList.add("incorrect");
      }
      button.style.pointerEvents = "none";
    });

    const timeSpent = (Date.now() - questionStartTime) / 1000;
    analytics.timePerQuestion.push(timeSpent);
    analytics.totalTimeTaken += timeSpent;
    analytics.questionsAnswered++;

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const category = currentQuestion.category || "";
    const difficulty = currentQuestion.difficulty || "easy";

    if (isCorrect) {
      score += 5;
      if (scoreSpan) scoreSpan.textContent = score;
      analytics.correctByCategory[category]++;
      analytics.correctByDifficulty[difficulty]++;
      createConfetti(selectedButton);
    } else {
      score -= 5;
      if (score < 0) score = 0;
      if (scoreSpan) scoreSpan.textContent = score;
    }

    setTimeout(() => {
      currentQuestionIndex++;
      const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
      if (progressBar) progressBar.style.width = progressPercent + "%";
      if (currentQuestionIndex < quizQuestions.length) {
        showQuestion();
      } else {
        showResults();
      }
    }, 1500);
  }

  function createConfetti(button) {
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement("div");
      const size = Math.random() * 8 + 4;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.backgroundColor = getRandomColor();
      confetti.style.position = "absolute";
      confetti.style.borderRadius = "50%";
      confetti.style.zIndex = "1000";
      const rect = button.getBoundingClientRect();
      const containerRect = quizScreen.getBoundingClientRect();
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;
      confetti.style.left = `${x}px`;
      confetti.style.top = `${y}px`;
      quizScreen.appendChild(confetti);
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 5 + 3;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      animate(confetti, vx, vy, 0, 0.1, 1);
    }
  }

  function animate(confetti, vx, vy, rotation, gravity, opacity) {
    let x = parseInt(confetti.style.left);
    let y = parseInt(confetti.style.top);
    x += vx;
    y += vy;
    vy += gravity;
    opacity -= 0.02;
    rotation += 5;
    confetti.style.left = `${x}px`;
    confetti.style.top = `${y}px`;
    confetti.style.opacity = opacity;
    confetti.style.transform = `rotate(${rotation}deg)`;
    if (opacity > 0) {
      requestAnimationFrame(() =>
        animate(confetti, vx, vy, rotation, gravity, opacity)
      );
    } else {
      confetti.remove();
    }
  }

  function getRandomColor() {
    const colors = [
      "#4361ee",
      "#3f8efc",
      "#4cc9f0",
      "#f72585",
      "#7209b7",
      "#3a0ca3",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function showResults() {
    resetTimer();
    if (analytics.questionsAnswered > 0) {
      analytics.averageTimePerQuestion =
        analytics.totalTimeTaken / analytics.questionsAnswered;
    }
    Object.keys(analytics.totalByCategory).forEach((category) => {
      analytics.categoryPerformance[category] =
        (analytics.correctByCategory[category] /
          analytics.totalByCategory[category]) *
        100;
    });
    Object.keys(analytics.totalByDifficulty).forEach((difficulty) => {
      analytics.difficultyPerformance[difficulty] =
        (analytics.correctByDifficulty[difficulty] /
          analytics.totalByDifficulty[difficulty]) *
        100;
    });
    quizScreen.classList.remove("active");
    setTimeout(() => {
      resultScreen.classList.add("active");
      if (finalScoreSpan) finalScoreSpan.textContent = score;
      displayAnalytics();
      const percentage = (score / quizQuestions.length) * 100;
      if (resultMessage) {
        if (percentage === 100) {
          resultMessage.textContent = "Outstanding! You're a true expert!";
        } else if (percentage >= 80) {
          resultMessage.textContent = "Great job! Excellent knowledge!";
        } else if (percentage >= 60) {
          resultMessage.textContent = "Good effort! Keep improving!";
        } else if (percentage >= 40) {
          resultMessage.textContent = "Not bad! More practice will help!";
        } else {
          resultMessage.textContent = "Keep learning! You'll get better!";
        }
      }
    }, 300);
  }

  function displayAnalytics() {
    const categoryAnalyticsEl = document.getElementById("category-analytics");
    const difficultyAnalyticsEl = document.getElementById("difficulty-analytics");
    const timeAnalyticsEl = document.getElementById("time-analytics");
    if (categoryAnalyticsEl) {
      let categoryHTML = "";
      Object.keys(analytics.categoryPerformance).forEach((category) => {
        const percent = Math.round(analytics.categoryPerformance[category]);
        const correct = analytics.correctByCategory[category];
        const total = analytics.totalByCategory[category];
        categoryHTML += `
          <div class="analytics-item">
            <div class="analytics-label">${category}</div>
            <div class="analytics-bar-container">
              <div class="analytics-bar" style="width: ${percent}%"></div>
              <div class="analytics-value">${correct}/${total} (${percent}%)</div>
            </div>
          </div>
        `;
      });
      categoryAnalyticsEl.innerHTML =
        categoryHTML || "No category data available";
    }
    if (difficultyAnalyticsEl) {
      let difficultyHTML = "";
      Object.keys(analytics.difficultyPerformance).forEach((difficulty) => {
        const percent = Math.round(analytics.difficultyPerformance[difficulty]);
        const correct = analytics.correctByDifficulty[difficulty];
        const total = analytics.totalByDifficulty[difficulty];
        difficultyHTML += `
          <div class="analytics-item">
            <div class="analytics-label">${
              difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
            }</div>
            <div class="analytics-bar-container">
              <div class="analytics-bar" style="width: ${percent}%"></div>
              <div class="analytics-value">${correct}/${total} (${percent}%)</div>
            </div>
          </div>
        `;
      });
      difficultyAnalyticsEl.innerHTML =
        difficultyHTML || "No difficulty data available";
    }
    if (timeAnalyticsEl) {
      const avgTime = analytics.averageTimePerQuestion.toFixed(1);
      const fastestTime = Math.min(...analytics.timePerQuestion).toFixed(1);
      const slowestTime = Math.max(...analytics.timePerQuestion).toFixed(1);
      timeAnalyticsEl.innerHTML = `
        <div class="analytics-card">
          <div class="analytics-title">Time Performance</div>
          <div class="time-stats">
            <div class="time-stat">
              <div class="time-value">${avgTime}s</div>
              <div class="time-label">Average</div>
            </div>
            <div class="time-stat">
              <div class="time-value">${fastestTime}s</div>
              <div class="time-label">Fastest</div>
            </div>
            <div class="time-stat">
              <div class="time-value">${slowestTime}s</div>
              <div class="time-label">Slowest</div>
            </div>
          </div>
        </div>
     `;
    }
  }

  function restartQuiz() {
    resultScreen.classList.remove("active");
    setTimeout(() => {
      startQuiz();
    }, 300);
  }

  function shareResults() {
    const text = `I scored ${score} out of ${quizQuestions.length} on Color Vision Simulator Quizzes! Can you beat my score?`;
    if (navigator.share) {
      navigator
        .share({
          title: "My Quiz Results",
          text: text,
          url: window.location.href,
        })
        .catch((err) => {
          fallbackShare(text);
        });
    } else {
      fallbackShare(text);
    }
  }

  function fallbackShare(text) {
    alert("Share this result:\n\n" + text);
  }

  // Save group score
  function saveGroupScore() {
  const groupNameInput = document.getElementById("group-name");
  const saveMsg = document.getElementById("save-score-msg");
  let groupName = groupNameInput.value.trim();
  if (!groupName) {
    saveMsg.textContent = "Please enter a group name!";
    saveMsg.style.color = "red";
    return;
  }
  let difficulty = selectedDifficulty || 'all';
  let category = selectedCategory || 'singleBulb';
   fetch(`${API_URL}/save_score.php`, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: `group_name=${encodeURIComponent(groupName)}&score=${score}&difficulty=${encodeURIComponent(difficulty)}&category=${encodeURIComponent(category)}`
  })
  .then(res => res.text())
  .then(msg => {
    saveMsg.textContent = msg;
    saveMsg.style.color = "green";
    groupNameInput.value = "";
    showLeaderboard();
  });
}

  function showLeaderboard() {
    fetch(`${API_URL}/get_scores.php`)
      .then(res => res.json())
      .then(scores => {
        const leaderboard = document.getElementById("leaderboard");
        const list = document.getElementById("leaderboard-list");
        if (!scores.length) {
          leaderboard.style.display = "none";
          return;
        }
        leaderboard.style.display = "block";
        list.innerHTML = "";
        scores.forEach(s => {
          const li = document.createElement("li");
          li.textContent = `${s.group_name} - ${s.score}`;
          list.appendChild(li);
        });
      });
  }

  // Add event listeners
  if (startButton) startButton.addEventListener("click", startQuiz);
  if (restartButton) restartButton.addEventListener("click", restartQuiz);
  if (shareButton) shareButton.addEventListener("click", shareResults);
  if (backButton) {
    backButton.addEventListener("click", function () {
      resultScreen.classList.remove("active");
      setTimeout(() => {
        startScreen.classList.add("active");
        showLeaderboard();
      }, 300);
    });
  }

  // Add event listener for save score button (only once)
  const saveScoreBtn = document.getElementById("save-score-btn");
  if (saveScoreBtn) {
    saveScoreBtn.addEventListener("click", saveGroupScore);
  }

  // Show leaderboard on start screen load
  showLeaderboard();
});