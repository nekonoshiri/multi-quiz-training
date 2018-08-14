'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';

import { App } from 'component/App';

injectGlobal`
  body {
    font-family:
      -apple-system,
      BlinkMacSystemFont,
      "Helvetica Neue",
      YuGothic,
      "ヒラギノ角ゴ ProN W3",
      Hiragino Kaku Gothic ProN,
      Arial,
      "メイリオ",
      Meiryo,
      sans-serif;
  }
`;

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
