'use strict';

import * as React from 'react';
import styled from 'styled-components';

import { AnswerButton } from 'component/AnswerButton';

import { Quiz } from 'class/Quiz';
import { toggled } from 'util/set';

const MainForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 20em;
`;

const Headline = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 1em;
  button {
    font-size: 130%;
    background-color: pink;
    border-radius: 5px;
  }
`;

const Question = styled.div`
  border: thin solid black;
  border-radius: 5px;
  padding: 0.5em;
  margin: 0.5em;
  background-color: lightyellow;
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

const Footline = styled.div`
  display: flex;
  justify-content: center;
  margin: 1em;
`;

const NextButton = styled.button`
  padding: 0.3em 0;
  width: 40%;
  border-radius: 5px;
  font-size: 100%;
  background-color: pink;
`;

const HintButton = styled.button`
  font-size: 100%;
  background-color: coral;
  border-radius: 5px;
`;

export interface QuizFormProps {
  quizzes: Quiz[];
  waiting_seconds: number; // wait infinitely when (waiting_seconds < 0)
}

export interface QuizFormState {
  index: number;
  selected: Set<number>;
  commentary: string;
  waiting: boolean;
}

export class QuizForm extends React.Component<QuizFormProps, QuizFormState> {
  constructor(props: QuizFormProps) {
    super(props);
    this.state = {
      index: 0,
      selected: new Set(),
      commentary: '',
      waiting: false
    };
  }

  get currentQuiz(): Quiz {
    return this.props.quizzes[this.state.index];
  }

  toPrevQuiz = () => {
    this.setState(prevState => {
      const prevIndex =
        0 <= prevState.index - 1
          ? prevState.index - 1 : this.props.quizzes.length - 1;
      return {
        index: prevIndex,
        selected: new Set(),
        commentary: '',
        waiting: false
      };
    });
  };

  toNextQuiz = () => {
    this.setState(prevState => {
      const nextIndex =
        prevState.index + 1 < this.props.quizzes.length
          ? prevState.index + 1 : 0;
      return {
        index: nextIndex,
        selected: new Set(),
        commentary: '',
        waiting: false
      };
    });
  };

  handleAnswerButtonClick(i: number) {
    this.setState(prevState => ({
      selected: toggled(prevState.selected, i)
    }));
  };

  handleOKClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isCorrect = this.currentQuiz.optionTFs.every((tf, i) =>
      tf === this.state.selected.has(i)
    );

    this.setState({
      commentary: isCorrect ? '○' : '×'
    });

    if (isCorrect) {
      this.setState({
        waiting: true
      });

      if (this.props.waiting_seconds >= 0) {
        setTimeout(() => {
          if (this.state.waiting) this.toNextQuiz();
        }, this.props.waiting_seconds * 1000);
      }
    }
  };

  handleHintClick = () => {
    const optionTFs = this.currentQuiz.optionTFs;
    const selected = this.state.selected;

    // find unselected answer
    let ix = optionTFs.findIndex((tf, i) => tf && !selected.has(i));

    if (ix < 0) {
      // find selected dummy
      ix = optionTFs.findIndex((tf, i) => !tf && selected.has(i));
    }

    if (0 <= ix) this.handleAnswerButtonClick(ix);
  };

  render () {
    const answerButtons = this.currentQuiz.optionTexts.map((text, i) =>
      <AnswerButton
        index={i + 1}
        key={i.toString()}
        text={text}
        checked={this.state.selected.has(i)}
        disabled={this.state.waiting}
        onChange={this.handleAnswerButtonClick.bind(this, i)} />
    );

    return (
      <MainForm onSubmit={this.handleOKClick}>
        <Headline>
          <button type="button" onClick={this.toPrevQuiz}>←</button>
          <span>{this.state.index + 1} / {this.props.quizzes.length}</span>
          <button type="button" onClick={this.toNextQuiz}>→</button>
        </Headline>
        <Question>
          {this.currentQuiz.question}
        </Question>
        {answerButtons}
        <OKButton type="submit" disabled={this.state.waiting}>OK</OKButton>
        <Commentary>{this.state.commentary}</Commentary>
        <Footline>
          {this.state.waiting
            ? <NextButton type="button" onClick={this.toNextQuiz}>
                Next
              </NextButton>
            : <HintButton type="button" onClick={this.handleHintClick}>
                Hint
              </HintButton>
          }
        </Footline>
      </MainForm>
    );
  };
}
