// Set the initial time
let newSong = new Audio(
  "./sounds/mixkit-auditorium-moderate-applause-and-cheering-502.wav"
);
let selectSong = new Audio(
  "./sounds/select.wav"
);
const audio = document.getElementById("myAudio");
// Set the volume to a lower value
audio.volume = 0.5;
// You can also change the volume dynamically
function setVolume(newVolume) {
  if (newVolume >= 0 && newVolume <= 1) {
    audio.volume = newVolume;
  }
}

setVolume(0.3);

let time;
let timerInterval;

function updateTimer() {
  document.getElementById("timer").innerText = time;
  if (time === 0) {
    clearInterval(timerInterval);
    timer.innerHTML = `<h5 class="text-warning">Time up!</h5>`;
    updateReward(-50);
    setTimeout(() => {
      fetchNewQuestion();
    }, 4000);
  } else {
    --time;
  }
}

const startTimer = () => {
  timerInterval = setInterval(updateTimer, 1000);
};

const pauseTimer = () => {
  clearInterval(timerInterval);
};

// Copy the array to avoid modifying the original
const shuffleArray = (array) => {
  const shuffledArray = array.slice(); // Copy the array to avoid modifying the original
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};


let answerOptions = localStorage.getItem("question") || [];
const fetchNewQuestion = () => {
  fetch("https://opentdb.com/api.php?amount=1&type=multiple")
    .then((response) => response.json())
    .then((result) => {
      let quizQuest = result.results[0];
      let answerOptions = [
        quizQuest.correct_answer,
        ...quizQuest.incorrect_answers,
      ];
      localStorage.setItem("questions", JSON.stringify(answerOptions))
      clearTimeout(congratulationTimeout);
      console.log("Shuffled options:", answerOptions);

      // Find the index of the correct answer in the shuffled array
      const correctAnswerIndex = answerOptions.indexOf(
        quizQuest.correct_answer
      );

      // Display the shuffled correct answer on the console
      console.log(
        "Shuffled correct answer:",
        answerOptions[correctAnswerIndex]
      );

      let cleanQuestion = quizQuest.question.replace(/quot/g, "");
      cleanQuestion = cleanQuestion.replace(/[^a-zA-Z0-9\s""']/g, "");

      answerOptions = shuffleArray(answerOptions);

      questions.innerHTML = `<h5 class="questions">${cleanQuestion}</h5>`;

      answerQuiz.innerHTML = `
        <span class="text-white fw-bold">A</span><div class="brder2 px-3 py-2 text-white fw-bold"> ${answerOptions[0]}</div>
        <span class="text-white fw-bold">B</span><div class="brder2 px-3 py-2 text-white fw-bold"> ${answerOptions[1]}</div>
      `;

      answerQuiz1.innerHTML = `
      <span class="text-white fw-bold">C</span><div class="brder2 px-3 py-2 text-white fw-bold"> ${answerOptions[2]}</div>
      <span class="text-white fw-bold">D</span><div class="brder2 px-3 py-2 text-white fw-bold"> ${answerOptions[3]}</div>
      `;

      document.querySelectorAll(".brder2").forEach((option) => {
        option.addEventListener("click", (event) => {
          selectSong.play()
          const clickedAnswer = event.target;
          const answerText = clickedAnswer.innerText;
          const correctAnswer = quizQuest.correct_answer;
          pauseTimer();
          // console.log("Clicked Answer:", answerText);
          // console.log("Correct Answer:", correctAnswer);

          if (answerText == correctAnswer) {
            clickedAnswer.style.backgroundColor = "green";
            updateReward(200);
          } else {
            updateReward(-30)
            // Incorrect answer: Highlight correct answer in green before proceeding
            const correctOption = [...document.querySelectorAll(".brder2")].find(
              (option) => option.innerText === correctAnswer
            );
            correctOption.style.backgroundColor = "green";
            clickedAnswer.style.backgroundColor = "red";
    
            setTimeout(() => {
              correctOption.style.backgroundColor = ""; // Reset correct answer color
              fetchNewQuestion();
            }, 2500);
            return;
          }
          document.querySelectorAll(".brder2").forEach((answer) => {
            answer.style.pointerEvents = "none";
          });
    
          setTimeout(() => {
            fetchNewQuestion();
          }, 2500);
        });
      });

      time = 30;
      timerInterval = setInterval(updateTimer, 1000);
    });
};

window.onload = () => {
  const savedScore = localStorage.getItem("score");
  const savedLevel = localStorage.getItem("level");
  console.log(savedLevel);

  if (savedScore) {
    reward = parseInt(savedScore, 10);
    const rewardDiv = document.getElementById("reward");
    rewardDiv.innerHTML = `<h4>$${reward}</h4>`;
   
  }
  if (savedLevel) {
    currentLevel = parseInt(savedLevel, 10);
    // Update the game interface or perform any necessary actions based on the saved level
  }
};
fetchNewQuestion()







let reward = 0;
let correctAnswersCount = 0;
let currentLevel = 1; // Initialize current level
let congratulationTimeout;
let savedLevel = localStorage.getItem("level")


document.getElementById("level").innerHTML = ""

document.getElementById("level").innerHTML = `
  <h4>Level : ${savedLevel}</h4>
`
if (savedLevel == null){
  document.getElementById("level").innerHTML = `
  <h4>Level : ${currentLevel}</h4>
`
}








// Update reward and check for correct answers
const updateReward = (amount) => {
  reward += amount;
  localStorage.setItem("score", reward);

  const rewardDiv = document.getElementById("reward");
  rewardDiv.innerHTML = `<h4>$${reward}</h4>`;

  if (amount === 200) {
    // Increment count for correct answers
    correctAnswersCount++; 
  }

  if (correctAnswersCount === currentLevel * 3) {
    pauseTimer();
    document.getElementById("disappear").style.display = "none";
    currentLevel++;
    document.getElementById("gameContainer").innerHTML = `
      <h2 class="text-center text-white fw-bold outlined-text">You just completed level ${
        currentLevel - 1
      }</h2>
    `;

    newSong.play();
    setVolume(0.5);

    setTimeout(() => {
      gameContainer.innerHTML = ""; // Clear the gameContainer content after 5 seconds
      document.getElementById("disappear").style.display = "block";
      document.getElementById("disappear1").style.display = "block";
      newSong.pause(); // Stop the sound
      localStorage.setItem("level", currentLevel);
      location.reload()
      fetchNewQuestion(); // Resume questions and timer immediately after content disappears
      startTimer()
    }, 2500);
  }

  if (reward < 100) {
    rewardDiv.style.backgroundColor = "red";
  } else if (reward >= 100 && reward < 200) {
    rewardDiv.style.backgroundColor = "orange";
  } else {
    rewardDiv.style.backgroundColor = "green";
  }
};








let fiftyFiftyUsed = false;
const fiftyFifty = () => {

  if (fiftyFiftyUsed) {
    return;
  }

  fiftyFiftyUsed = true;
  const fiftyFiftyButton = document.getElementById("fiftyFiftyButton");
  fiftyFiftyButton.disabled = true; // Disable the button
  fiftyFiftyButton.style.backgroundColor = "red"; // Change background color to red
  fiftyFiftyButton.style.opacity = "0.5"; // Make the button transparent




  const options = document.querySelectorAll(".brder2");
  const storedQuestion = localStorage.getItem("questions");
  
  if (!storedQuestion) {
    console.error("No stored questions found");
    return;
  }
  
  const answerOptions = JSON.parse(storedQuestion);

  const correctAnswerIndex = answerOptions.findIndex(
    (option) => option === answerOptions[1]
  );

  if (correctAnswerIndex === -1) {
    console.error("Correct answer not found in the options");
    return;
  }

  const incorrectAnswers = Array.from(options).filter(
    (_, index) => index !== correctAnswerIndex
  );
  const incorrectIndices = [];
  while (incorrectIndices.length < 2) {
    const randomIndex = Math.floor(Math.random() * incorrectAnswers.length);
    if (!incorrectIndices.includes(randomIndex)) {
      incorrectIndices.push(randomIndex);
      incorrectAnswers[randomIndex].style.visibility = "hidden";
    }
  }

};



const restartGame = () => {
  localStorage.removeItem("level")
  localStorage.removeItem("score")
  location.reload()
  fiftyFiftyUsed = false;
  const fiftyFiftyButton = document.getElementById("fiftyFiftyButton");
  fiftyFiftyButton.disabled = false; // Enable the button
  fiftyFiftyButton.style.backgroundColor = ""; // Reset background color
  fiftyFiftyButton.style.opacity = "";
  fetchNewQuestion();
};

let fetchInterval;
const pauseGame = () => {
  pauseTimer();
  clearInterval(fetchInterval); 
};
const startGame = () => {
  startTimer();
  fetchInterval = setInterval(fetchNewQuestion, 30000); // Adjust the interval as needed
};




// Assume you have an array of audience percentages (between 0 and 100)
const audienceData = [Math.random()*100 ,Math.random()*100 ,Math.random()*100, Math.random()*100]; // Example data: 4 options

// Function to create the chart
function createChart() {
  pauseTimer()
  const ctx = document.getElementById('audiencePollChart').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['A', 'B', 'C', 'D'], // Labels for each option
      datasets: [{
        label: 'Audience Poll',
        data: audienceData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)', // Red
          'rgba(54, 162, 235, 0.8)', // Blue
          'rgba(255, 206, 86, 0.8)', // Yellow
          'rgba(75, 192, 192, 0.8)' // Green
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100 // Set the maximum scale to 100 (percentage)
        }
      }
    }
  });
   // Hide the chart after 10 seconds
   setTimeout(function() {
    document.getElementById('audiencePollChart').style.display = "none";
    startTimer()
  }, 8000); 
}

