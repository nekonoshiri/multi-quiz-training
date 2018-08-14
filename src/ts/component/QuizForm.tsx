'use strict';

import * as React from 'react';

import { AnswerButton } from 'component/AnswerButton';

import { Quiz } from 'class/Quiz';

export interface QuizFormProps {
  quizzes: Quiz[];
}

export interface QuizFormState {
  index: number;
  selected: Set<number>;
  commentary: string;
  disable: boolean;
}

export class QuizForm extends React.Component<QuizFormProps, QuizFormState> {
  constructor(props: QuizFormProps) {
    super(props);
    this.state = {
      index: 0,
      selected: new Set(),
      commentary: '',
      disable: false
    };
  }

  get currentQuiz(): Quiz {
    return this.props.quizzes[this.state.index];
  }

  handleAnswerButtonClick(i: number) {
    if (this.state.disable) return;

    this.setState(prevState => {
      const selected = new Set(prevState.selected);
      if (selected.has(i)) {
        selected.delete(i);
      } else {
        selected.add(i);
      }
      return {
        selected
      };
    });
  }

  handleOKClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.disable) return;

    const isCorrect = this.currentQuiz.answerTFs.every((tf, i) =>
      tf == this.state.selected.has(i)
    );

    this.setState({
      commentary: isCorrect ? '○' : '×'
    });

    if (isCorrect) {
      this.setState({
        disable: true
      });

      setTimeout(() => {
        this.setState(prevState => {
          const nextIndex =
            prevState.index + 1 < this.props.quizzes.length
              ? prevState.index + 1 : 0;
          return {
            index: nextIndex,
            selected: new Set(),
            commentary: '',
            disable: false
          };
        });
      }, 2000);
    }
  }

  render () {
    const answerButtons = this.currentQuiz.answerTexts.map((text, i) =>
      <AnswerButton
        index={i + 1}
        key={text.toString()}
        text={text}
        checked={this.state.selected.has(i)}
        onChange={this.handleAnswerButtonClick.bind(this, i)} />
    );

    return (
      <div>
        <form onSubmit={this.handleOKClick}>
          <div>
            {this.currentQuiz.question}
          </div>
          <div>
            {answerButtons}
          </div>
          <div>
            <button type='submit'>OK</button>
          </div>
          <div>
            {this.state.commentary}
          </div>
        </form>
      </div>
    );
  };
}
