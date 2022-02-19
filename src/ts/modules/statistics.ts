import { getUserWords, getUserWordById, createUserWord, updateUserWord } from '../api';
import { ResultGame, IWordStatistics, ISignIn } from '../interfaces';

export default class UserWords {
  userID: string;
  token: string;
  allWords: IWordStatistics[];
  allWordsID: string[];
  constructor() {
    const userInfo: ISignIn = JSON.parse(localStorage.getItem('user'));
    this.userID = userInfo.userId;
    this.token = userInfo.token;
  }
  static inst: UserWords;

  async getAllWords() {
    this.allWords = await getUserWords(this.userID, this.token);
    this.allWordsID = this.allWords.map((item) => item.optional.wordID);
  }

  parseResultGame(result: ResultGame) {
    result.forEach(async (item) => {
      if (this.allWordsID.includes(item.wordID)) {
        const word = await getUserWordById(this.userID, item.wordID, this.token);
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
        updateUserWord(this.userID, item.wordID, word, this.token);
      } else {
        const body = {
          difficulty: 'new',
          optional: {
            wordID: item.wordID,
            correctAnswers: item.correct ? 1 : 0
          }
        };
        createUserWord(this.userID, item.wordID, body, this.token);
      }
    });
  }
}
