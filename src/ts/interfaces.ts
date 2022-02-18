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
  correctAnswers: number;
}

export interface IWordStatistics {
  difficulty: string;
  optional: IWordOptional;
}
