import { beforeEach, describe, expect, it, vi } from "vitest";

const httpsCallableFn = vi.fn();
const updateDoc = vi.fn();
const deleteDoc = vi.fn();

vi.mock("firebase/functions", () => ({
  getFunctions: () => ({}),
  httpsCallable: () => httpsCallableFn,
}));

vi.mock("firebase/firestore", () => ({
  updateDoc: (...args) => updateDoc(...args),
  deleteDoc: (...args) => deleteDoc(...args),
  doc: vi.fn(() => ({})),
}));

vi.mock("../firebase", () => ({ default: {}, db: {} }));

import { deleteUserAccountSecure, setUserRoleSecure } from "./secureOps.js";

describe("privileged ops fail closed", () => {
  beforeEach(() => {
    httpsCallableFn.mockReset();
    updateDoc.mockReset();
    deleteDoc.mockReset();
  });

  it("does not write Firestore role when setUserRole callable fails", async () => {
    httpsCallableFn.mockRejectedValue(new Error("functions unavailable"));

    await expect(setUserRoleSecure("u1", "user")).rejects.toThrow();
    expect(updateDoc).not.toHaveBeenCalled();
  });

  it("writes Firestore role when the callable is not deployed", async () => {
    const missing = Object.assign(new Error("not-found"), {
      code: "functions/not-found",
    });
    httpsCallableFn.mockRejectedValue(missing);
    updateDoc.mockResolvedValue();

    await expect(setUserRoleSecure("u1", "admin")).resolves.toEqual({
      data: { ok: true },
    });
    expect(updateDoc).toHaveBeenCalledTimes(1);
  });

  it("writes Firestore role when the callable returns internal", async () => {
    const internal = Object.assign(new Error("internal"), {
      code: "functions/internal",
    });
    httpsCallableFn.mockRejectedValue(internal);
    updateDoc.mockResolvedValue();

    await expect(setUserRoleSecure("u1", "admin")).resolves.toEqual({
      data: { ok: true },
    });
    expect(updateDoc).toHaveBeenCalledTimes(1);
  });

  it("writes Firestore role when the callable hangs", async () => {
    httpsCallableFn.mockImplementation(() => new Promise(() => {}));
    updateDoc.mockResolvedValue();

    await expect(setUserRoleSecure("u1", "admin", { timeoutMs: 40 })).resolves.toEqual({
      data: { ok: true },
    });
    expect(updateDoc).toHaveBeenCalledTimes(1);
  });

  it("does not delete the Firestore profile when deleteUserAccount callable fails", async () => {
    httpsCallableFn.mockRejectedValue(new Error("functions unavailable"));

    await expect(deleteUserAccountSecure("u1")).rejects.toThrow();
    expect(deleteDoc).not.toHaveBeenCalled();
  });

  it("does not delete the profile when the callable hangs", async () => {
    httpsCallableFn.mockImplementation(() => new Promise(() => {}));

    await expect(deleteUserAccountSecure("u1", { timeoutMs: 40 })).rejects.toMatchObject({
      code: "functions/not-found",
    });
    expect(deleteDoc).not.toHaveBeenCalled();
  });

  it("does not export fail-open Firestore fallbacks", async () => {
    const ops = await import("./secureOps.js");
    expect(ops.setUserRoleWithFallback).toBeUndefined();
    expect(ops.deleteUserAccountWithFallback).toBeUndefined();
  });
});
