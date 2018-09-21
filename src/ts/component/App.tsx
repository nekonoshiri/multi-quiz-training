'use strict';

import * as React from 'react';

import { QuizFileLoader } from 'component/QuizFileLoader';
import { QuizForm } from 'component/QuizForm';

import { Quiz } from 'class/Quiz';
import { shuffled } from 'util/array';
import { getRandomInt } from 'util/random';

export interface AppProps {
}

export interface AppState {
  page: 'QuizFileLoaderPage' | 'QuizPage';
  quizzes: Quiz[];
  waiting_seconds: string;
  max_number_of_options: string;
  random_question: boolean;
  random_options: boolean;
  always_include_t_option: boolean;
}

export class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      page: 'QuizFileLoaderPage',
      quizzes: [],
      waiting_seconds: '2',
      max_number_of_options: '',
      random_question: false,
      random_options: true,
      always_include_t_option: true
    };
  }

  get waiting_seconds(): number {
    const waiting_seconds = parseFloat(this.state.waiting_seconds);
    if (!Number.isFinite(waiting_seconds)) return -1;
    return waiting_seconds;
  }

  get max_number_of_options(): number {
    const max_num = parseFloat(this.state.max_number_of_options);
    if (!Number.isFinite(max_num)) return -1;
    return max_num;
  }

  chooseQuiz = (quiz: Quiz, max_num: number): Quiz => {
    // when max_num is not specified or max_num <= 0
    let t_num = Infinity;
    let f_num = Infinity;

    if (max_num > 0) {
      const randomInt = getRandomInt(
        this.state.always_include_t_option ? 1 : 0, max_num, true
      );

      t_num = Math.min(randomInt, quiz.t_options.length);
      f_num = max_num - t_num;

      const f_excess = f_num - quiz.f_options.length;
      // when f_options are not enough
      if (f_excess > 0) {
        t_num = Math.min(t_num + f_excess, quiz.t_options.length);
        f_num -= f_excess;
      }
    }

    if (this.state.random_options) {
      const ts = shuffled(quiz.t_options).slice(0, t_num);
      const fs = shuffled(quiz.f_options).slice(0, f_num);
      return new Quiz(quiz.question, shuffled(ts.concat(fs)));
    } else {
      const ts = quiz.t_options.slice(0, t_num);
      const fs = quiz.f_options.slice(0, f_num);
      return new Quiz(quiz.question, ts.concat(fs));
    }
  };

  shuffleQuizzes = (quizzes: Quiz[]): Quiz[] =>
    this.state.random_question ? shuffled(quizzes) : quizzes;

  handleCallback = (quizzes: Quiz[]) => {
    const max_num = this.max_number_of_options;
    this.setState({
      page: 'QuizPage',
      quizzes:
        this.shuffleQuizzes(quizzes.map(q => this.chooseQuiz(q, max_num)))
    });
  };

  handleWaitingSecondsInput = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      waiting_seconds: e.currentTarget.value
    });
  };

  handleMaxNumberOfOptionsInput = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      max_number_of_options: e.currentTarget.value
    });
  };

  handleRandomQuestionCheck = () => {
    this.setState(prevState => ({
      random_question: !prevState.random_question
    }));
  };

  handleRandomOptionsCheck = () => {
    this.setState(prevState => ({
      random_options: !prevState.random_options
    }));
  };

  handleAlwaysIncludeTOptionCheck = () => {
    this.setState(prevState => ({
      always_include_t_option: !prevState.always_include_t_option
    }));
  };

  render () {
    if (this.state.page == 'QuizFileLoaderPage') {
      return (
        <div>
          <h1>Multi Quiz Training</h1>
          <QuizFileLoader callback={this.handleCallback}/>
          <h2>設定</h2>
          <p>
            <div>
              <label>
                正解時，次の問題へ移るまでに待つ時間：
                <input type="number" value={this.state.waiting_seconds}
                  onChange={this.handleWaitingSecondsInput}/>
                （秒）
              </label>
            </div>
            <div>
              <small>
                ※ 空もしくは負数の場合，次の問題へ自動で移動しない
              </small>
            </div>
          </p>
          <p>
            <div>
              <label>
                最大選択肢数：
                <input type="number" value={this.state.max_number_of_options}
                  onChange={this.handleMaxNumberOfOptionsInput}/>
              </label>
            </div>
            <div>
              <small>
                ※ 空もしくは０以下の場合，制限なし
              </small>
            </div>
          </p>
          <p>
            <div>
              <label>
                <input type="checkbox" value="random_question"
                  checked={this.state.random_question}
                  onChange={this.handleRandomQuestionCheck}/>
                出題順をランダムにする
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" value="random_options"
                  checked={this.state.random_options}
                  onChange={this.handleRandomOptionsCheck}/>
                選択肢の順番をランダムにする
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" value="always_include_t_option"
                  checked={this.state.always_include_t_option}
                  onChange={this.handleAlwaysIncludeTOptionCheck}/>
                正解選択肢がある場合，必ず１つ以上含める
              </label>
            </div>
          </p>
          <h2>読み込める問題ファイルについて</h2>
          <p>以下のような形式の JSON ファイル</p>
          <pre><code>{`
[
  {
    "question": "問題文１",
    "answers": [
      "答え１", "答え２", "答え３", "答え４"
    ],
    "dummies": [
      "ダミー１", "ダミー２", "ダミー３"
    ]
  },
  {
    "question": "問題文２",
    "answers": [
      "答え１", "答え２"
    ],
    "dummies": [
      "ダミー１"
    ]
  }
]`}
          </code></pre>
        </div>
      );
    }

    return (
      <QuizForm quizzes={this.state.quizzes}
        waiting_seconds={this.waiting_seconds} />
    );
  }
}
