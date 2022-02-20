import { IWord } from '../interfaces';
import { getWords, getUserWords } from '../api';
import Game from '../games/gameClass';
import { createDifficultyLabel } from '../utils';

const base = 'https://rs-lang-bckend.herokuapp.com';

const createWord = (wordData: IWord, difficulty = 'none', correctAnswers = -1) => {
  const isAuthorized = Boolean(localStorage.getItem('login'));
  const wordBlock = document.createElement('div');
  wordBlock.classList.add('textbook-word');

  const {
    id,
    word,
    wordTranslate,
    image,
    textMeaning,
    textExample,
    transcription,
    textExampleTranslate,
    textMeaningTranslate,
    audio,
    audioMeaning,
    audioExample
  } = wordData;

  wordBlock.innerHTML = `
    <img class="textbook-word-img" src="${base}/${image}" alt="${word}">
    <div class="textbook-word-content">
      <div class="textbook-word-content-title">${word} - ${transcription} - ${wordTranslate}</div>
      <div class="textbook-word-content-meaning">
        ${textMeaning} - ${textMeaningTranslate}
      </div>
      <div class="textbook-word-content-example">
        ${textExample} - ${textExampleTranslate}
      </div>
      <div class="textbook-word-content-audiobtn button" id="${id}" data-word="${base}/${audio}" data-meaning="${base}/${audioMeaning}" data-example="${base}/${audioExample}">
        <img src="./assets/svg/headphones.svg" alt="audio">
      </div>
    </div>
  `;

  const wordContent = wordBlock.querySelector('.textbook-word-content');

  if (isAuthorized) {
    const buttons = document.createElement('div');
    buttons.classList.add('textbook-word-content-btns');

    buttons.innerHTML = `
      <div class="textbook-word-content-btns-item textbook-word-content-btns-difficult button">Сложное слово</div>
      <div class="textbook-word-content-btns-item textbook-word-content-btns-learned button">Изученное слово</div>
    `;

    if (difficulty !== 'none') {
      const labels = document.createElement('div');
      labels.classList.add('textbook-word-content-labels');

      if (difficulty !== 'new') {
        labels.append(createDifficultyLabel(difficulty));
      }

      if (correctAnswers === 0) {
        wordBlock.classList.add('textbook-word-incorrect');
      } else {
        wordBlock.classList.add('textbook-word-correct');
      }
      wordContent.prepend(labels);
    }

    wordContent.append(buttons);
  }

  return wordBlock;
};

export const playAudio = (audioBtn: Element) => {
  const audioArr: string[] = [];

  audioArr.push(audioBtn.getAttribute('data-word'));
  audioArr.push(audioBtn.getAttribute('data-meaning'));
  audioArr.push(audioBtn.getAttribute('data-example'));

  const audioBlock = document.querySelector('audio');
  let currentSong = 0;
  audioBlock.src = audioArr[currentSong];
  audioBlock.play();

  audioBlock.onended = () => {
    if (currentSong === audioArr.length - 1) {
      return;
    } else {
      currentSong++;
    }

    audioBlock.src = audioArr[currentSong];
    audioBlock.play();
  };
};

const createWords = async (group: number, page: number) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const { userId, token } = userData;
  const wordsBlock = document.createElement('div');
  wordsBlock.classList.add('.textbook-words');

  const usualResponse = await getWords(group, page);
  const userResponse = await getUserWords(userId, token);

  const userWordsIds: string[] = [];
  const userWordsDifficulties: string[] = [];
  const userWordsAnswers: number[] = [];

  userResponse.forEach((userWordData) => {
    userWordsIds.push(userWordData.optional.wordID);
    userWordsDifficulties.push(userWordData.difficulty);
    userWordsAnswers.push(userWordData.optional.correctAnswers);
  });

  Game.arrWords = usualResponse;
  Game.textbook = true;

  usualResponse.forEach(async (word: IWord) => {
    let wordBlock: HTMLDivElement;
    const index = userWordsIds.indexOf(word.id);

    if (index !== -1) {
      wordBlock = await createWord(word, userWordsDifficulties[index], userWordsAnswers[index]);
    } else {
      wordBlock = await createWord(word);
    }

    wordsBlock.append(wordBlock);
  });

  return wordsBlock;
};

export const createTextbook = async (group = 0, page = 0) => {
  sessionStorage.setItem('rs-group', String(group));
  sessionStorage.setItem('rs-page', String(page));
  const textbookBlock = document.createElement('div');
  textbookBlock.classList.add('textbook');

  textbookBlock.innerHTML = `
    <nav class="textbook-nav">
      <div class="textbook-nav-item" data-num="0">Группа 1</div>
      <div class="textbook-nav-item" data-num="1">Группа 2</div>
      <div class="textbook-nav-item" data-num="2">Группа 3</div>
      <div class="textbook-nav-item" data-num="3">Группа 4</div>
      <div class="textbook-nav-item" data-num="4">Группа 5</div>
      <div class="textbook-nav-item" data-num="5">Группа 6</div>
    </nav>
    <h1 class="textbook-title title">Группа ${group + 1}</h1>
    <h2 class="textbook-subtitle subtitle">Страница ${page + 1}</h2>
    <nav class="textbook-pages">
      <button class="textbook-pages-item textbook-pages-item-prev button">< Предыдущая</button>
      <button class="textbook-pages-item textbook-pages-item-next button">Следующая ></button>
    </nav>
  `;
  textbookBlock.querySelectorAll('.textbook-nav-item')[group].classList.add('textbook-nav-item-active');
  textbookBlock.querySelector('.textbook-title').classList.add(`title-${group + 1}`);
  textbookBlock.querySelector('.textbook-subtitle').classList.add(`subtitle-${group + 1}`);

  const wordsBlock = await createWords(group, page);
  textbookBlock.append(wordsBlock);

  textbookBlock.querySelectorAll('.button').forEach((button) => {
    button.classList.add(`button-${group + 1}`);
  });

  if (page === 0) {
    const button = <HTMLButtonElement>textbookBlock.querySelector('.textbook-pages-item-prev');
    button.disabled = true;
  }

  if (page === 29) {
    const button = <HTMLButtonElement>textbookBlock.querySelector('.textbook-pages-item-next');
    button.disabled = true;
  }

  const audioBlock = document.createElement('audio');
  audioBlock.classList.add('audio');
  textbookBlock.append(audioBlock);

  return textbookBlock;
};
