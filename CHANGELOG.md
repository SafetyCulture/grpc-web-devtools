# CHANGELOG

## 2.2.0 - 2023.10.04

- fix: row selection selecting wrong data.
- feat: add filter by content. This filter searches in a stringified JSON.
- perf: store again the filtered list to avoid calculations.

## 2.1.0 - 2023.10.03

- feat: add stop/resume button.
- feat: add service name if the method is `url.XxxxService/path` on the list.
- fix: fix filters crashing.
- chore: remove `fuse.js` library.

## 2.0.1 - 2023.07.28

- Remove log.

## 2.0.0 - 2023.07.27

- First version with `removeListener` fixed and hooks for `onMetadata` and `onEnd`.
