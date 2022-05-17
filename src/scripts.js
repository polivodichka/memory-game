/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-continue */
/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */
import 'normalize.css';
import './style/styles.css';

// прелоадер
window.onload = function () {
  document.body.classList.add('loaded_hiding');
  window.setTimeout(() => {
    document.body.classList.add('loaded');
    document.body.classList.remove('loaded_hiding');
  }, 500);
};

// на русском локально из json файла получаю факты
async function getData(n) {
  const quotes = '/assets/facts.json';
  const res = await fetch(quotes);
  const data = await res.json();
  return data.value[n];
}

localStorage.score = localStorage.score ? localStorage.score : '';
localStorage.players = localStorage.players ? localStorage.players : '';

let scoreArr = localStorage.score.split('\n');
let players = localStorage.players.split('\n');

const num = 10; // количество карточек
const arr = [];
let numOpen = 0;
let score = 0;
const compliment = ['Здорово', 'Вот это да', 'Огонь', 'Потрясающе', 'Ого'];

const saveNameBtns = document.querySelectorAll('.save-name');
saveNameBtns.forEach((btn) => {
  btn.addEventListener('click', saveName);
});

const nameInp = document.querySelectorAll('.name');
localStorage.name ? nameInp.forEach((inp) => inp.value = localStorage.name) : askName();

// создаём массив карточек и перемешиваем
for (let i = 1; i <= num; i += 1) {
  arr.push(i);
  arr.push(i);
}
arr.sort(() => Math.random() - 0.5);

// вывод шапки игры
document.querySelector('.game-header').innerHTML += '<div class=\'game-header\'><div style="flex-direction: row; display:flex"><button  id="settings" style="width:90px"><svg><use xlink:href="/assets/sprite.svg#settings"></use></svg></button> <button style="width:160px" id="restart">restart</button></div> <div><span>score:</span><span class=\'cur-score\'>0</span></div></div>';

// выводим на поле
const gameSection = document.querySelector('.game-field');
arr.forEach((number, i) => {
  gameSection.innerHTML += `<div class="memory-card _${number}">\n
    <img class="back" src="assets/png/${number}.png" alt="Memory Card">
    <img class="front" src="assets/vincent.png"">
  </div>`;
});

let cards = document.querySelectorAll('.memory-card');
cards.forEach((card) => card.addEventListener('click', flipCard));

const settingsBtn = document.querySelector('#settings');
settingsBtn.addEventListener('click', settings);

const restartBtn = document.querySelector('#restart');
restartBtn.addEventListener('click', restart);

const alreadyLoaded = new Set();

const closeWinWindowBtns = document.querySelectorAll('.close');
closeWinWindowBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    if (!e.path[1].classList.contains('settings-window')) {
      winner();
    } else {
      settings();
    }
  });
});

document.querySelector('.art').addEventListener('click', showArt);

function flipCard() {
  // во время игры
  if (document.querySelectorAll('.open').length < 2 && !this.classList.contains('match') && !this.classList.contains('flip')) {
    document.querySelectorAll('.preload img').forEach((img) => {
      alreadyLoaded.add(img.alt);
    });
    alreadyLoaded.has(String(parseInt(this.classList.value.match(/\d+/), 10))) ? 0 : document.querySelector('.preload').innerHTML
        += `<img src="assets/gif/${parseInt(this.classList.value.match(/\d+/), 10)}.gif" alt="${parseInt(this.classList.value.match(/\d+/), 10)}"><img src="assets/arts/${parseInt(this.classList.value.match(/\d+/), 10)}.jpg" alt="${parseInt(this.classList.value.match(/\d+/), 10)}">`;

    this.classList.toggle('flip');
    this.classList.toggle('open');
    score += 1;
    document.querySelector('.cur-score').textContent = score;
    const open = document.querySelectorAll('.open');
    open.length === 2 ? compareCards(open) : 0;
  } else if (numOpen === num) { // после игры для вывода инфо о картинах
    document.querySelector('.paint').style.backgroundImage = `url('assets/arts/${parseInt(this.classList.value.match(/\d+/), 10)}.jpg')`;
    getData(parseInt(this.classList.value.match(/\d+/), 10) - 1).then((result) => {
      document.querySelector('.description').innerHTML = `<p class="title">${result.name}</p>
                <p class="artist">${result.artist}</p>
                <p class="year">${result.year}</p>
                <div class="art-fact">${result.fact}</div>
                <p class="place"><svg><use xlink:href="/assets/sprite.svg#location"></use></svg>${result.place}</p>`;
    });

    const selectedCards = document.querySelectorAll(`._${parseInt(this.classList.value.match(/\d+/), 10)} .back`);
    selectedCards.forEach((card) => {
      convertPngToGif(card);
      setTimeout(() => {
        convertGifToPng(card);
      }, 3000);
    });

    document.querySelector('.lock-click').classList.remove('hide');
    setTimeout(() => {
      showArt();
      document.querySelector('.lock-click').classList.add('hide');
    }, 3000);
  }
}

document.getElementById('rating').addEventListener('click', () => { ratingClick(); });

function settings() {
  document.querySelector('.glass').classList.toggle('hide');
  document.querySelector('.settings-window').classList.toggle('show');
  setTimeout(() => {
    if (document.querySelector('.rating').classList.contains('show')) {
      document.querySelector('.rating').classList.toggle('show');
      document.querySelector('.menu').classList.toggle('show');
    } else if (document.querySelector('.rules').classList.contains('show')) {
      document.querySelector('.rules').classList.toggle('show');
      document.querySelector('.menu').classList.toggle('show');
    }
  }, 500);
}

