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

export const createProgressLabel = (answers: number) => {
  const label = document.createElement('div');
  label.classList.add('label');

  if (answers !== 0) {
    label.classList.add('label-learned');
    label.textContent = 'Верно';
  } else {
    label.classList.add('label-difficult');
    label.textContent = 'Неверно';
  }

  return label;
};
