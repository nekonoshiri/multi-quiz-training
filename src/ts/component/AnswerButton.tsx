'use strict';

import * as React from 'react';
import styled from 'styled-components';

const AnswerButtonDiv = styled.div`
  input[type=checkbox] {
    display: none;
    & + span {
      display: flex;
      align-items: center;
      height: 1.5em;
      margin: 2px;
      border: 3px outset grey;
      border-radius: 4px;
      cursor: pointer;
    }
    &:checked + span {
      border: 3px inset grey;
      background-color: red;
    }
  }
`;

const Badge = styled.span`
  display: flex;
  flex-basis: 2em;
  align-self: stretch;
  justify-content: center;
  align-items: center;
  margin-right: 0.3em;
  border-radius: 1px 0 0 1px;
  background-color: blue;
  color: white;
  font-size: small;
`;

export interface AnswerButtonProps {
  index: number;
  text: string;
  checked: boolean;
  onChange: () => void;
}

export const AnswerButton = (props: AnswerButtonProps) => (
  <AnswerButtonDiv>
    <label>
      <input type='checkbox'
        checked={props.checked}
        onChange={props.onChange} />
      <span>
        <Badge>{props.index}</Badge>
        {props.text}
      </span>
    </label>
  </AnswerButtonDiv>
);
