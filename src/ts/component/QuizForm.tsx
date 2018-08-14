'use strict';

import * as React from 'react';
import styled from 'styled-components';

import { AnswerButton } from 'component/AnswerButton';

import { Quiz } from 'class/Quiz';

const MainForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 20em;
`;

const OKButton = styled.button`
  align-self: center;
  padding: 0.3em 0;
  width: 40%;
  border-radius: 5px;
  font-size: 100%;
  background-color: palegreen;
`;

const Commentary = styled.div`
  align-self: center;
  font-size: 300%;
`;

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
      <MainForm onSubmit={this.handleOKClick}>
        <div>{this.currentQuiz.question}</div>
        {answerButtons}
        <OKButton type='submit'>OK</OKButton>
        <Commentary>{this.state.commentary}</Commentary>
      </MainForm>
    );
  };
}
