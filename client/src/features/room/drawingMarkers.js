// Per-tab memory of what *this* player did in a round, in sessionStorage.
//
// The game state doesn't say whether "I" already submitted or voted, and it
// reveals nobody's identity during voting. So a successful submission is
// remembered here to restore the "already in" screens after a refresh, and to
// know which anonymous entry is mine (so it isn't offered as a vote option).
// None of this is trusted for rules: the server rejects duplicates and
// self-votes regardless. Nothing sensitive is stored.

function read(key) {
  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    // Storage unavailable: the server-side duplicate checks still protect us.
  }
}

const submissionKey = (gameId, round) => `inkinterpret:drawing-sent:${gameId}:${round}`
const voteKey = (gameId, round) => `inkinterpret:vote-cast:${gameId}:${round}`

// '1' is the value the canvas flow wrote before ids were remembered.
function parse(raw) {
  if (!raw) return { done: false, drawingId: null }
  return { done: true, drawingId: raw === '1' ? null : raw }
}

export function readSubmission(gameId, round) {
  const { done, drawingId } = parse(read(submissionKey(gameId, round)))
  return { submitted: done, drawingId }
}

export function writeSubmission(gameId, round, drawingId) {
  write(submissionKey(gameId, round), drawingId || '1')
}

export function readVote(gameId, round) {
  const { done, drawingId } = parse(read(voteKey(gameId, round)))
  return { voted: done, drawingId }
}

export function writeVote(gameId, round, drawingId) {
  write(voteKey(gameId, round), drawingId || '1')
}