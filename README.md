# multi-quiz-training

一問多答クイズトレーニング用 Web アプリ

## Build

```
yarn
yarn build
```

## 読み込める問題ファイル

以下のような形式の JSON ファイル

```
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
]
```
