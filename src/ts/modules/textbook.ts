import { IWord, IWordStatistics } from '../interfaces';
import { getWords, getUserWords, getWord } from '../api';
import Game from '../games/gameClass';
import { createDifficultyLabel } from '../utils';

const base = 'https://rs-lang-bckend.herokuapp.com';

const createWord = (wordData: IWord, difficulty = 'none', correctAnswers = -1) => {
  const isAuthorized = Boolean(localStorage.getItem('login'));
  const group = Number(sessionStorage.getItem('rs-group'));
  const wordBlock = document.createElement('div');
  wordBlock.classList.add('textbook-word');
  wordBlock.setAttribute('id', `word-${wordData.id}`);

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

  wordBlock.setAttribute('data-difficulty', difficulty);
  const wordContent = wordBlock.querySelector('.textbook-word-content');

  if (isAuthorized) {
    const buttons = document.createElement('div');
    buttons.classList.add('textbook-word-content-btns');

    const labels = document.createElement('div');
    labels.classList.add('textbook-word-content-labels');

    buttons.innerHTML = `
      <button class="textbook-word-content-btns-item textbook-word-content-btns-difficult button">Сложное слово</button>
      <button class="textbook-word-content-btns-item textbook-word-content-btns-learned button">Изученное слово</button>
      <button class="textbook-word-content-btns-item textbook-word-content-btns-remove button">Удалить из сложных</button>
    `;

    const difficultButton = <HTMLButtonElement>buttons.querySelector('.textbook-word-content-btns-difficult');
    const learnedButton = <HTMLButtonElement>buttons.querySelector('.textbook-word-content-btns-learned');
    const removeButton = <HTMLButtonElement>buttons.querySelector('.textbook-word-content-btns-remove');

    difficultButton.setAttribute('id', `difficult-${wordData.id}`);
    difficultButton.setAttribute('data-difficulty', difficulty);
    learnedButton.setAttribute('id', `learned-${wordData.id}`);
    learnedButton.setAttribute('data-difficulty', difficulty);
    removeButton.setAttribute('id', `difficult-${wordData.id}`);
    removeButton.setAttribute('data-difficulty', difficulty);

    if (difficulty !== 'none') {
      if (difficulty !== 'new') {
        labels.append(createDifficultyLabel(difficulty));
      }

      if (difficulty === 'difficult') {
        difficultButton.disabled = true;
      }

      if (difficulty === 'done') {
        learnedButton.disabled = true;
      }

      if (correctAnswers === 0) {
        wordBlock.classList.add('textbook-word-incorrect');
      } else {
        wordBlock.classList.add('textbook-word-correct');
      }
    }

    if (group === 6) {
      difficultButton.style.display = 'none';
      learnedButton.style.display = 'none';
    } else {
      removeButton.style.display = 'none';
    }

    wordContent.prepend(labels);
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
  const isAuthorized = Boolean(localStorage.getItem('login'));
  const wordsBlock = document.createElement('div');
  wordsBlock.classList.add('textbook-words');

  const userWordsIds: string[] = [];
  const userWordsDifficulties: string[] = [];
  const userWordsAnswers: number[] = [];

  if (isAuthorized) {
    const userData = JSON.parse(localStorage.getItem('user'));
    const { userId, token } = userData;
    if (group === 6) {
      const userResponse = await getUserWords(userId, token);
      const difficultWords: IWordStatistics[] = [];

      userResponse.forEach((word) => {
        if (word.difficulty === 'difficult') {
          difficultWords.push(word);
        }
      });

      if (difficultWords.length === 0) {
        const noneWordsBlock = document.createElement('div');
        noneWordsBlock.classList.add('textbook-words-none');
        noneWordsBlock.textContent = 'Вы ещё не добавили слова в раздел сложных...';
        wordsBlock.append(noneWordsBlock);
      }

      for (const difficultWordData of difficultWords) {
        const wordData = await getWord(difficultWordData.optional.wordID);
        const wordBlock = createWord(wordData, 'difficult', difficultWordData.optional.correctAnswers);
        wordsBlock.append(wordBlock);
      }
    } else {
      const usualResponse = await getWords(group, page);
      const userResponse = await getUserWords(userId, token);

      userResponse.forEach((userWordData) => {
        userWordsIds.push(userWordData.optional.wordID);
        userWordsDifficulties.push(userWordData.difficulty);
        userWordsAnswers.push(userWordData.optional.correctAnswers);
      });

      Game.arrWords = usualResponse;
      Game.textbook = true;

      usualResponse.forEach((word: IWord) => {
        let wordBlock: HTMLDivElement;
        const index = userWordsIds.indexOf(word.id);

        if (index !== -1) {
          wordBlock = createWord(word, userWordsDifficulties[index], userWordsAnswers[index]);
        } else {
          wordBlock = createWord(word);
        }

        wordsBlock.append(wordBlock);
      });
    }
  } else {
    const response = await getWords(group, page);

    response.forEach((word) => {
      wordsBlock.append(createWord(word));
    });
  }
  return wordsBlock;
};

export const createTextbook = async (group = 0, page = 0) => {
  const isAuthorized = Boolean(localStorage.getItem('login'));
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

  if (group === 6) {
    const pagesBtns = <HTMLElement>textbookBlock.querySelector('.textbook-pages');
    const pageSubtitle = <HTMLElement>textbookBlock.querySelector('.textbook-subtitle');
    const pageTitle = <HTMLElement>textbookBlock.querySelector('.textbook-title');

    pagesBtns.style.display = 'none';
    pageSubtitle.style.display = 'none';
    pageTitle.textContent = 'Сложные слова';
  }

  const wordsBlock = await createWords(group, page);
  textbookBlock.append(wordsBlock);

  if (isAuthorized) {
    const textbookNavigation = textbookBlock.querySelector('.textbook-nav');
    const textbookNavigationDifficult = document.createElement('div');
    textbookNavigationDifficult.classList.add('textbook-nav-item');
    textbookNavigationDifficult.setAttribute('data-num', String(6));
    textbookNavigationDifficult.textContent = 'Сложные слова';
    textbookNavigation.append(textbookNavigationDifficult);
  }

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

  textbookBlock.querySelector('.textbook-title').classList.add(`title-${group + 1}`);
  textbookBlock.querySelector('.textbook-subtitle').classList.add(`subtitle-${group + 1}`);
  textbookBlock.querySelectorAll('.textbook-nav-item')[group].classList.add('textbook-nav-item-active');

  const audioBlock = document.createElement('audio');
  audioBlock.classList.add('audio');
  textbookBlock.append(audioBlock);

  return textbookBlock;
};
