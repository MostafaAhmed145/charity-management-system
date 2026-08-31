import { beforeEach, describe, expect, it, vi } from "vitest";

const getDoc = vi.fn();
const setDoc = vi.fn();
const doc = vi.fn((...args) => ({ path: args.join("/") }));

vi.mock("firebase/firestore", () => ({
  getDoc: (...args) => getDoc(...args),
  setDoc: (...args) => setDoc(...args),
  doc: (...args) => doc(...args),
}));

vi.mock("../firebase", () => ({ db: {} }));

import { ensureUserProfile } from "./ensureUserProfile";

describe("ensureUserProfile", () => {
  beforeEach(() => {
    getDoc.mockReset();
    setDoc.mockReset();
    doc.mockClear();
  });

  it("returns null when user is missing", async () => {
    expect(await ensureUserProfile(null)).toBe(null);
    expect(getDoc).not.toHaveBeenCalled();
  });

  it("returns the existing profile and does not write", async () => {
    const existing = { uid: "u1", role: "admin", name: "A" };
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => existing,
    });

    const result = await ensureUserProfile({ uid: "u1", email: "a@b.com" });

    expect(result).toEqual(existing);
    expect(setDoc).not.toHaveBeenCalled();
  });

  it("fills empty name and phone on an existing profile without changing role", async () => {
    const existing = { uid: "u3", role: "user", name: "", phone: "" };
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => existing,
    });
    setDoc.mockResolvedValue(undefined);

    const result = await ensureUserProfile(
      { uid: "u3", email: "c@d.com" },
      { name: "Nour", phone: "01012345678", role: "admin" }
    );

    expect(setDoc).toHaveBeenCalledTimes(1);
    expect(setDoc.mock.calls[0][1]).toEqual({
      name: "Nour",
      phone: "01012345678",
    });
    expect(result).toEqual({
      ...existing,
      name: "Nour",
      phone: "01012345678",
    });
  });

  it("creates a user profile and ignores extras.role", async () => {
    getDoc.mockResolvedValue({ exists: () => false });
    setDoc.mockResolvedValue(undefined);

    const result = await ensureUserProfile(
      { uid: "u2", email: "b@c.com", displayName: "B" },
      { role: "admin", name: "Custom" }
    );

    expect(setDoc).toHaveBeenCalledTimes(1);
    const written = setDoc.mock.calls[0][1];
    expect(written.role).toBe("user");
    expect(written.name).toBe("Custom");
    expect(written.email).toBe("b@c.com");
    expect(result.role).toBe("user");
  });
});
