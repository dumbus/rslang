import { createMainscreen } from './mainscreen';
import { createTextbook } from './textbook';
import { createStatistic } from './statistics';
import { addTextbookListeners, addHeaderListeners, addAuthorisationListeners, addProfileListeners } from './listeners';
import { addLoader, disableButtonsForLearnedPages } from '../utils';
import { ISignIn, IUserStatistics } from '../interfaces';
import { getUserStatistics } from '../api';
import Game from '../games/gameClass';

const createHeader = () => {
  const headerBlock = document.createElement('header');
  headerBlock.classList.add('header');

  headerBlock.innerHTML = `
    <div class="header-home">RS Lang</div>
    <nav class="header-nav">
      <div class="header-nav-textbook button">Учебник</div>
      <div class="header-nav-stats button">Статистика</div>
      <button class="header-nav-audio button">Аудиовызов</button>
      <button class="header-nav-sprint button">Спринт</button>
      <div class="header-nav-authorisation button">Авторизация</div>
    </nav>
  `;

  return headerBlock;
};

const createFooter = () => {
  const footerBlock = document.createElement('footer');
  footerBlock.classList.add('footer');

  footerBlock.innerHTML = `
    <a href="https://rs.school/"><img src="./assets/svg/rsschool-icon.svg" alt="rsschool" class="footer-logo"></a>
    <div class="footer-descr">Created at 2021:
      <a href="https://github.com/MaximFed91" class="footer-descr-link">@MaximFed91</a>
      <a href="https://github.com/dumbus" class="footer-descr-link">@Dumbus</a>
    </div>
  `;

  return footerBlock;
};

const createAuthorisationModal = (authorisationState: string) => {
  const authorisationModal = document.createElement('div');
  authorisationModal.classList.add('authorisation-modal');

  if (authorisationState === 'registration') {
    authorisationModal.innerHTML = `
    <div class="authorisation-modal-title">Регистрация</div>
      <form class="authorisation-modal-form">
        <input type="text" class="authorisation-modal-form-name authorisation-modal-form-input" placeholder="Имя (3 знака минимум)" minlength="3" required>
        <input type="email" class="authorisation-modal-form-email authorisation-modal-form-input" placeholder="Электронная почта" required autocomplete="email">
        <input type="password" class="authorisation-modal-form-password authorisation-modal-form-input" placeholder="Пароль" minlength="8" required>
        <button type="submit" class="authorisation-modal-form-submit button">Регистрация</button>
      </form>
      <div class="authorisation-modal-divider"></div>
    <div class="authorisation-modal-state button">Вход</div>
  `;
  } else {
    authorisationModal.innerHTML = `
    <div class="authorisation-modal-title">Вход</div>
      <form class="authorisation-modal-form">
        <input type="email" class="authorisation-modal-form-email authorisation-modal-form-input" placeholder="Электронная почта" required>
        <input type="password" class="authorisation-modal-form-password authorisation-modal-form-input" placeholder="Пароль" minlength="8" required>
        <button type="submit" class="authorisation-modal-form-submit button">Вход</button>
      </form>
      <div class="authorisation-modal-divider"></div>
    <div class="authorisation-modal-state button">Регистрация</div>
  `;
  }

  return authorisationModal;
};

export const createAuthorisation = () => {
  sessionStorage.setItem('saved-page', 'authorisation');
  let authorisationState = sessionStorage.getItem('authorisation-state');
  if (authorisationState === null) {
    authorisationState = 'registration';
    sessionStorage.setItem('authorisation-state', authorisationState);
  }
  const authorisationBlock = document.createElement('div');
  authorisationBlock.classList.add('authorisation');

  authorisationBlock.innerHTML = `
    <div class="authorisation-text">
      <h1 class="authorisation-text-title">Готовы расширить Ваши возможности?</h1>
      <h2 class="authorisation-text-subtitle">При авторизации для Вас станут доступны новые активности:</h2>
      <ul class="authorisation-text-list">
        <li class="authorisation-text-list-item">Статистика</li>
        <li class="authorisation-text-list-item">Раздел "Сложные слова"</li>
        <li class="authorisation-text-list-item">Изученные слова</li>
      </ul>
    </div>
    <div class="authorisation-modal-container">
      
    </div>
  `;
  const authorisationModalBlock = createAuthorisationModal(authorisationState);
  authorisationBlock.querySelector('.authorisation-modal-container').append(authorisationModalBlock);

  return authorisationBlock;
};

export const createProfile = () => {
  sessionStorage.setItem('saved-page', 'profile');
  const profileBlock = document.createElement('div');
  profileBlock.classList.add('profile');
  const user = JSON.parse(localStorage.getItem('user'));

  profileBlock.innerHTML = `
    <div class="profile-text">
      <h1 class="profile-title">Здравствуйте, ${user.name}!</h1>
      <h2 class="profile-subtitle">Теперь для Вас доступны новые активности:</h2>
      <ul class="profile-list">
        <li class="profile-list-item">Статистика</li>
        <li class="profile-list-item">Раздел "Сложные слова"</li>
        <li class="profile-list-item">Изученные слова</li>
      </ul>
    </div>
    <div class="profile-logout button">Выйти</div>
  `;

  return profileBlock;
};

export const renderPage = async () => {
  let pageState = sessionStorage.getItem('saved-page');
  if (pageState === null) {
    sessionStorage.setItem('saved-page', 'mainscreen');
    pageState = 'mainscreen';
  }
  const container = document.querySelector('.container');
  const main = document.querySelector('.main');

  const headerBlock = createHeader();
  const footerBlock = createFooter();

  container.prepend(headerBlock);
  container.append(footerBlock);

  if (pageState === 'mainscreen') {
    const mainscreenBlock = createMainscreen();
    main.append(mainscreenBlock);
  }

  if (pageState === 'textbook') {
    addLoader();
    const group = Number(sessionStorage.getItem('rs-group'));
    const page = Number(sessionStorage.getItem('rs-page'));
    const textbookBlock = await createTextbook(group, page);
    main.innerHTML = '';
    main.append(textbookBlock);
    await addTextbookListeners();
  }

  if (pageState === 'authorisation') {
    main.append(createAuthorisation());
    addAuthorisationListeners();
  }

  if (pageState === 'profile') {
    main.append(createProfile());
    addProfileListeners();
  }

  if (pageState === 'statistics') {
    if (localStorage.getItem('login') === '+') {
      addLoader();
      const userInfo: ISignIn = JSON.parse(localStorage.getItem('user'));
      const stat: IUserStatistics = await getUserStatistics(userInfo.userId, userInfo.token);
      main.innerHTML = '';
      main.append(createStatistic(stat));
    } else {
      main.append(createAuthorisation());
      addAuthorisationListeners();
    }
  }

  if (pageState === 'audiocall') {
    Game.inst = new Game('audiocall');
    if (Game.textbook) {
      Game.inst.render(Game.arrWords);
    } else {
      Game.inst.startPage();
    }
  }

  if (pageState === 'sprint') {
    Game.inst = new Game('sprint');
    if (Game.textbook) {
      Game.inst.render(Game.arrWords);
    } else {
      Game.inst.startPage();
    }
  }

  addHeaderListeners();
  disableButtonsForLearnedPages();
};
