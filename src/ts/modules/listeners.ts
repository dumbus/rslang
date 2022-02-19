import Game from '../games/gameClass';
import { createMainscreen } from './mainscreen';
import { createTextbook } from './textbook';
import { playAudio } from './textbook';
import { addLoader } from '../utils';
import { createAuthorisation, createProfile } from './renderPage';

const addTextbookListeners = async () => {
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
};

export const addHeaderListeners = async () => {
  const mainscreenButton = document.querySelector('.header-home');
  const textbookButton = document.querySelector('.header-nav-textbook');
  const sprintButton = document.querySelector('.header-nav-sprint');
  const audiocallButton = document.querySelector('.header-nav-audio');
  const authorisationButton = document.querySelector('.header-nav-authorisation');

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

    if (isAutorised) {
      authorisationBlock = createProfile();
    } else {
      authorisationBlock = createAuthorisation();
    }

    main.innerHTML = '';
    main.append(authorisationBlock);
    addAuthorisationListeners();
  });
};
