import { getUserWords, getUserWordById, createUserWord, updateUserWord } from '../api';
import { ResultGame, IWordStatistics } from '../interfaces';

export default class UserWords {
  userID: string;
  allWords: IWordStatistics[];
  allWordsID: string[];
  constructor(userID: string) {
    this.userID = userID;
  }
  static inst: UserWords;

  async getAllWords() {
    this.allWords = await getUserWords(this.userID);
    this.allWordsID = this.allWords.map((item) => item.optional.wordID);
  }

  parseResultGame(result: ResultGame) {
    result.forEach(async (item) => {
      if (this.allWordsID.includes(item.wordID)) {
        const word = await getUserWordById(this.userID, item.wordID);
        if (item.correct) {
          if (word.difficulty === 'new') {
            word.optional.correctAnswers += 1;
            if (word.optional.correctAnswers === 3) word.difficulty = 'done';
          }
          if (word.difficulty === 'difficult') {
            word.optional.correctAnswers += 1;
            if (word.optional.correctAnswers === 5) word.difficulty = 'done';
          }
        } else {
          word.optional.correctAnswers = 0;
          word.difficulty = word.difficulty === 'difficult' ? 'difficult' : 'new';
        }
        updateUserWord(this.userID, item.wordID, word);
      } else {
        const body = {
          difficulty: 'new',
          optional: {
            wordID: item.wordID,
            correctAnswers: item.correct ? 1 : 0
          }
        };
        createUserWord(this.userID, item.wordID, body);
      }
    });
  }
}
