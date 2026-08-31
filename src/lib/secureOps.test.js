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

  it("does not delete the Firestore profile when deleteUserAccount callable fails", async () => {
    httpsCallableFn.mockRejectedValue(new Error("functions unavailable"));

    await expect(deleteUserAccountSecure("u1")).rejects.toThrow();
    expect(deleteDoc).not.toHaveBeenCalled();
  });

  it("does not export fail-open Firestore fallbacks", async () => {
    const ops = await import("./secureOps.js");
    expect(ops.setUserRoleWithFallback).toBeUndefined();
    expect(ops.deleteUserAccountWithFallback).toBeUndefined();
  });
});
