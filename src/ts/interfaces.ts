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
