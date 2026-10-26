# Game backend contract

All routes and Socket.IO commands use the authenticated session. The server is
authoritative for the game phase, deadlines, roster, scoring, submissions, and
votes. A caller must remain both a room member and a game-roster member.

## Authoritative state

`GET /api/rooms/:code/game` returns `{ status: "success", data: { game } }`.
The same game snapshot is returned by the `game:state` acknowledgement.

`game.inputMode` is the mode frozen when the game starts: `"canvas"` or
`"photo"`. `game.phase` is one of `prompt`, `drawing`, `capture`, `voting`,
`result`, `finished`, or `aborted`; `game.phaseEndsAt` is the server's ISO
timestamp deadline. Clients must render their timer from that timestamp and
wait for server events/state rather than advancing locally.

Canvas rounds use `prompt → drawing → voting/result → result`. Photo rounds
use `prompt → drawing → capture → voting/result → result`. A capture phase is
represented by `phase: "capture"` and its own `phaseEndsAt`; only photo games
enter it. The configured game durations stored by the server control all
deadlines.

While the current phase is `voting`, drawings have anonymous entries such as:

```json
{
  "publicId": "a48f1cad-7b7f-4d78-9e81-6e6c3946dc10",
  "type": "photo",
  "assetUrl": "/api/rooms/ABC123/game/drawings/a48f1cad-7b7f-4d78-9e81-6e6c3946dc10"
}
```

No artist or filename is included then. `drawings` is empty before voting, so
other players' artwork cannot be fetched early. In `result`, `finished`, and
`aborted` states each drawing additionally includes `artist` and `votes`.

## HTTP

- `POST /api/rooms/:code/game/start` — host starts a waiting room game.
- `GET /api/rooms/:code/game` — returns the game snapshot above.
- `GET /api/rooms/:code/game/drawings/:publicId` — returns an asset only to a
  current room/game participant, and only during voting, results, or after a
  terminal game state. `publicId` is a neutral UUID; the response exposes no
  filename or artist. Photo responses are sanitized `image/jpeg`; canvas
  responses are `application/json` with `{ "canvasData": "..." }`. Responses
  are `Cache-Control: private, no-store`. Non-members, other rooms/games, and
  unavailable-phase requests receive `DRAWING_NOT_FOUND`.

## Socket commands

Each command has the acknowledgement form `{ "status": "success", "data":
... }` or `{ "status": "error", "error": { "code", "message" } }`.

- `game:start` — `{ "code": "ABC123" }`
- `game:state` — `{ "code": "ABC123" }`
- `game:prompt:submit` — `{ "code": "ABC123", "prompt": "a penguin DJ" }`
- `game:drawing:submit` — `{ "code": "ABC123", "canvasData": "..." }`
- `game:capture:submit` — `{ "code": "ABC123", "dataUrl": "data:image/png;base64,..." }`
- `game:vote:submit` — `{ "code": "ABC123", "drawingId": "<public UUID>" }`

`game:capture:submit` is valid only in a photo game's current `capture` phase.
It returns `{ "drawingId": "<public UUID>" }` on success. The input must be a
strict Base64 PNG, JPEG, or WebP data URL with no more than 8 MiB of *decoded*
source bytes. The server decodes the image, rejects corrupt/unsupported or
overly large-pixel input, applies orientation, strips metadata, and stores an
opaque server-named JPEG. It never uses client filenames or paths.

Relevant capture errors are `VALIDATION_ERROR` (malformed command shape),
`INVALID_IMAGE`, `IMAGE_TOO_LARGE`, `IMAGE_DIMENSIONS_TOO_LARGE`,
`WRONG_INPUT_MODE`, `PHASE_CLOSED`, `NOT_GAME_PARTICIPANT`, and
`DRAWING_ALREADY_SUBMITTED`. Errors use the acknowledgement shape above.

## Server events

- `game:started` includes `{ gameId, phase, phaseEndsAt }`.
- The immediate `game:phase` after a prompt submission is `{ phase,
  phaseEndsAt }`. Timer-driven `game:phase` events, including entry to capture,
  carry the full game snapshot described above.
- Timer-driven `game:results` and `game:finished` carry that full snapshot;
  `game:prompt:missed` carries its documented round/message payload, and
  `game:aborted` carries `{ reason: "INSUFFICIENT_CONNECTED_PLAYERS" }`.

During voting, use only `publicId` for `game:vote:submit`; self-votes and
duplicate votes remain rejected by the server. Artist identity and vote totals
are intentionally unavailable until results.
