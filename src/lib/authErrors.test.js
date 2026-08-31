import { describe, expect, it } from "vitest";
import { getAuthErrorMessage } from "./authErrors";

const GENERIC = "تعذر إتمام العملية. حاول مرة أخرى.";

describe("getAuthErrorMessage", () => {
  it("returns the generic Arabic message for unknown errors", () => {
    expect(getAuthErrorMessage({ message: "SECRET_STACK" })).toBe(GENERIC);
    expect(getAuthErrorMessage(undefined)).toBe(GENERIC);
  });

  it("maps a known auth code to a safe Arabic string and never returns the raw message", () => {
    const raw = "Firebase: Error (auth/wrong-password).";
    const message = getAuthErrorMessage({
      code: "auth/wrong-password",
      message: raw,
    });

    expect(message).not.toBe(raw);
    expect(message).toMatch(/[\u0600-\u06FF]/);
    expect(message).not.toBe(GENERIC);
  });
});
