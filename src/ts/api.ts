import { DEFAULT_STAT, ISignIn, IUserStatistics, IWord, IWordStatistics } from './interfaces';
import { addAuthorisationListeners } from './modules/listeners';
import { createAuthorisation } from './modules/renderPage';

export const BASE = 'https://rs-lang-bckend.herokuapp.com/';
const WORDS = `${BASE}words`;

export async function getWords(group = 0, page = 0) {
  const res = await fetch(`${WORDS}?group=${group}&page=${page}`);
  const arr: IWord[] = await res.json();
  return arr;
}

export async function getWord(id: string) {
  const res = await fetch(`${WORDS}/${id}`);
  const word: IWord = await res.json();
  return word;
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

const logout = () => {
  localStorage.removeItem('login');
  sessionStorage.setItem('authorisation-state', 'login');
  const main = document.querySelector('.main');
  main.innerHTML = '';
  main.append(createAuthorisation());
  addAuthorisationListeners();
};

export const getUserWords = async (id: string, token: string) => {
  const res = await fetch(`${BASE}users/${id}/words`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (res.status === 401) {
    logout();
    throw new Error('Sign In');
  }
  const arr: IWordStatistics[] = await res.json();
  return arr;
};

export const getUserWordById = async (id: string, wordID: string, token: string) => {
  const res = await fetch(`${BASE}users/${id}/words/${wordID}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (res.status === 401) {
    logout();
    throw new Error('Sign In');
  }
  const resu = await res.json();
  delete resu.id;
  delete resu.wordId;
  const result: IWordStatistics = resu;
  return result;
};

export const createUserWord = async (id: string, wordID: string, body: IWordStatistics, token: string) => {
  const res = await fetch(`${BASE}users/${id}/words/${wordID}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  if (res.status === 401) {
    logout();
    throw new Error('Sign In');
  }
};

export const updateUserWord = async (id: string, wordID: string, body: IWordStatistics, token: string) => {
  const res = await fetch(`${BASE}users/${id}/words/${wordID}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  if (res.status === 401) {
    logout();
    throw new Error('Sign In');
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

const addWrongMessage = (text: string) => {
  const message = document.createElement('p');
  message.textContent = text;
  message.style.color = 'red';
  document.querySelector('.authorisation-modal-form').prepend(message);
  setTimeout(() => {
    message.remove();
  }, 2000);
};

export const signIn = async (email: string, password: string) => {
  const body = {
    email: email,
    password: password
  };
  const res = await fetch(`${BASE}signin`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (res.status === 403) {
    addWrongMessage('Не корректный e-mail или пароль');
    throw new Error('Incorrect e-mail or password');
  }
  if (res.status === 404) {
    addWrongMessage('Пользователь не найден');
    throw new Error('Not found');
  }
  const result: ISignIn = await res.json();
  localStorage.setItem('user', JSON.stringify(result));
  localStorage.setItem('login', '+');
};

export const checkLogin = () => {
  if (localStorage.getItem('login') === '+') {
    const user: ISignIn = JSON.parse(localStorage.getItem('user'));
    getUserWords(user.userId, user.token);
  }
};

export const getUserStatistics = async (id: string, token: string) => {
  const res = await fetch(`${BASE}users/${id}/statistics`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (res.status === 401) {
    logout();
    throw new Error('Sign In');
  }
  let stat: IUserStatistics;
  if (res.status === 404) {
    stat = DEFAULT_STAT;
  } else {
    const result = await res.json();
    delete result.id;
    stat = result;
    if (stat.optional.date !== new Date().getDate()) {
      stat = DEFAULT_STAT;
    }
  }
  return stat;
};

export const updateUserStatistics = async (id: string, token: string, body: IUserStatistics) => {
  const res = await fetch(`${BASE}users/${id}/statistics`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  if (res.status === 401) {
    logout();
    throw new Error('Sign In');
  }
};
