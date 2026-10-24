# Game backend contract

All routes and socket commands use the existing authenticated session. Socket
commands require the user to be a current room member and game-roster member.

## HTTP

- `POST /api/rooms/:code/game/start` — host starts a waiting room game.
- `GET /api/rooms/:code/game` — returns persisted authoritative state for a roster member.
- `GET /api/rooms/:code/game/drawings/:publicId` — returns a roster member's canvas payload or photo. `publicId` is a neutral, round-specific UUID.

## Socket commands

Each command accepts an acknowledgement shaped as `{ status: 'success', data }`
or `{ status: 'error', error: { code, message } }`.

- `game:start` `{ code }`
- `game:state` `{ code }`
- `game:prompt:submit` `{ code, prompt }`
- `game:drawing:submit` `{ code, canvasData }`
- `game:capture:submit` `{ code, dataUrl }` — PNG, JPEG, or WebP data URL, maximum 8 MB.
- `game:vote:submit` `{ code, drawingId }`

## Server events

- `game:started`, `game:phase`, `game:results`, `game:finished`
- `game:prompt:missed` with the explicit missing-prompt message
- `game:aborted` with a terminal abort reason

During voting, state and events include only neutral `publicId` drawing IDs;
artist identity and vote totals are returned only in result/terminal state.
