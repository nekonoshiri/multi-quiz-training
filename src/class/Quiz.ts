'use strict';

import { shuffled } from 'util/array';

export class Quiz {
  private readonly _question: string;
  private readonly _answers: [string, boolean][];

  constructor(question: string, answers: [string, boolean][]);
  constructor(question: string, answers: string[], dummies: string[]);
  constructor(question: string, answers: any[], dummies?: string[]) {
    this._question = question;
    this._answers = dummies
      ? answers.map(x => [x, true]).concat(dummies.map(x => [x, false]))
      : answers;
  }

  get question(): string {
    return this._question;
  }

  get answers(): [string, boolean][] {
    return this._answers;
  }

  get answerTexts(): string[] {
    return this._answers.map(([t, _]) => t);
  }

  get answerTFs(): boolean[] {
    return this._answers.map(([_, tf]) => tf);
  }

  get shuffled(): Quiz {
    return new Quiz(this._question, shuffled(this._answers));
  }
}
