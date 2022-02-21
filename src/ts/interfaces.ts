export interface IWord {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}
export interface IDescriptGame {
  title: string;
  text: string;
}

export interface IWordOptional {
  wordID: string;
  correctAnswers: number;
}

export interface IWordStatistics {
  difficulty: string;
  optional: IWordOptional;
}

export type ResultGame = {
  wordID: string;
  correct: boolean;
}[];

export interface ISignIn {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export interface IGameStatistics {
  newWords: number;
  percent: number;
  bestResult: number;
  totalAnswers: number;
  totalRight: number;
}
export interface IStatistics {
  sprint: IGameStatistics;
  audiocall: IGameStatistics;
  totalNewWord: number;
  totalPercent: number;
  date: number;
}
export interface IUserStatistics {
  learnedWords: number;
  optional: IStatistics;
}

export const DEFAULT_STAT: IUserStatistics = {
  learnedWords: 0,
  optional: {
    sprint: {
      newWords: 0,
      percent: 0,
      bestResult: 0,
      totalAnswers: 0,
      totalRight: 0
    },
    audiocall: {
      newWords: 0,
      percent: 0,
      bestResult: 0,
      totalAnswers: 0,
      totalRight: 0
    },
    totalNewWord: 0,
    totalPercent: 0,
    date: 0
  }
};
