const startGame = () =>{
  
  window.location.href = "EnterName.html"
}

var gameArray = JSON.parse(localStorage.getItem("playerInfo"));
const createAvatar = () => {
  let yourName = playerName.value;
  let yourCity = playerCity.value;
  let stage = difficulty.value;
  let avatarObject = {yourName, yourCity, stage}

  if (yourCity == "" && yourName == "" && stage == ""){
    console.log("fill the form");
  }else{
    playerName.value = ""
    playerCity.value = ""
    difficulty.value = ""
    localStorage.setItem("playerInfo", JSON.stringify(avatarObject));
    window.location.href = "rules.html"
  }
}

const displayAll = () => {
  console.log(gameArray);
  displayMe.innerHTML = ""
  displayMe.innerHTML = `
  <div class="w-100  d-flex justify-content-center align-items-center vh-100 p-3">
  <div class="border border-light w-50 p-4 brder h-75">
  <p class="text-light fw-bold">Welcome to Millivania <b class="text-warning">${gameArray.yourName}</b>, it's time you know the rules of the game</p>
  <h3 class="textdanger fw-bold">Rules</h3>
  <ol class="text-white px-4 py-2">
  <li>Player is to choose one correct option out of all the options on a particular question</li>
  <li>Player can only walk away from a particular question only after he/she has gotten to a particular prize level</li>
  <li>Player can choose to call a friend or the audience or 50:50</li>
  <li>Player is to choose one correct option within 60 seconds</li>
  <li>Player will only go to the next prize after answering three questions correctly</li>
  </ol>
  <button class="btn btnsuccess w-100" onclick="gameOn()">Continue</button>
  </div>
  </div>
  `
}

displayAll()

const gameOn = () => {
  location.href = "main.html"
}
