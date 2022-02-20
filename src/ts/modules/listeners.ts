import Game from '../games/gameClass';
import { createMainscreen } from './mainscreen';
import { createTextbook } from './textbook';
import { playAudio } from './textbook';
import { addLoader, makeWordDifficult, makeWordLearned, makeWordNew, disableButtonsForLearnedPages } from '../utils';
import { createAuthorisation, createProfile } from './renderPage';
import { createUser, getUserStatistics, signIn } from '../api';
import { ISignIn, IUserStatistics } from '../interfaces';
import { createStatistic } from './statistics';

const addTextbookListeners = async () => {
  const isAuthorized = Boolean(localStorage.getItem('login'));
  const main = document.querySelector('.main');
  const textbookAudioBtns = document.querySelectorAll('.textbook-word-content-audiobtn');
  const groupBtns = document.querySelectorAll('.textbook-nav-item');
  const prevPageBtn = document.querySelector('.textbook-pages-item-prev');
  const nextPageBtn = document.querySelector('.textbook-pages-item-next');

  textbookAudioBtns.forEach((audioBtn) => {
    audioBtn.addEventListener('click', () => {
      playAudio(audioBtn);
    });
  });

  groupBtns.forEach((btn) => {
    btn.addEventListener('click', async () => {
      main.querySelector('div').classList.add('hidden');
      addLoader();
      const groupNumber = +btn.getAttribute('data-num');

      const textbookContent = await createTextbook(groupNumber);
      main.innerHTML = '';
      main.append(textbookContent);
      addTextbookListeners();
    });
  });

  prevPageBtn.addEventListener('click', async () => {
    main.querySelector('div').classList.add('hidden');
    addLoader();
    const currentGroup = +sessionStorage.getItem('rs-group');
    const currentPage = +sessionStorage.getItem('rs-page');

    const textbookContent = await createTextbook(currentGroup, currentPage - 1);
    main.innerHTML = '';
    main.append(textbookContent);
    addTextbookListeners();
  });

  nextPageBtn.addEventListener('click', async () => {
    main.querySelector('div').classList.add('hidden');
    addLoader();
    const currentGroup = +sessionStorage.getItem('rs-group');
    const currentPage = +sessionStorage.getItem('rs-page');

    addLoader();
    const textbookContent = await createTextbook(currentGroup, currentPage + 1);
    main.innerHTML = '';
    main.append(textbookContent);
    addTextbookListeners();
  });

  if (isAuthorized) {
    const START_ID_INDEX_FOR_DIFFICULT = 10;
    const START_ID_INDEX_FOR_LEARNED = 8;
    const difficultButtons = document.querySelectorAll('.textbook-word-content-btns-difficult');
    const learnedButtons = document.querySelectorAll('.textbook-word-content-btns-learned');
    const removeButtons = document.querySelectorAll('.textbook-word-content-btns-remove');

    difficultButtons.forEach(async (button) => {
      button.addEventListener('click', async () => {
        const currentWordId = button.getAttribute('id').slice(START_ID_INDEX_FOR_DIFFICULT);
        const difficulty = button.getAttribute('data-difficulty');
        await makeWordDifficult(currentWordId, difficulty);
        const currentButton = button as HTMLButtonElement;
        currentButton.disabled = true;
        const currentLearnedButton = <HTMLButtonElement>document.querySelector(`#learned-${currentWordId}`);
        currentLearnedButton.disabled = false;
        disableButtonsForLearnedPages();
      });
    });

    learnedButtons.forEach(async (button) => {
      button.addEventListener('click', async () => {
        const currentWordId = button.getAttribute('id').slice(START_ID_INDEX_FOR_LEARNED);
        const difficulty = button.getAttribute('data-difficulty');
        await makeWordLearned(currentWordId, difficulty);
        const currentButton = button as HTMLButtonElement;
        currentButton.disabled = true;
        const currentDifficultButton = <HTMLButtonElement>document.querySelector(`#difficult-${currentWordId}`);
        currentDifficultButton.disabled = false;
        disableButtonsForLearnedPages();
      });
    });

    removeButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        const currentWordId = button.getAttribute('id').slice(START_ID_INDEX_FOR_DIFFICULT);
        await makeWordNew(currentWordId);
      });
    });
  }

  disableButtonsForLearnedPages();
};

