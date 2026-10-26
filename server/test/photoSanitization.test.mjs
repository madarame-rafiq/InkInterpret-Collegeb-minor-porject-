import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import { sanitizePhotoDataUrl } from "../src/services/gameService.js";

const asDataUrl = (mimeType, data) => `data:${mimeType};base64,${data.toString("base64")}`;

test("photo upload decodes, rotates, strips metadata, and stores a JPEG", async () => {
  const source = await sharp({
    create: { width: 2, height: 5, channels: 3, background: "#2266aa" },
  })
    .jpeg()
    .withMetadata({ orientation: 6 })
    .withExif({ IFD0: { Copyright: "private location metadata must not survive" } })
    .toBuffer();

  const sanitized = await sanitizePhotoDataUrl(asDataUrl("image/jpeg", source));
  const metadata = await sharp(sanitized.data).metadata();

  assert.equal(sanitized.mimeType, "image/jpeg");
  assert.equal(sanitized.extension, "jpg");
  assert.equal(metadata.format, "jpeg");
  assert.equal(metadata.width, 5);
  assert.equal(metadata.height, 2);
  assert.equal(metadata.orientation, undefined);
  assert.equal(metadata.exif, undefined);
});

test("photo upload rejects malformed, corrupt, and mismatched image data", async () => {
  await assert.rejects(
    sanitizePhotoDataUrl("data:image/png;base64,not base64"),
    { code: "INVALID_IMAGE" },
  );
  await assert.rejects(
    sanitizePhotoDataUrl(asDataUrl("image/png", Buffer.from("not an image"))),
    { code: "INVALID_IMAGE" },
  );
  const jpeg = await sharp({ create: { width: 1, height: 1, channels: 3, background: "#000" } }).jpeg().toBuffer();
  await assert.rejects(
    sanitizePhotoDataUrl(asDataUrl("image/png", jpeg)),
    { code: "INVALID_IMAGE" },
  );
});

test("photo upload enforces the 8 MiB decoded source limit before decoding", async () => {
  const tooLarge = Buffer.alloc(8 * 1024 * 1024 + 1, 0).toString("base64");
  await assert.rejects(
    sanitizePhotoDataUrl(`data:image/png;base64,${tooLarge}`),
    { code: "IMAGE_TOO_LARGE" },
  );
});
