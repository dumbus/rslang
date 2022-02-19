import { IWord, IWordStatistics } from './interfaces';

export const BASE = 'https://rs-lang-bckend.herokuapp.com/';
const WORDS = `${BASE}words`;

export async function getWords(group = 0, page = 0) {
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

export const getUserWords = async (id: string) => {
  const res = await fetch(`${BASE}users/${id}/words`);
  const arr: IWordStatistics[] = await res.json();
  return arr;
};

export const getUserWordById = async (id: string, wordID: string) => {
  const res = await fetch(`${BASE}users/${id}/words/${wordID}`);
  const result: IWordStatistics = await res.json();
  return result;
};

export const createUserWord = async (id: string, wordID: string, body: IWordStatistics) => {
  const res = await fetch(`${BASE}users/${id}/words/${wordID}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (res.status === 401) {
    console.log('login');
  }
};

export const updateUserWord = async (id: string, wordID: string, body: IWordStatistics) => {
  const res = await fetch(`${BASE}users/${id}/words/${wordID}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (res.status === 401) {
    console.log('login');
  }
};

export const createUser = async (name: string, email: string, password: string) => {
  const body = {
    name: name,
    email: email,
    password: password
  };
  const res = await fetch(`${BASE}users`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (res.status === 422) {
    console.log('Incorrect e-mail or password');
  }
};