function compareCards(open) {
  if (open[0].classList.value === open[1].classList.value) { // короче если совпадают классы с номером карты у обоих
    open.forEach((openCard) => {
      openCard.classList.remove('open');
      openCard.classList.toggle('match');
    });
    numOpen += 1;
    if (numOpen === num) { // все открыты
      document.querySelector('.text').innerHTML += `<p>${compliment[getRandomInt(0, compliment.length - 1)]}! Знаете, сколько шагов вам понадобилось для победы?</p><p>Всего ${score}!</p><p  class='addition'>Теперь можете посмотреть на реальные картины, кликнув на любую карточку, или начать игру заново и поставить новый рекорд:)</p>`;
      localStorage.score += `${score}\n`;
      localStorage.players += `${localStorage.name}\n`;
      lengthCheck();
      setTimeout(() => {
        winner();
      }, 800);
    }
  } else {
    open.forEach((openCard) => {
      setTimeout(() => {
        openCard.classList.remove('flip');
        openCard.classList.remove('open');
      }, 800);
    });
  }
}

function restart() {
  window.stop();
  numOpen = 0;
  score = 0;
  document.querySelector('.cur-score').textContent = score;
  document.querySelector('.text').innerHTML = '';

  cards.forEach((card) => {
    card.classList.remove('match');
    card.classList.remove('flip');
  });

  setTimeout(() => {
    gameSection.innerHTML = '';
    arr.sort(() => Math.random() - 0.5);
    // вывод карточек
    arr.forEach((number, i) => {
      gameSection.innerHTML += `<div class="memory-card _${number}">\n
    <img class="back" src="assets/png/${number}.png" alt="Memory Card">
    <img class="front" src="assets/vincent.png"">
  </div>`;
    });
    cards = document.querySelectorAll('.memory-card');
    cards.forEach((card) => card.addEventListener('click', flipCard));
  }, 500);
}

function winner() {
  document.querySelector('.glass').classList.toggle('hide');
  document.querySelector('.winner-text').classList.toggle('show');
}

function showArt() {
  document.querySelector('.glass').classList.toggle('hide');
  document.querySelector('.art').classList.toggle('show');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function askName() {
  document.querySelector('.glass').classList.toggle('hide');
  document.querySelector('.ask-name').classList.toggle('show');
}

function saveName(val = false) {
  if (typeof (val) === 'string') {
    if (val !== '') {
      localStorage.name = val;
    } else {
      nameInp.forEach((element) => element.style.outlineColor = 'red');
      setTimeout(() => {
        nameInp.forEach((inp) => inp.value = localStorage.name ? localStorage.name : '');
      }, 250);
      setTimeout(() => {
        nameInp.forEach((element) => element.style.outlineColor = 'Fuchsia');
      }, 500);

      return 0;
    }
  } else if (nameInp[0].value !== '') {
    localStorage.name = nameInp[0].value;
  } else {
    nameInp.forEach((element) => element.style.outlineColor = 'red');
    setTimeout(() => {
      nameInp.forEach((inp) => inp.value = localStorage.name ? localStorage.name : '');
    }, 250);
    setTimeout(() => {
      nameInp.forEach((element) => element.style.outlineColor = 'Fuchsia');
    }, 500);

    return 0;
  }
  document.activeElement.blur();
  nameInp.forEach((inp) => inp.value = localStorage.name);
  document.querySelector('.glass').classList.toggle('hide');
  document.querySelector('.ask-name').classList.remove('show');
  document.querySelector('.settings-window').classList.remove('show');
  // убрать границу
}

function ratingClick() {
  document.querySelector('.rating').classList.toggle('show');
  document.querySelector('.menu').classList.toggle('show');
  scoreArr = localStorage.score.split('\n');
  players = localStorage.players.split('\n');
  tableCreate(players, scoreArr);
}

function tableCreate(player, num) {
  const total = sortScore(player, num);
  document.querySelector('.table table tbody') ? document.querySelector('.table table tbody').remove() : 0;
  const body = document.querySelector('.table');
  const tbl = document.querySelector('.table table') ? document.querySelector('.table table') : document.createElement('table');

  for (let i = 0; i < total.length; i += 1) {
    const tr = tbl.insertRow();
    for (let j = 0; j < 3; j += 1) {
      const td = tr.insertCell();
      j === 0
        ? td.appendChild(document.createTextNode(`${i + 1}`))
        : j === 1
          ? td.appendChild(document.createTextNode(`${total[i].name}`))
          : td.appendChild(document.createTextNode(`${total[i].score}`));
    }
  }
  body.appendChild(tbl);
}

function sortScore(player, num) {
  const scoreObj = [];
  for (let i = 0; i < player.length; i += 1) {
    if (player[i] === '') continue;
    scoreObj.push({
      name: player[i],
      score: num[i],
    });
  }
  scoreObj.sort((a, b) => (a.score > b.score ? 1 : -1));
  return scoreObj;
}

function lengthCheck() {
  const max = 10;
  scoreArr = localStorage.score.split('\n');
  players = localStorage.players.split('\n');

  if (players.length > max + 1) {
    do {
      players.shift();
      scoreArr.shift();
    } while (players.length > max + 1);
    localStorage.players = players.join('\n');
    localStorage.score = scoreArr.join('\n');
  }
}

function convertPngToGif(e) {
  const splitStr = e.src.split('/');
  const number = splitStr[splitStr.length - 1].split('.')[0];
  e.src = `assets/gif/${number}.gif`;
}

function convertGifToPng(e) {
  const splitStr = e.src.split('/');
  const number = splitStr[splitStr.length - 1].split('.')[0];
  e.src = `assets/png/${number}.png`;
}
