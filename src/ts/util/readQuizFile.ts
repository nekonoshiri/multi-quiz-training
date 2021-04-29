'use strict';

import { Quiz } from 'class/Quiz';
import { flatten } from 'util/array';
import { isArrayOfType } from 'util/common';

export class SchemaError implements Error {
  readonly name = 'SchemaError';
  constructor(readonly message: string = '') {};
  toString() {
    return this.name + (this.message === '' ? '' : `: ${this.message}`);
  }
}

/**
 * @throws SyntaxError from JSON.parse when the JSON is invalid.
 * @throws SchemaError when the JSON does not satisfy the schema.
 */
export const parseQuizFile = (content: string): Quiz[] => {
  const quizDataJSONArray: any = JSON.parse(content);

  if (! Array.isArray(quizDataJSONArray)) {
    throw new SchemaError();
  }

  if (! quizDataJSONArray.every(q =>
    (typeof q.question === 'string'
      && isArrayOfType('string', q.answers)
      && isArrayOfType('string', q.dummies))
  )) {
    throw new SchemaError();
  }

  return(
    quizDataJSONArray.map(q => new Quiz(q.question, q.answers, q.dummies))
  );
};

export const readQuizFile = (f: File): Promise<Quiz[]> =>
  new Promise((resolve, reject) => {
    if (!f.type.match(/(text.*)|(application\/json)/)) {
      return reject(
        new Error('JSON ファイルかテキストファイルを選択してください')
      );
    }

    const fileReader = new FileReader();
    fileReader.onload = e => {
      if (e.target && typeof e.target.result == "string") {
        try {
          resolve(parseQuizFile(e.target.result));
        } catch(_) {
          reject(new Error('ファイル形式が正しくありません'))
        }
      } else {
        reject(new Error('File is null'));
      }
    };

    fileReader.onabort = reject;
    fileReader.onerror = reject;
    fileReader.readAsText(f);
  });

export const readQuizFiles = (fileList: FileList): Promise<Quiz[]> =>
  Promise.all(Array.from(fileList).map(readQuizFile)).then(flatten);
