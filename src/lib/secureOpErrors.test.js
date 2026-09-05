import { describe, expect, it } from "vitest";
import { getSecureOpMessage } from "./secureOpErrors.js";
import { MSG } from "./validation.js";

describe("getSecureOpMessage", () => {
  it.each([
    ["functions/not-found", "خدمة إدارة الحسابات غير مفعّلة"],
    ["functions/unavailable", "خدمة إدارة الحسابات غير مفعّلة"],
    ["functions/internal", "خدمة إدارة الحسابات غير مفعّلة"],
    ["functions/permission-denied", "ليس لديك صلاحية"],
    ["functions/unauthenticated", "يجب تسجيل الدخول"],
    ["functions/failed-precondition", "لا يمكن تنفيذ هذا الإجراء على هذا الحساب"],
  ])("maps %s to an Arabic operator message", (code, snippet) => {
    expect(getSecureOpMessage({ code })).toContain(snippet);
  });

  it("falls back to the generic network message", () => {
    expect(getSecureOpMessage({ code: "functions/deadline-exceeded" })).toBe(MSG.network);
    expect(getSecureOpMessage(new Error("boom"))).toBe(MSG.network);
    expect(getSecureOpMessage(undefined)).toBe(MSG.network);
  });
});
