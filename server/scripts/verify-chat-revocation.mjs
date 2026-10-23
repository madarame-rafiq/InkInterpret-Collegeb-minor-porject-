// server/scripts/verify-chat-revocation.mjs
import { io as Client } from "socket.io-client";
import { pool } from "../src/database/pool.js";

const URL = "http://localhost:5001";
const ROOM_CODE = process.env.ROOM_CODE;
const COOKIE_A = process.env.COOKIE_A;
const COOKIE_B = process.env.COOKIE_B;

if (
  !ROOM_CODE ||
  !COOKIE_A ||
  !COOKIE_B ||
  process.env.ALLOW_DESTRUCTIVE_ROOM_TEST !== "1"
) {
  console.error(
    "Set ROOM_CODE, COOKIE_A, COOKIE_B, and ALLOW_DESTRUCTIVE_ROOM_TEST=1. " +
      "This script leaves members and deletes its target room."
  );
  process.exit(1);
}

const cookieHeader = (value) => {
  const pair = value
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("inkinterpret.sid="));

  if (pair) return pair;

  return `inkinterpret.sid=${value.replace(/^inkinterpret\.sid=/, "")}`;
};

const sessionIdFromCookie = (value) => {
  const encodedValue = cookieHeader(value).slice("inkinterpret.sid=".length);
  const signedValue = decodeURIComponent(encodedValue);
  const match = /^s:([^.]+)\.[^.]+$/.exec(signedValue);

  if (!match) {
    throw new Error("A supplied cookie is not an Express signed session cookie.");
  }

  return match[1];
};

const requireCondition = (condition, message) => {
  if (!condition) throw new Error(`Prerequisite failed: ${message}`);
};

const openSocket = (cookieValue) =>
  new Promise((resolve, reject) => {
    const s = Client(URL, {
      transports: ["websocket"],
      extraHeaders: {
        Cookie: cookieHeader(cookieValue),
        Origin: "http://localhost:5173",
      },
    });
    s.once("connect", () => resolve(s));
    s.once("connect_error", reject);
  });

const emitAck = (socket, event, payload) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`${event} ack timeout`)),
      3000
    );
    socket.emit(event, payload, (resp) => {
      clearTimeout(timer);
      resolve(resp);
    });
  });

