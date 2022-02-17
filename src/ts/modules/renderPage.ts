import { createMainscreen } from './mainscreen';
import { addHeaderListeners } from './listeners';

const createHeader = () => {
  const headerBlock = document.createElement('header');
  headerBlock.classList.add('header');

  headerBlock.innerHTML = `
    <div class="header-home">RS Lang</div>
    <nav class="header-nav">
      <div class="header-nav-textbook button">Учебник</div>
      <div class="header-nav-stats button">Статистика</div>
      <div class="header-nav-audio button">Аудиовызов</div>
      <div class="header-nav-sprint button">Спринт</div>
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

export const renderPage = async () => {
  const container = document.querySelector('.container');
  const main = document.querySelector('.main');

  const headerBlock = createHeader();
  const footerBlock = createFooter();
  const mainscreenBlock = createMainscreen();
  // const textbookBlock = await createTextbook(0, 0);

  container.prepend(headerBlock);
  container.append(footerBlock);
  main.append(mainscreenBlock);

  addHeaderListeners();
};
