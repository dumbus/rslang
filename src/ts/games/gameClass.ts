import { BASE, getWords, getWordsAllGroup } from '../api';
import { IDescriptGame, IWord } from '../interfaces';
import { shuffle, randomInteger, randomNoRepeatNum, randomArrNum } from '../utils';
import { createMainscreen } from '../modules/mainscreen';

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
  audioCorrect: HTMLAudioElement;
  audioWrong: HTMLAudioElement;
  audioFinish: HTMLAudioElement;
  answers: {
    correct: number[];
    wrong: number[];
  };
  timer: number;
  timerID: NodeJS.Timer;
  mute: boolean;
  constructor(type: 'sprint' | 'audiocall') {
    this.type = type;
    this.description = type === 'sprint' ? SPRINT_DESCRIPTION : AUDIOCALL_DESCRIPTION;
    this.root = document.querySelector('.main');
    this.wordNumber = 0;
    this.score = 0;
    this.addScore = 10;
    this.scoreLevel = 0;
    this.correctAnswer = randomInteger(0, 1) === 1;
    this.audioCorrect = new Audio('./assets/audio/correct.mp3');
    this.audioWrong = new Audio('./assets/audio/error.mp3');
    this.audioFinish = new Audio('./assets/audio/finish.mp3');
    this.timer = 60;
    this.answers = {
      correct: [],
      wrong: []
    };
    this.mute = false;
  }
  static inst: Game;

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

  private getResultItems(arr: number[]) {
    const items = document.createElement('div');
    arr.forEach((i) => {
      const audio = new Audio(`${BASE}${this.words[i].audio}`);
      const item = document.createElement('div');
      item.className = 'result__item';
      item.innerHTML = `<div class="result__item_btn">
        <img src="./assets/svg/audio.svg" alt="audio" class="result__item_btn-img">
      </div>
      <p class="result__item_text">
        ${this.words[i].word} <span class="result__item_trans">${this.words[i].transcription}</span>
        <span class="result__item_translate">-</span>
        <span class="result__item_translate">${this.words[i].wordTranslate}</span>
      </p>`;
      const btn = item.querySelector('.result__item_btn');
      btn.addEventListener('click', () => {
        audio.currentTime = 0;
        audio.play();
      });
      items.append(item);
    });
    return items;
  }

  private finishGame() {
    this.audioFinish.play();
    document.removeEventListener('keydown', this.checkKey);
    document.removeEventListener('keydown', this.checkKeyAudiocall);
    this.section.innerHTML = '';
    const element = document.createElement('div');
    element.className = 'result';
    element.innerHTML = ` <div class="result__total">
    <h3 class="result__total_stat">Статистика</h3>
    ${this.type === 'sprint' ? `<p class="result__total_text">Набрано ${this.score} очков.</p>` : ''}
    </div>
    <div class="result__answers">
      <div class="result__section">
        <p class="result__title">Не верные ответы 
        <span class="result__num result__num_wrong">${this.answers.wrong.length}</span></p>
      </div>
      <div class="result__section">
        <p class="result__title">Правильные ответы 
        <span class="result__num result__num_correct">${this.answers.correct.length}</span></p>
      </div>
    </div>
    <div class="result__btns">
      <button class="result__btn result__btn_close">
        Закончить игру
      </button>
      <button class="result__btn result__btn_again">
        Еще раз
      </button>
    </div>`;
    const resultSections = element.querySelectorAll('.result__section');
    resultSections[0].append(this.getResultItems(this.answers.wrong));
    resultSections[1].append(this.getResultItems(this.answers.correct));
    const againBtn = element.querySelector('.result__btn_again');
    againBtn.addEventListener('click', () => {
      shuffle(this.words);
      Game.inst = new Game(this.type);
      Game.inst.render(this.words);
    });
    const closeBtn = element.querySelector('.result__btn_close');
    closeBtn.addEventListener('click', () => {
      this.root.innerHTML = '';
      this.root.append(createMainscreen());
    });
    this.section.append(element);
  }

  private toggleMute() {
    const btn: HTMLElement = this.section.querySelector('.mute-game');
    if (this.mute) {
      this.mute = false;
      btn.style.backgroundColor = '';
      this.audioCorrect.muted = false;
      this.audioWrong.muted = false;
      this.audioFinish.muted = false;
    } else {
      this.mute = true;
      btn.style.backgroundColor = '#c0c0c0';
      this.audioCorrect.muted = true;
      this.audioWrong.muted = true;
      this.audioFinish.muted = true;
    }
  }

  private updateGameSprint(correct: boolean) {
    this.correctAnswer = randomInteger(0, 1) === 1;
    if (correct) {
      this.answers.correct.push(this.wordNumber);
      this.audioCorrect.currentTime = 0;
      this.audioCorrect.play();
      this.score += this.addScore;
      this.updateScoreLevel();
    } else {
      this.answers.wrong.push(this.wordNumber);
      this.audioWrong.currentTime = 0;
      this.audioWrong.play();
      this.addScore = 10;
      this.scoreLevel = 0;
    }
    this.wordNumber += 1;
    if (this.wordNumber === this.words.length) {
      clearInterval(this.timerID);
      this.finishGame();
    } else {
      this.updateSprint(this.correctAnswer);
    }
  }

  private updateSprint(correct: boolean) {
    const num = correct ? this.wordNumber : randomNoRepeatNum(this.wordNumber, this.words.length - 1);
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

  private checkKey(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') Game.inst.updateGameSprint(false === Game.inst.correctAnswer);
    if (e.key === 'ArrowRight') Game.inst.updateGameSprint(true === Game.inst.correctAnswer);
  }

  private renderSprint(arr: IWord[]) {
    this.words = arr;
    this.section = document.createElement('section');
    this.section.className = 'game';
    this.section.innerHTML = `
    <button class="close-game">
      <span class="close-game__span-1"></span>
      <span class="close-game__span-2"></span>
    </button>
    <button class="mute-game"></button>
      <div class="game__main game__container">
      <div class="game__timer">
        <img class="game__timer-img" src="./assets/svg/clock.svg" alt="clock">
        <p class="game__timer-num">${this.timer}</p>
      </div>
    </div>`;
    this.section.querySelector('.mute-game').addEventListener('click', this.toggleMute.bind(this));
    const closeBtn = this.section.querySelector('.close-game');
    closeBtn.addEventListener('click', () => {
      this.root.innerHTML = '';
      this.root.append(createMainscreen());
      clearInterval(this.timerID);
    });
    this.updateSprint(this.correctAnswer);
    const gameMain = this.section.querySelector('.game__main');
    const timerElement = this.section.querySelector('.game__timer-num');
    gameMain.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target && target.matches('.game__question-btn_item')) {
        const bool = target.dataset.atr === '1';
        this.updateGameSprint(bool === this.correctAnswer);
      }
    });
    document.addEventListener('keydown', this.checkKey);
    this.timerID = setInterval(() => {
      this.timer -= 1;
      timerElement.textContent = `${this.timer}`;
      if (this.timer === 0) {
        clearInterval(this.timerID);
        this.finishGame();
      }
    }, 1000);
    this.root.innerHTML = '';
    this.root.append(this.section);
  }

  private updateGameAudiocall(correct: boolean) {
    if (correct) {
      this.answers.correct.push(this.wordNumber);
    } else {
      this.answers.wrong.push(this.wordNumber);
    }
    this.wordNumber += 1;
    if (this.wordNumber === this.words.length) {
      this.finishGame();
    } else {
      this.updateAudiocall();
    }
  }

  private showAudiocallAnswer() {
    const container = document.querySelector('.game-audio__word');
    const audioBtn = document.querySelector('.game-audio__word_sound');
    const audioBtnImg = document.querySelector('.game-audio__word_sound-img');
    const text = document.createElement('p');
    const img = document.createElement('img');
    const imgInner = document.createElement('div');
    container.classList.add('game-audio__word-show');
    audioBtn.classList.add('game-audio__word_sound-show');
    audioBtnImg.classList.add('game-audio__word_sound-img-show');
    text.textContent = this.words[this.wordNumber].word;
    text.className = 'game-audio__word_text';
    container.append(text);
    img.src = `${BASE}${this.words[this.wordNumber].image}`;
    img.className = 'game-audio__word_img';
    imgInner.className = 'game-audio__word_img-inner';
    imgInner.append(img);
    container.prepend(imgInner);
  }

  private checkAudiocall(num: number) {
    const nextBtn = Game.inst.section.querySelector('.btn-next') as HTMLElement;
    const btns: NodeListOf<HTMLElement> = Game.inst.section.querySelectorAll('.btn-answer');
    if (num !== 10 && nextBtn.dataset.next === 'false') {
      const btn = btns[num];
      if (btn.dataset.correct === 'true') {
        Game.inst.correctAnswer = true;
        Game.inst.audioCorrect.currentTime = 0;
        Game.inst.audioCorrect.play();
      } else {
        Game.inst.audioWrong.currentTime = 0;
        Game.inst.audioWrong.play();
        btn.classList.add('game-audio__btn-wrong');
      }
      nextBtn.dataset.next = 'true';
      nextBtn.textContent = 'Следующее';
      Game.inst.section.querySelector('[data-correct="true"]').classList.add('game-audio__btn-right');
      Game.inst.showAudiocallAnswer();
    } else if (num === 10) {
      if (nextBtn.dataset.next === 'true') {
        nextBtn.dataset.next = 'false';
        nextBtn.textContent = 'Не знаю';
        Game.inst.updateGameAudiocall(Game.inst.correctAnswer);
      } else {
        Game.inst.audioWrong.currentTime = 0;
        Game.inst.audioWrong.play();
        Game.inst.section.querySelector('[data-correct="true"]').classList.add('game-audio__btn-right');
        Game.inst.showAudiocallAnswer();
        nextBtn.dataset.next = 'true';
        nextBtn.textContent = 'Следующее';
      }
    }
  }

  private updateAudiocall() {
    const audio = new Audio(`${BASE}${this.words[this.wordNumber].audio}`);
    const variants = randomArrNum(this.wordNumber, this.words.length - 1);
    const element = document.createElement('div');
    this.correctAnswer = false;
    element.className = 'update-audiocall';
    element.innerHTML = `<p class="game-audio__total">Слово ${this.wordNumber + 1} / ${this.words.length}</p>
    <div class="game-audio__word">
      <div class="game-audio__word_sound">
        <img src="./assets/svg/audio.svg" alt="audio" class="game-audio__word_sound-img">
      </div>
    </div>
    <div class="game-audio__answers">
    </div>`;
    const btnAudio = element.querySelector('.game-audio__word_sound');
    btnAudio.addEventListener('click', () => {
      audio.currentTime = 0;
      audio.play();
    });
    const btnContainer = element.querySelector('.game-audio__answers');
    variants.forEach((item, i) => {
      const btn = document.createElement('button');
      btn.className = 'game-audio__btn btn-answer';
      btn.textContent = `${i + 1} ${this.words[item].wordTranslate}`;
      btn.dataset.correct = 'false';
      if (item === this.wordNumber) btn.dataset.correct = 'true';
      btn.addEventListener('click', () => {
        this.checkAudiocall(i);
      });
      btnContainer.append(btn);
    });
    const gameMain = this.section.querySelector('.game-audio');
    this.section.querySelector('.update-audiocall')?.remove();
    gameMain.prepend(element);
    setTimeout(() => audio.play(), 500);
  }

  private checkKeyAudiocall(e: KeyboardEvent) {
    e.preventDefault();
    const n = +e.key;
    if (n > 0 && n < 6) Game.inst.checkAudiocall(n - 1);
    if (e.key === 'Enter') Game.inst.checkAudiocall(10);
  }

  private renderAudiocall(arr: IWord[]) {
    this.words = arr;
    this.section = document.createElement('section');
    this.section.className = 'game';
    this.section.innerHTML = `<div class="container">
    <button class="close-game">
      <span class="close-game__span-1"></span>
      <span class="close-game__span-2"></span>
    </button>
    <button class="mute-game"></button>
    <div class="game-audio game__container">
    <button class="game-audio__btn btn-next" data-next="false">Не знаю</button>
    </div>
    </div>`;
    this.section.querySelector('.mute-game').addEventListener('click', this.toggleMute.bind(this));
    const closeBtn = this.section.querySelector('.close-game');
    closeBtn.addEventListener('click', () => {
      this.root.innerHTML = '';
      this.root.append(createMainscreen());
    });
    this.updateAudiocall();
    document.addEventListener('keydown', this.checkKeyAudiocall);
    const nextBtn = this.section.querySelector('.btn-next') as HTMLElement;
    nextBtn.addEventListener('click', () => {
      this.checkAudiocall(10);
    });
    this.root.innerHTML = '';
    this.root.append(this.section);
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
        this.root.innerHTML = '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
        let arr: IWord[];
        if (this.type === 'sprint') {
          arr = await getWordsAllGroup(item.dataset.num);
        } else {
          arr = await getWords(Number(item.dataset.num));
        }
        shuffle(arr);
        this.render(arr);
      });
    });
    const closeBtn = this.root.querySelector('.close-game');
    closeBtn.addEventListener('click', () => {
      this.root.innerHTML = '';
      this.root.append(createMainscreen());
    });
  }
}
