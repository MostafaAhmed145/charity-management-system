import { describe, expect, it } from "vitest";
import { homeForRole, resolveRole } from "./resolveRole.js";

describe("resolveRole", () => {
  it("prefers Firestore role over a stale user claim", () => {
    expect(resolveRole("superAdmin", "user")).toBe("superAdmin");
    expect(resolveRole("admin", "user")).toBe("admin");
    expect(resolveRole("user", "admin")).toBe("user");
  });

  it("falls back to claim when the profile has no role", () => {
    expect(resolveRole("", "admin")).toBe("admin");
    expect(resolveRole(undefined, "user")).toBe("user");
  });
});

describe("homeForRole", () => {
  it("maps roles to homes", () => {
    expect(homeForRole("user")).toBe("/user-home");
    expect(homeForRole("admin")).toBe("/dashboard");
    expect(homeForRole("superAdmin")).toBe("/dashboard");
    expect(homeForRole("")).toBe("");
  });
});
