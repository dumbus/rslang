import { getWordsAllGroup } from '../api';
import { IDescriptGame, IWord } from '../interfaces';
import { shuffle, randomInteger } from '../utils';

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
  score: number;
  addScore: number;
  scoreLevel: number;
  words: IWord[];
  correctAnswer: boolean;
  section: HTMLElement;
  constructor(type: 'sprint' | 'audiocall') {
    this.type = type;
    this.description = type === 'sprint' ? SPRINT_DESCRIPTION : AUDIOCALL_DESCRIPTION;
    this.root = document.querySelector('.root');
    this.wordNumber = 0;
    this.score = 0;
    this.addScore = 10;
    this.scoreLevel = 0;
    this.correctAnswer = randomInteger(0, 1) === 1;
  }

  private updateScoreLevel() {
    this.scoreLevel += 1;
    if (this.scoreLevel > 3) {
      this.scoreLevel = 0;
      this.addScore *= 2;
    }
    if (this.addScore > 80) {
      this.addScore = 80;
      this.scoreLevel = 3;
    }
  }

  private updateGameSprint(correct: boolean) {
    this.wordNumber += 1;
    this.correctAnswer = randomInteger(0, 1) === 1;
    if (correct) {
      this.score += this.addScore;
      this.updateScoreLevel();
    } else {
      this.addScore = 10;
      this.scoreLevel = 0;
    }
    this.updateSprint(this.correctAnswer);
  }

  private updateSprint(correct: boolean) {
    const num = correct ? this.wordNumber : randomInteger(0, this.words.length);
    const element = document.createElement('div');
    element.className = 'update-sprint';
    element.innerHTML = `<p class="game__total">Текущий результат ${this.score}</p>
    <p class="game__add-points">+${this.addScore} очков за слово</p>
    <ul class="game__dot">
      <li class="game__dot-item"></li>
      <li class="game__dot-item"></li>
      <li class="game__dot-item"></li>
    </ul>
    <div class="game__question">
      <p class="game__question-word">${this.words[this.wordNumber].word}</p>
      <p class="game__question-translate">${this.words[num].wordTranslate}</p>
      <div class="game__question-btn">
        <button class="game__question-btn_item game__question-btn_wrong" data-atr="0">Неверно</button>
        <button class="game__question-btn_item game__question-btn_correct" data-atr="1">Верно</button>
      </div>
    </div>`;
    const gameMain = this.section.querySelector('.game__main');
    this.section.querySelector('.update-sprint')?.remove();
    const dots = element.querySelectorAll('.game__dot-item');
    dots.forEach((item, i) => {
      if (i < this.scoreLevel) {
        item.classList.add('true');
      } else {
        item.classList.remove('true');
      }
    });
    gameMain.prepend(element);
  }

  private renderSprint(arr: IWord[]) {
    this.words = arr;
    this.section = document.createElement('section');
    this.section.className = 'game';
    this.section.innerHTML = `<div class="game__main">
    <div class="game__timer">
      <img class="game__timer-img" src="./assets/svg/clock.svg" alt="clock">
      <p class="game__timer-num">59</p>
    </div>
  </div>`;
    this.updateSprint(this.correctAnswer);
    const gameMain = this.section.querySelector('.game__main');
    gameMain.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target && target.matches('.game__question-btn_item')) {
        const bool = target.dataset.atr === '1';
        this.updateGameSprint(bool === this.correctAnswer);
      }
    });
    this.root.innerHTML = `<header class="header">
  <div class="header-home">RS Lang</div>
  <nav class="header-nav">
    <div class="header-nav-textbook button">Учебник</div>
    <div class="header-nav-stats button">Статистика</div>
    <div class="header-nav-audio button">Аудиовызов</div>
    <div class="header-nav-sprint button">Спринт</div>
  </nav>
</header>`;
    this.root.append(this.section);
  }
  private renderAudiocall(arr: IWord[]) {
    const section = document.createElement('section');
    section.className = 'game';
    section.innerHTML = `<div class="game-audio">
    <div class="game-audio__word game-audio__word-show">
      <div class="game-audio__word_sound game-audio__word_sound-show">
        <img src="./assets/svg/audio.svg" alt="audio" class="game-audio__word_sound-img game-audio__word_sound-img-show">
      </div>
    </div>
    <div class="game-audio__answers">
      <button class="game-audio__btn">1 Вариант</button>
      <button class="game-audio__btn">2 Вариант</button>
      <button class="game-audio__btn">3 Вариант</button>
      <button class="game-audio__btn">4 Вариант</button>
    </div>
    <button class="game-audio__btn btn-next">Не знаю</button>
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

  private render(arr: IWord[]) {
    if (this.type === 'sprint') {
      this.renderSprint(arr);
    } else {
      this.renderAudiocall(arr);
    }
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
        <li class="btn-level_1 btn-number" data-num="0">1</li>
        <li class="btn-level_2 btn-number" data-num="1">2</li>
        <li class="btn-level_3 btn-number" data-num="2">3</li>
        <li class="btn-level_4 btn-number" data-num="3">4</li>
        <li class="btn-level_5 btn-number" data-num="4">5</li>
        <li class="btn-level_6 btn-number" data-num="5">6</li>
      </ul>
    </div>
  </section>`;
    const levels = this.root.querySelectorAll('.btn-number') as NodeListOf<HTMLElement>;
    levels.forEach((item) => {
      item.addEventListener('click', async () => {
        const arr = await getWordsAllGroup(item.dataset.num);
        shuffle(arr);
        this.render(arr);
      });
    });
    const closeBtn = this.root.querySelector('.close-game');
    closeBtn.addEventListener('click', () => {
      console.log('close');
    });
  }
}
