const startGame = () =>{
  
  window.location.href = "EnterName.html"
}

var gameArray = JSON.parse(localStorage.getItem("playerInfo"));
const createAvatar = () => {
  let yourName = playerName.value;
  let yourCity = playerCity.value;
  let stage = difficulty.value;
  let avatarObject = {yourName, yourCity, stage}
  playerName.value = ""
  playerCity.value = ""
  difficulty.value = ""
  localStorage.setItem("playerInfo", JSON.stringify(avatarObject));
  window.location.href = "rules.html"
}

const displayAll = () => {
  console.log(gameArray);
  displayMe.innerHTML = ""
  displayMe.innerHTML = `
  <div class="w-100  d-flex justify-content-center align-items-center vh-100 p-3">
  <div class="border border-light w-50 p-3 brder h-75">
  <h2 class="text-light">Welcome to MILIVANIA ${gameArray.yourName}, I hope you like a challenge because MILLIVANIA has that so be careful here are the rules of MILLIVANIA</h2>
  </div>
  </div>
  `
}

displayAll()