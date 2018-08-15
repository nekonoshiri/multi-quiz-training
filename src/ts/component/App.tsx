'use strict';

import * as React from 'react';

import { QuizFileLoader } from 'component/QuizFileLoader';
import { QuizForm } from 'component/QuizForm';

import { Quiz } from 'class/Quiz';
import { shuffled } from 'util/array';

export interface AppProps {
}

export interface AppState {
  page: 'QuizFileLoaderPage' | 'QuizPage';
  quizzes: Quiz[];
  random_question: boolean;
  random_choices: boolean;
  waiting_seconds: string;
}

export class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      page: 'QuizFileLoaderPage',
      quizzes: [],
      random_question: false,
      random_choices: true,
      waiting_seconds: '2'
    };
  }

  get waiting_seconds(): number {
    const waiting_seconds = parseFloat(this.state.waiting_seconds);
    if (!Number.isFinite(waiting_seconds)) return -1;
    return waiting_seconds;
  }

  handleCallback = (quizzes: Quiz[]) => {
    const qs1 = this.state.random_question ? shuffled(quizzes) : quizzes;
    const qs2 = this.state.random_choices ? qs1.map(q => q.shuffled) : qs1;
    this.setState({
      page: 'QuizPage',
      quizzes: qs2
    });
  }

  handleWaitingSecondsInput = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      waiting_seconds: e.currentTarget.value
    });
  }

  handleRandomQuestionCheck = () => {
    this.setState(prevState => ({
      random_question: !prevState.random_question
    }));
  }

  handleRandomChoicesCheck = () => {
    this.setState(prevState => ({
      random_choices: !prevState.random_choices
    }));
  }

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
                <input type="checkbox" value="random_question"
                  checked={this.state.random_question}
                  onChange={this.handleRandomQuestionCheck}/>
                出題順をランダムにする
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" value="random_choices"
                  checked={this.state.random_choices}
                  onChange={this.handleRandomChoicesCheck}/>
                選択肢の順番をランダムにする
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
