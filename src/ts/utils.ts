import { getUserWordById, updateUserWord, createUserWord } from './api';
import { IWordStatistics } from './interfaces';

export function shuffle(array: unknown[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function randomInteger(min: number, max: number) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

export function randomNoRepeatNum(num: number, max: number) {
  let n = randomInteger(0, max);
  if (n === num) {
    n = randomNoRepeatNum(num, max);
  }
  return n;
}

export function randomArrNum(num: number, max: number) {
  const arr = [num];
  while (arr.length < 5) {
    const n = randomInteger(0, max);
    if (!arr.includes(n)) arr.push(n);
  }
  shuffle(arr);
  return arr;
}

export const addLoader = () => {
  const main = <HTMLElement>document.querySelector('.main');
  const overlay = document.createElement('div');
  overlay.classList.add('overlay-loader');

  overlay.innerHTML = `
    <div class="lds-ring-loader">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  `;

  main.append(overlay);
};

export const createDifficultyLabel = (difficulty: string) => {
  const label = document.createElement('div');
  label.classList.add('textbook-word-content-labels-item');
  label.classList.add('label');

  switch (difficulty) {
    case 'difficult':
      label.classList.add('label-difficult');
      label.textContent = 'Сложное';
      break;
    case 'done':
      label.classList.add('label-learned');
      label.textContent = 'Изученное';
      break;
  }

  return label;
};

export const makeWordDifficult = async (currentWordId: string, difficulty: string) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const { userId, token } = userData;
  let body: IWordStatistics;
  const currentWordBlock = document.querySelector(`#word-${currentWordId}`);

  if (difficulty !== 'none') {
    body = await getUserWordById(userId, currentWordId, token);
    body.difficulty = 'difficult';

    await updateUserWord(userId, currentWordId, body, token);
    if (body.optional.correctAnswers !== 0) {
      currentWordBlock.classList.remove('textbook-word-incorrect');
      currentWordBlock.classList.add('textbook-word-correct');
    } else {
      currentWordBlock.classList.remove('textbook-word-correct');
      currentWordBlock.classList.add('textbook-word-incorrect');
    }
  } else {
    body = {
      difficulty: 'difficult',
      optional: {
        wordID: currentWordId,
        correctAnswers: 0
      }
    };
    await createUserWord(userId, currentWordId, body, token);
    currentWordBlock.classList.remove('textbook-word-correct');
    currentWordBlock.classList.add('textbook-word-incorrect');
  }

  const currentWordLabels = currentWordBlock.querySelector('.textbook-word-content-labels');
  currentWordLabels.innerHTML = '';
  currentWordLabels.append(createDifficultyLabel('difficult'));
};

export const makeWordLearned = async (currentWordId: string, difficulty: string) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const { userId, token } = userData;
  let body: IWordStatistics;

  if (difficulty !== 'none') {
    body = await getUserWordById(userId, currentWordId, token);
    body.difficulty = 'done';
    body.optional.correctAnswers = 1;

    await updateUserWord(userId, currentWordId, body, token);
  } else {
    body = {
      difficulty: 'done',
      optional: {
        wordID: currentWordId,
        correctAnswers: 1
      }
    };
    await createUserWord(userId, currentWordId, body, token);
  }

  const currentWordBlock = document.querySelector(`#word-${currentWordId}`);
  currentWordBlock.classList.remove('textbook-word-incorrect');
  currentWordBlock.classList.add('textbook-word-correct');
  const currentWordLabels = currentWordBlock.querySelector('.textbook-word-content-labels');
  currentWordLabels.innerHTML = '';
  currentWordLabels.append(createDifficultyLabel('done'));
};

export const makeWordNew = async (currentWordId: string) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const { userId, token } = userData;

  const body = await getUserWordById(userId, currentWordId, token);
  body.difficulty = 'new';

  await updateUserWord(userId, currentWordId, body, token);

  const currentWordBlock = document.querySelector(`#word-${currentWordId}`);
  currentWordBlock.remove();
};
