import Game from '../games/gameClass';
import { createMainscreen } from './mainscreen';
import { createTextbook } from './textbook';
import { playAudio } from './textbook';
import { addLoader } from '../utils';

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

export const addHeaderListeners = async () => {
  const mainscreenButton = document.querySelector('.header-home');
  const textbookButton = document.querySelector('.header-nav-textbook');
  const sprintButton = document.querySelector('.header-nav-sprint');
  const aydiocallButton = document.querySelector('.header-nav-audio');

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
    Game.inst.startPage();
  });
};
