import { createMainscreen } from './mainscreen';
import { createTextbook } from './textbook';
import { playAudio } from './textbook';

const addTextbookListeners = async () => {
  const main = document.querySelector('.main');
  const textbookAudioBtns = document.querySelectorAll('.textbook-word-content-audiobtn');
  const groupBtns = document.querySelectorAll('.textbook-nav-item');

  textbookAudioBtns.forEach((audioBtn) => {
    audioBtn.addEventListener('click', () => {
      playAudio(audioBtn);
    });
  });

  groupBtns.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const groupNumber = +btn.getAttribute('data-num');
      main.innerHTML = '';

      const textbookContent = await createTextbook(groupNumber);
      main.append(textbookContent);
      addTextbookListeners();
    });
  });
};

export const addHeaderListeners = async () => {
  const mainscreenButton = document.querySelector('.header-home');
  const textbookButton = document.querySelector('.header-nav-textbook');

  const main = document.querySelector('.main');

  mainscreenButton.addEventListener('click', () => {
    main.innerHTML = '';
    main.append(createMainscreen());
  });

  textbookButton.addEventListener('click', async () => {
    main.innerHTML = '';

    const textbookContent = await createTextbook();
    main.append(textbookContent);
    addTextbookListeners();
  });
};
