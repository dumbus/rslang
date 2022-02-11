import { IWord } from './interfaces';

const BASE = 'https://rs-lang-bckend.herokuapp.com/';
const WORDS = `${BASE}words`;

export async function getWords(group = '0', page = '0') {
  const res = await fetch(`${WORDS}?group=${group}&page=${page}`);
  const arr: IWord[] = await res.json();
  return arr;
}

export async function getWordsAllGroup(group = '0') {
  const arr = [];
  for (let i = 0; i < 30; i += 1) {
    arr.push(fetch(`${WORDS}?group=${group}&page=${i}`));
  }
  const resultArr = await Promise.all(arr);
  const res: IWord[][] = [];
  for (let i = 0; i < 30; i += 1) {
    res.push(await resultArr[i].json());
  }
  const result: IWord[] = [].concat(...res);
  return result;
}
