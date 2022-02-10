import { IDescriptGame, IWord } from '../interfaces';

const SPRINT_DESCRIPTION = {
  title: 'Спринт',
  text:
    '«Спринт» - это веселый способ выучить новые слова. Вам нужно будет выбрать соответствует ли перевод предложенному слову.'
};
const AUDIOCALL_DESCRIPTION = {
  title: 'Аудиовызов',
  text:
    '«Аудиовызов» - это тренировка, которая поможет развить ваш навык аудирования. Вам нужно будет выбрать верное услышанное слова.'
};

export default class Game {
  type: 'sprint' | 'audiocall';
  description: IDescriptGame;
  root: HTMLElement;
  wordNumber: number;
  constructor(type: 'sprint' | 'audiocall') {
    this.type = type;
    this.description = type === 'sprint' ? SPRINT_DESCRIPTION : AUDIOCALL_DESCRIPTION;
    this.root = document.querySelector('.root');
    this.wordNumber = 0;
  }

  private renderSprint() {
    const section = document.createElement('section');
    section.className = 'game';
    section.innerHTML = `<div class="game__main">
    <p class="game__total">Текущий результат 0</p>
    <p class="game__add-points">+10 очков за слово</p>
    <ul class="game__dot">
      <li class="game__dot-item"></li>
      <li class="game__dot-item"></li>
      <li class="game__dot-item"></li>
    </ul>
    <div class="game__question">
      <p class="game__question-word">help</p>
      <p class="game__question-translate">помощь</p>
      <div class="game__question-btn">
        <button class="game__question-btn_item game__question-btn_wrong">Неверно</button>
        <button class="game__question-btn_item game__question-btn_correct">Верно</button>
      </div>
    </div>
    <div class="game__timer">
      <img class="game__timer-img" src="./assets/svg/clock.svg" alt="clock">
      <p class="game__timer-num">59</p>
    </div>
  </div>`;
    this.root.innerHTML = `<header class="header">
  <div class="header-home">RS Lang</div>
  <nav class="header-nav">
    <div class="header-nav-textbook button">Учебник</div>
    <div class="header-nav-stats button">Статистика</div>
    <div class="header-nav-audio button">Аудиовызов</div>
    <div class="header-nav-sprint button">Спринт</div>
  </nav>
</header>`;
    this.root.append(section);
  }

  startPage() {
    this.root.innerHTML = `<section class="description">
    <button class="close-game">
      <span class="close-game__span-1"></span>
      <span class="close-game__span-2"></span>
    </button>
    <div class="description__main">
      <h2 class="description__title">${this.description.title}</h2>
      <p class="description__text">${this.description.text}</p>
      <ul class="btn-level">
        <li class="btn-level_1 btn-number" data-num="1">1</li>
        <li class="btn-level_2 btn-number" data-num="2">2</li>
        <li class="btn-level_3 btn-number" data-num="3">3</li>
        <li class="btn-level_4 btn-number" data-num="4">4</li>
        <li class="btn-level_5 btn-number" data-num="5">5</li>
        <li class="btn-level_6 btn-number" data-num="6">6</li>
      </ul>
    </div>
  </section>`;
    const levels = this.root.querySelectorAll('.btn-number') as NodeListOf<HTMLElement>;
    levels.forEach((item) => {
      item.addEventListener('click', () => {
        console.log(item.dataset.num);
        this.renderSprint();
      });
    });
    const closeBtn = this.root.querySelector('.close-game');
    closeBtn.addEventListener('click', () => {
      console.log('close');
    });
  }
}
