import assert from "node:assert/strict";
import test from "node:test";
import { createPromptGiverOrder } from "../src/services/gameService.js";

test("prompt-giver order contains every starting participant exactly once", () => {
  const participants = ["a", "b", "c", "d", "e"];
  const order = createPromptGiverOrder(participants);

  assert.equal(order.length, participants.length);
  assert.deepEqual([...order].sort(), [...participants].sort());
  assert.equal(new Set(order).size, participants.length);
});

test("prompt-giver order rejects an invalid roster", () => {
  assert.throws(() => createPromptGiverOrder(["a", "b"]));
  assert.throws(() => createPromptGiverOrder(["a", "b", "a"]));
});
