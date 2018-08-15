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
}

export class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      page: 'QuizFileLoaderPage',
      quizzes: [],
      random_question: false,
      random_choices: true,
    };
  }

  handleCallback = (quizzes: Quiz[]) => {
    const qs1 = this.state.random_question ? shuffled(quizzes) : quizzes;
    const qs2 = this.state.random_choices ? qs1.map(q => q.shuffled) : qs1;
    this.setState({
      page: 'QuizPage',
      quizzes: qs2
    });
  }

  handleRandomQuestionCheck = (_: React.FormEvent<HTMLInputElement>) => {
    this.setState(prevState => ({
      random_question: !prevState.random_question
    }));
  }

  handleRandomChoicesCheck = (_: React.FormEvent<HTMLInputElement>) => {
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
          <div>
            <label>
              <input
                type="checkbox"
                value="random_question"
                checked={this.state.random_question}
                onChange={this.handleRandomQuestionCheck}/>
              出題順をランダムにする
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="random_choices"
                checked={this.state.random_choices}
                onChange={this.handleRandomChoicesCheck}/>
              選択肢の順番をランダムにする
            </label>
          </div>
          <div>
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
        </div>
      );
    }

    return (
      <QuizForm quizzes={this.state.quizzes}/>
    );
  }
}
