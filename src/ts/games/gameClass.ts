import { IDescriptGame, IWord } from '../interfaces';

export default class Game {
  type: 'sprint' | 'audiocall';
  description: IDescriptGame;
  constructor(type: 'sprint' | 'audiocall') {
    this.type = type;
    this.description = type === 'sprint' ? SPRINT_DESCRIPTION : AUDIOCALL_DESCRIPTION;
  }

  private renderSprint(words: IWord[]) {}

  startPage() {}
}
