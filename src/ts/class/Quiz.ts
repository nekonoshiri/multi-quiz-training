'use strict';

import { shuffled } from 'util/array';

export class Quiz {
  private readonly _question: string;
  private readonly _options: [string, boolean][];

  constructor(question: string, options: [string, boolean][]);
  constructor(question: string, t_options: string[], f_options: string[]);
  constructor(question: string, arr: any[], f_options?: string[]) {
    this._question = question;
    this._options = f_options
      ? arr.map(x => [x, true]).concat(f_options.map(x => [x, false]))
      : arr;
  }

  get question(): string {
    return this._question;
  }

  get options(): [string, boolean][] {
    return this._options;
  }

  get t_options(): [string, boolean][] {
    return this._options.filter(([_, b]) => b);
  }

  get f_options(): [string, boolean][] {
    return this._options.filter(([_, b]) => !b);
  }

  get optionTexts(): string[] {
    return this._options.map(([s, _]) => s);
  }

  get t_optionTexts(): string[] {
    return this.t_options.map(([s, _]) => s);
  }

  get f_optionTexts(): string[] {
    return this.f_options.map(([s, _]) => s);
  }

  get optionTFs(): boolean[] {
    return this._options.map(([_, b]) => b);
  }

  get shuffled(): Quiz {
    return new Quiz(this._question, shuffled(this._options));
  }
}
