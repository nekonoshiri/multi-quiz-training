'use strict';

import * as React from 'react';

import { Quiz } from 'class/Quiz';
import { readQuizFiles } from 'util/readQuizFile';

export interface QuizFileLoaderProps {
  callback: (quizzes: Quiz[]) => void;
}

export interface QuizFileLoaderState {
  quizFiles: FileList | null;
  notice: string;
}

export class QuizFileLoader
extends React.Component<QuizFileLoaderProps, QuizFileLoaderState> {
  constructor(props: QuizFileLoaderProps) {
    super(props);
    this.state = {
      quizFiles: null,
      notice: ''
    };
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const quizFiles = this.state.quizFiles;
    if (!quizFiles || quizFiles.length == 0) return;

    this.setState({
      notice: 'Loading ...'
    });

    readQuizFiles(quizFiles).then(quizzes => {
      this.props.callback(quizzes);
    }).catch(err => {
      this.setState({
        notice: err.toString()
      });
    });
  }

  handleFileSelect = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      quizFiles: e.currentTarget.files
    });
  }

  render () {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <input
              type="file" multiple required
              onChange={this.handleFileSelect} />
          </div>
          <div>
            <button type="submit">作成</button>
          </div>
          <div>
            <p>{this.state.notice}</p>
          </div>
        </form>
      </div>
    );
  };
}
