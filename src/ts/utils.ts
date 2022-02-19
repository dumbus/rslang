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
  overlay.classList.add('overlay');

  overlay.innerHTML = `
    <div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  `;

  main.append(overlay);

  setTimeout(() => {
    overlay.remove();
  }, 500);
};