const countMessages = async (roomCode) => {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS n
       FROM chat_messages cm
       JOIN rooms r ON r.id = cm.room_id
      WHERE r.code = $1`,
    [roomCode]
  );
  return rows[0].n;
};

const roomIdByCode = async (roomCode) => {
  const { rows } = await pool.query(
    "SELECT id FROM rooms WHERE code = $1",
    [roomCode]
  );
  return rows[0]?.id;
};

const getSessionUser = async (cookie) => {
  const sessionId = sessionIdFromCookie(cookie);
  const { rows } = await pool.query(
    `SELECT u.id, u.username
     FROM user_sessions AS us
     JOIN users AS u ON u.id = (us.sess ->> 'userId')::uuid
     WHERE us.sid = $1
       AND us.expire > CURRENT_TIMESTAMP`,
    [sessionId]
  );

  return rows[0] ?? null;
};

const getAuthenticatedUser = async (cookie) => {
  const response = await fetch(`${URL}/api/auth/me`, {
    headers: { Cookie: cookieHeader(cookie) },
  });
  const body = await response.json().catch(() => null);

  requireCondition(
    response.ok && body?.status === "success" && body.data?.user?.id,
    "a supplied cookie is not accepted by the HTTP session middleware"
  );

  return body.data.user;
};

const verifyPreconditions = async () => {
  const [aSessionUser, bSessionUser] = await Promise.all([
    getSessionUser(COOKIE_A),
    getSessionUser(COOKIE_B),
  ]);

  requireCondition(aSessionUser, "COOKIE_A has no active stored session");
  requireCondition(bSessionUser, "COOKIE_B has no active stored session");
  requireCondition(
    aSessionUser.id !== bSessionUser.id,
    "COOKIE_A and COOKIE_B must belong to different users"
  );

  const [aHttpUser, bHttpUser] = await Promise.all([
    getAuthenticatedUser(COOKIE_A),
    getAuthenticatedUser(COOKIE_B),
  ]);

  requireCondition(
    aHttpUser.id === aSessionUser.id && bHttpUser.id === bSessionUser.id,
    "the HTTP-authenticated users do not match their stored sessions"
  );

  const { rows } = await pool.query(
    `SELECT r.id, r.status,
       EXISTS (
         SELECT 1 FROM room_members AS rm
         WHERE rm.room_id = r.id AND rm.user_id = $2
       ) AS "aIsMember",
       EXISTS (
         SELECT 1 FROM room_members AS rm
         WHERE rm.room_id = r.id AND rm.user_id = $3
       ) AS "bIsMember"
     FROM rooms AS r
     WHERE r.code = $1`,
    [ROOM_CODE, aSessionUser.id, bSessionUser.id]
  );

  const room = rows[0];
  requireCondition(room, "target room does not exist");
  requireCondition(
    room.status === "waiting",
    "target room must be waiting because this test performs leaves"
  );
  requireCondition(room.aIsMember, "COOKIE_A user is not a target-room member");
  requireCondition(room.bIsMember, "COOKIE_B user is not a target-room member");

  return room;
};

const waitFor = (cond, ms = 2000) =>
  new Promise((resolve) => {
    const start = Date.now();
    const tick = () => {
      if (cond()) return resolve(true);
      if (Date.now() - start > ms) return resolve(false);
      setTimeout(tick, 50);
    };
    tick();
  });

const pass = (n, msg) => console.log(`  PASS [${n}] ${msg}`);

const run = async () => {
  const sockets = [];

  try {
    const room = await verifyPreconditions();
    const a1 = await openSocket(COOKIE_A);
    const a2 = await openSocket(COOKIE_A);
    const b1 = await openSocket(COOKIE_B);
    const b2 = await openSocket(COOKIE_B);
    sockets.push(a1, a2, b1, b2);

    const wireRevoke = (socket) =>
      socket.on("room:access_revoked", (event) => {
        socket.revocation = event;
      });
    sockets.forEach(wireRevoke);

    const joinAndAssert = async (socket, label) => {
      const response = await emitAck(socket, "room:join", { code: ROOM_CODE });
      requireCondition(
        response?.status === "success" && response.data?.roomId === room.id,
        `${label} room:join was rejected: ${JSON.stringify(response)}`
      );
    };

    await Promise.all([
      joinAndAssert(a1, "A tab 1"),
      joinAndAssert(a2, "A tab 2"),
      joinAndAssert(b1, "B tab 1"),
      joinAndAssert(b2, "B tab 2"),
    ]);

    // -- Scenario 1: broadcast + DB row
    const before = await countMessages(ROOM_CODE);
    const receivedByB = new Promise((resolve) =>
      b1.once("chat:message", resolve)
    );
    const sendAck = await emitAck(a1, "chat:send", {
      code: ROOM_CODE,
      content: "verify-s1",
    });
    requireCondition(
      sendAck?.status === "success",
      `initial chat:send was rejected: ${JSON.stringify(sendAck)}`
    );
    const bMsg = await Promise.race([
      receivedByB,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("chat broadcast timeout")), 3000)
      ),
    ]);
    const after = await countMessages(ROOM_CODE);
    requireCondition(
      bMsg && after === before + 1,
      "authorized broadcast or persistence failed"
    );
    pass(1, "authorized broadcast received and DB row +1");

    // -- Scenario 2: A leaves, both A sockets receive revocation, B does not
    const leaveResp = await fetch(
      `${URL}/api/rooms/${ROOM_CODE}/members/me`,
      {
        method: "DELETE",
        headers: { Cookie: cookieHeader(COOKIE_A) },
      }
    );
    const leaveBody = await leaveResp.json().catch(() => null);
    requireCondition(
      leaveResp.ok && leaveBody?.status === "success" && !leaveBody.data?.deleted,
      `A leave failed or unexpectedly deleted the room: HTTP ${leaveResp.status}`
    );
    requireCondition(
      await waitFor(
        () =>
          a1.revocation?.code === "ROOM_LEFT" &&
          a2.revocation?.code === "ROOM_LEFT"
      ),
      "both A tabs did not receive ROOM_LEFT revocation"
    );
    requireCondition(
      !b1.revocation && !b2.revocation,
      "a B tab was incorrectly revoked when A left"
    );
    pass(2, "both A tabs received ROOM_LEFT; B tabs were not revoked");

    // -- Scenario 3: A cannot send after leave; no DB write
    const beforeSend = await countMessages(ROOM_CODE);
    const deniedAck = await emitAck(a1, "chat:send", {
      code: ROOM_CODE,
      content: "verify-s3-should-fail",
    });
    const afterSend = await countMessages(ROOM_CODE);
    requireCondition(
      deniedAck?.status === "error" &&
      deniedAck?.error?.code === "ROOM_ACCESS_DENIED" &&
      afterSend === beforeSend,
      `post-leave send was not denied without a write: ack=${JSON.stringify(deniedAck)} dbDelta=${afterSend - beforeSend}`
    );
    pass(3, "post-leave send rejected, no DB write");

    // -- Scenario 6: B leaves last → room deleted, chat cascaded, all B tabs revoked
    const leaveB = await fetch(
      `${URL}/api/rooms/${ROOM_CODE}/members/me`,
      {
        method: "DELETE",
        headers: { Cookie: cookieHeader(COOKIE_B) },
      }
    );
    const leaveBBody = await leaveB.json().catch(() => null);
    requireCondition(
      leaveB.ok && leaveBBody?.status === "success" && leaveBBody.data?.deleted,
      `B last-member leave did not delete the target room: HTTP ${leaveB.status}`
    );
    requireCondition(
      await waitFor(
        () =>
          b1.revocation?.code === "ROOM_DELETED" &&
          b2.revocation?.code === "ROOM_DELETED"
      ),
      "both B tabs did not receive ROOM_DELETED revocation"
    );
    const stillRoom = await roomIdByCode(ROOM_CODE);
    const msgs = await countMessages(ROOM_CODE);
    requireCondition(
      !stillRoom && msgs === 0,
      `room deletion or chat cascade failed: room_exists=${!!stillRoom} messages=${msgs}`
    );
    pass(6, "room and cascaded chat deleted; both B tabs received revocation");
  } finally {
    sockets.forEach((socket) => socket.close());
    await pool.end();
  }
};

run().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
