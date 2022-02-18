import Game from '../games/gameClass';

export const createMainscreen = () => {
  Game.textbook = false;
  const mainscreenBlock = document.createElement('div');
  mainscreenBlock.classList.add('mainscreen');

  mainscreenBlock.innerHTML = `
    <h1 class="mainscreen-title title">Начните изучать английский язык уже сегодня!</h1>
    <div class="mainscreen-text">
      <h2 class="mainscreen-text-subtitle subtitle">Зачем учить английский язык?</h2>
      <ul class="mainscreen-text-reasons">
        <li class="mainscreen-text-reasons-item">
          Английский язык – один из наиболее распространённых в мире
        </li>
        <li class="mainscreen-text-reasons-item">
          Английский открывает перед тобой новые возможности
        </li>
        <li class="mainscreen-text-reasons-item">
          Английский делает тебя привлекательнее для работодателей
        </li>
        <li class="mainscreen-text-reasons-item">
          Английский язык открывает тебе путь в лучшие университеты мира
        </li>
        <li class="mainscreen-text-reasons-item">
          Английский улучшает память и помогает держать мозг в тонусе
        </li>
      </ul>

      <h2 class="mainscreen-text-subtitle subtitle"> Преимущества нашего приложения:</h2>
      <ul class="mainscreen-text-advantages">
        <li class="mainscreen-text-advantages-item">
          В нашем приложении есть готовые наборы слов с различной сложностью, чтобы Вы могли подобрать подходящий Вам уровень и прогрессировать.
        </li>
        <li class="mainscreen-text-advantages-item">
          Вы можете изучать слова при помощи учебника или мини-игр.
        </li>
        <li class="mainscreen-text-advantages-item">
          После игры слова оказываются в Вашем личном словаре.
        </li>
        <li class="mainscreen-text-advantages-item">
          Вы можете следить за своей статистикой и грамотно выстраивать процесс обучения.
        </li>
        <li class="mainscreen-text-advantages-item">
          Учитесь так, как комфортно Вам!
        </li>
      </ul>

      <h2 class="mainscreen-text-subtitle subtitle">Наша команда:</h2>
      <div class="mainscreen-text-team">
        <div class="mainscreen-text-team-item">
          <img class="mainscreen-text-team-item-img" src="./assets/img/maximFed91-avatar.png" alt="maximFed">
          <a href="https://github.com/MaximFed91" class="mainscreen-text-team-item-link">@MaximFed91</a>
          <div class="mainscreen-text-item-roles">
            <span class="mainscreen-text-team-item-role">backend</span>
            <span class="mainscreen-text-team-item-role">аудиовызов</span>
            <span class="mainscreen-text-team-item-role">спринт</span>
          </div>
        </div>

        <div class="mainscreen-text-team-item">
          <img class="mainscreen-text-team-item-img" src="./assets/img/dumbus-avatar.png" alt="dumbus">
          <a href="https://github.com/dumbus" class="mainscreen-text-team-item-link">@Dumbus</a>
          <div class="mainscreen-text-item-roles">
            <span class="mainscreen-text-team-item-role">teamlead</span>
            <span class="mainscreen-text-team-item-role">главная</span>
            <span class="mainscreen-text-team-item-role">учебник</span>
            <span class="mainscreen-text-team-item-role">словарь</span>
          </div>
        </div>
      </div>
    </div>
  `;

  return mainscreenBlock;
};
