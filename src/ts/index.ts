import '../sass/style.scss';
import Game from './games/gameClass';

const sprintBtn = document.querySelector('.header-nav-sprint');
sprintBtn.addEventListener('click', () => {
  const game = new Game('sprint');
  game.startPage();
});

const audiocallBtn = document.querySelector('.header-nav-audio');
audiocallBtn.addEventListener('click', () => {
  const game = new Game('audiocall');
  game.startPage();
});
