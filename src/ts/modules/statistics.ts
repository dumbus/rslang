import { IUserStatistics } from '../interfaces';
import { createMainscreen } from './mainscreen';

export const createStatistic = (stat: IUserStatistics) => {
  sessionStorage.setItem('saved-page', 'statistics');
  const statisticsModal = document.createElement('div');
  statisticsModal.className = 'statistics';
  statisticsModal.innerHTML = `
    <button class="close-game statistics__close">
      <span class="close-game__span-1"></span>
      <span class="close-game__span-2"></span>
    </button>
    <h1 class="statistics-title title">Статистика</h1>
    <div class="statistics__main">
      <div class="statistics__game">
        <div class="statistics__game-sprint statistics__game-block">
          <h3 class="statistics__game-title">Спринт</h3>
          <p class="statistics__game-text">Количество новых слов за день <span>${stat.optional.sprint.newWords}</span></p>
          <p class="statistics__game-text">Процент правильных ответов <span>${stat.optional.sprint.percent}%</span></p>
          <p class="statistics__game-text">Лучший счет <span>${stat.optional.sprint.bestResult}</span></p>
        </div>
        <div class="statistics__game-audiocall statistics__game-block">
          <h3 class="statistics__game-title">Аудиовызов</h3>
          <p class="statistics__game-text">Количество новых слов за день <span>${stat.optional.audiocall.newWords}</span></p>
          <p class="statistics__game-text">Процент правильных ответов <span>${stat.optional.audiocall.percent}%</span></p>
          <p class="statistics__game-text">Самая длинная серия правильных ответов <span>${stat.optional.audiocall.bestResult}</span></p>
        </div>
      </div>
      <div class="statistics__words">
        <h3 class="statistics__words-title">Общая статистика за день</h3>
        <p class="statistics__words-text">Количество новых слов <span>${stat.optional.totalNewWord}</span></p>
        <p class="statistics__words-text">Количество изученных слов <span>${stat.learnedWords}</span></p>
        <p class="statistics__words-text">Процент правильных ответов <span>${stat.optional.totalPercent}%</span></p>
      </div>
    </div>`;
  const closeBtn = statisticsModal.querySelector('.close-game');
  const main = document.querySelector('.main');
  closeBtn.addEventListener('click', () => {
    main.innerHTML = '';
    main.append(createMainscreen());
  });
  return statisticsModal;
};
