/*
  render 16 cards  every 2 cards has the same image
  click start
  reset score = 0
  shuffle & hide cards

  every click increase score => the lower the better
  if no cards flipped => flip the first card
  if first card flipped => 
  check if match 
  if not match => hide them again
  if match => keep them flipped
  if all match => Game Over => save best score

*/

const logo = `<img src="./assets/logo.webp" class="game__item-img" />`;
let score = 0;
let scoredCards = [];
let shuffled = "";
let firstCard = {
  id: "",
  value: "",
};

window.onload = function () {
  const gameItems = document.getElementById("game-items");
  for (let i = 1; i <= 8; i++) {
    const currItem = `<span class="game__item">
      <img src="./assets/${i}.png" class="game__item-img" />
    </span>`;

    gameItems.innerHTML = gameItems.innerHTML + currItem + currItem;
  }
  const bestScore = localStorage.getItem("best_score");
  if (bestScore !== null) {
    document.getElementById("best-score").innerText = bestScore;
  }
  console.log("loaded");
};

function shuffleString(str = "") {
  let s = "";
  let counter = 0;

  let indexObj = {};

  while (s.length !== str.length) {
    let index = Math.floor(str.length * Math.random());
    if (indexObj[index] === undefined) {
      const ele = str[index];
      indexObj[index] = ele;
      s += ele;
    }

    counter++;
    if (counter > 1000) break;
  }

  return s;
}

function handleStart() {
  const gameItems = document.getElementById("game-items");
  gameItems.innerHTML = "";
  let allImgs = "12345678".repeat(2);
  shuffled = shuffleString(allImgs);

  score = 0;
  document.getElementById("score").innerText = score;

  for (let i = 0; i < shuffled.length; i++) {
    const ele = shuffled[i];

    gameItems.innerHTML += `
      <button class="game__item" id="item${i}" name="${ele}" onclick="handleItemFlip('item${i}', ${ele})">
        ${logo}
      </button>
    `;
  }
}

let prevId1 = "";
let prevId2 = "";
let timeout;
let isFinished = true;
function handleItemFlip(id, value) {
  if (id === firstCard.id) return;
  if (scoredCards.includes(value)) return;
  ++score;
  document.getElementById("score").innerText = score;
  // console.log(id);
  // console.log(value);

  if (isFinished === false) {
    clearTimeout(timeout);
    isFinished = true;
    document.getElementById(prevId1).innerHTML = logo;
    document.getElementById(prevId2).innerHTML = logo;
    prevId1 = "";
    prevId2 = "";
    firstCard.id = "";
    firstCard.value = "";
  }

  const item = document.getElementById(id);
  item.innerHTML = `<img src="./assets/${value}.png" class="game__item-img" />`;

  // if no cards selected
  if (firstCard.value === "") {
    firstCard.id = id;
    firstCard.value = value;
    return;
  }

  // if cards match => success
  if (firstCard.value === value) {
    scoredCards.push(value);
    firstCard.id = "";
    firstCard.value = "";
    if (scoredCards.length === shuffled.length / 2) {
      document.getElementById(
        "game-items"
      ).innerHTML = `<h1 style="color: green">Game Over</h1>`;
      const bestScore = localStorage.getItem("best_score");
      if (bestScore === null || (bestScore !== null && bestScore > score)) {
        document.getElementById("best-score").innerText = score;
        localStorage.setItem("best_score", score);
      }
    }
    return;
  }

  prevId1 = firstCard.id;
  prevId2 = id;
  isFinished = false;
  timeout = setTimeout(() => {
    isFinished = true;
    document.getElementById(id).innerHTML = logo;
    document.getElementById(firstCard.id).innerHTML = logo;
    firstCard.id = "";
    firstCard.value = "";
  }, 2000);
}