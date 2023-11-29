// Set the initial time
let newSong = new Audio(
  "./sounds/mixkit-auditorium-moderate-applause-and-cheering-502.wav"
);

// setTimeout(() => {
//   updateTimer();
// }, 4000);
const audio = document.getElementById("myAudio");
// Set the volume to a lower value
audio.volume = 0.5;
// You can also change the volume dynamically
function setVolume(newVolume) {
  if (newVolume >= 0 && newVolume <= 1) {
    audio.volume = newVolume;
  }
}

setVolume(0.1);


let time;
let timerInterval;

function updateTimer() {
  document.getElementById("timer").innerText = time;
  if (time === 0) {
    clearInterval(timerInterval);
    timer.innerHTML = `<h5 class="text-white">Time up!</h5>`;
    setTimeout(() => {
      fetchNewQuestion();
    }, 2000);
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

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};


const fetchNewQuestion = () => {
  fetch("https://opentdb.com/api.php?amount=1&type=multiple")
    .then((response) => response.json())
    .then((result) => {
      let quizQuest = result.results[0];
      let answerOptions = [
        quizQuest.correct_answer,
        quizQuest.incorrect_answers,
      ];

      console.log("Shuffled options:", answerOptions);

      // Find the index of the correct answer in the shuffled array
      const correctAnswerIndex = answerOptions.indexOf(quizQuest.correct_answer);

      // Display the shuffled correct answer on the console
      console.log("Shuffled correct answer:", answerOptions[correctAnswerIndex]);

      let cleanQuestion = quizQuest.question.replace(/quot/g, "");
      cleanQuestion = cleanQuestion.replace(/[^a-zA-Z0-9\s""']/g, '');

      answerOptions = shuffleArray(answerOptions);

      questions.innerHTML =`<h5 class="questions">${cleanQuestion}</h5>`;

      answerQuiz.innerHTML = `
        <div class="brder2 px-3 py-2 text-white fw-bold">A. ${answerOptions[0]}</div>
        <div class="brder2 px-3 py-2 text-white fw-bold">B. ${answerOptions[1]}</div>
      `;

      answerQuiz1.innerHTML = `
        <div class="brder2 px-3 py-2 text-white fw-bold">C. ${answerOptions[2]}</div>
        <div class="brder2 px-3 py-2 text-white fw-bold">D. ${answerOptions[3]}</div>
      `;

      document.querySelectorAll(".brder2").forEach((option) => {
        option.addEventListener("click", (event) => {
          const clickedAnswer = event.target;
          const answerText = clickedAnswer.textContent;

          pauseTimer()

          if (answerText === quizQuest.correct_answer) {
            clickedAnswer.style.backgroundColor = "green";
            updateReward(200);
          } else {
            clickedAnswer.style.backgroundColor = "red";
            updateReward(-30);
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

let reward = 0;

// ... (previous code remains unchanged)

const updateReward = (amount) => {
  reward += amount;

  const rewardDiv = document.getElementById("reward");
  rewardDiv.innerHTML = `<h4>${reward}</h4>`;

  if (reward < 100) {
    rewardDiv.style.backgroundColor = "red";
  } else if (reward >= 100 && reward < 200) {
    rewardDiv.style.backgroundColor = "orange";
  } else {
    rewardDiv.style.backgroundColor = "green";
  }
};

// ... (remaining code remains the same)


fetchNewQuestion();