export const addAuthorisationListeners = () => {
  const changeAuthorisationStateButton = document.querySelector('.authorisation-modal-state');
  let authorisationState = sessionStorage.getItem('authorisation-state');

  const main = document.querySelector('.main');

  changeAuthorisationStateButton.addEventListener('click', () => {
    if (authorisationState === 'registration') {
      authorisationState = 'login';
    } else {
      authorisationState = 'registration';
    }

    sessionStorage.setItem('authorisation-state', authorisationState);
    const authorisationContent = createAuthorisation();
    main.innerHTML = '';
    main.append(authorisationContent);
    addAuthorisationListeners();
  });

  const authorisationButton = document.querySelector('.authorisation-modal-form-submit');
  const inputName: HTMLInputElement = document.querySelector('.authorisation-modal-form-name');
  const inputEmail: HTMLInputElement = document.querySelector('.authorisation-modal-form-email');
  const inputPassword: HTMLInputElement = document.querySelector('.authorisation-modal-form-password');
  authorisationButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = inputEmail.value;
    const password = inputPassword.value;
    if (sessionStorage.getItem('authorisation-state') === 'registration') {
      await createUser(inputName.value, email, password);
    }
    await signIn(email, password);
    main.innerHTML = '';
    main.append(createMainscreen());
  });
};

export const addProfileListeners = () => {
  const exitBtn = document.querySelector('.profile-logout');
  const main = document.querySelector('.main');
  exitBtn.addEventListener('click', () => {
    localStorage.clear();
    sessionStorage.clear();
    main.innerHTML = '';
    main.append(createMainscreen());
  });
};

export const addHeaderListeners = async () => {
  const mainscreenButton = document.querySelector('.header-home');
  const textbookButton = document.querySelector('.header-nav-textbook');
  const sprintButton = document.querySelector('.header-nav-sprint');
  const audiocallButton = document.querySelector('.header-nav-audio');
  const authorisationButton = document.querySelector('.header-nav-authorisation');
  const statsBtn = document.querySelector('.header-nav-stats');

  const main = document.querySelector('.main');

  mainscreenButton.addEventListener('click', () => {
    main.innerHTML = '';
    main.append(createMainscreen());
  });

  textbookButton.addEventListener('click', async () => {
    main.querySelector('div').classList.add('hidden');
    addLoader();

    const textbookContent = await createTextbook();
    main.innerHTML = '';
    main.append(textbookContent);
    addTextbookListeners();
  });

  sprintButton.addEventListener('click', () => {
    Game.inst = new Game('sprint');
    if (Game.textbook) {
      Game.inst.render(Game.arrWords);
    } else {
      Game.inst.startPage();
    }
  });

  audiocallButton.addEventListener('click', () => {
    Game.inst = new Game('audiocall');
    if (Game.textbook) {
      Game.inst.render(Game.arrWords);
    } else {
      Game.inst.startPage();
    }
  });

  authorisationButton.addEventListener('click', () => {
    const isAutorised = Boolean(localStorage.getItem('login'));
    let authorisationBlock: Element;
    // eslint-disable-next-line @typescript-eslint/ban-types
    let addListeners: Function;

    if (isAutorised) {
      authorisationBlock = createProfile();
      addListeners = addProfileListeners;
    } else {
      authorisationBlock = createAuthorisation();
      addListeners = addAuthorisationListeners;
    }

    main.innerHTML = '';
    main.append(authorisationBlock);
    addListeners();
  });

  statsBtn?.addEventListener('click', async () => {
    if (localStorage.getItem('login') === '+') {
      addLoader();
      const userInfo: ISignIn = JSON.parse(localStorage.getItem('user'));
      const stat: IUserStatistics = await getUserStatistics(userInfo.userId, userInfo.token);
      main.innerHTML = '';
      main.append(createStatistic(stat));
    } else {
      main.innerHTML = '';
      main.append(createAuthorisation());
      addAuthorisationListeners();
    }
  });
};
