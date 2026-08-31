import { describe, expect, it } from "vitest";
import {
  PASSWORD_REGEX,
  isValidPhone,
  isValidNationalId,
} from "./validation.js";

describe("PASSWORD_REGEX", () => {
  it.each(["1234567", "abcdefg", "short1"])(
    "rejects password shorter than 8 %s",
    (password) => {
      expect(PASSWORD_REGEX.test(password)).toBe(false);
    }
  );

  it.each(["12345678", "abcdefgh", "Abcdef1!", "password"])(
    "accepts any 8+ characters %s",
    (password) => {
      expect(PASSWORD_REGEX.test(password)).toBe(true);
    }
  );
});

describe("isValidPhone", () => {
  it("accepts valid Egyptian mobile", () => {
    expect(isValidPhone("01012345678")).toBe(true);
  });
  it("rejects invalid phone", () => {
    expect(isValidPhone("0123")).toBe(false);
  });
});

describe("isValidNationalId", () => {
  it("accepts 14-digit national ID", () => {
    expect(isValidNationalId("29501011234567")).toBe(true);
  });
  it("rejects wrong length", () => {
    expect(isValidNationalId("123")).toBe(false);
  });
});
