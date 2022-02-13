import '../sass/style.scss';
import Game from './games/gameClass';

const sprintBtn = document.querySelector('.header-nav-sprint');
sprintBtn.addEventListener('click', () => {
  Game.inst = new Game('sprint');
  Game.inst.startPage();
});

const audiocallBtn = document.querySelector('.header-nav-audio');
audiocallBtn.addEventListener('click', () => {
  Game.inst = new Game('audiocall');
  Game.inst.startPage();
});
