import { describe, expect, it } from "vitest";
import { canMutateAccount, nextAssignableRole } from "./superAdminGuard.js";

describe("canMutateAccount", () => {
  const actor = "super-1";

  it("blocks mutating another superAdmin or the signed-in account", () => {
    expect(
      canMutateAccount({ id: "sa-2", role: "superAdmin" }, actor)
    ).toBe(false);
    expect(canMutateAccount({ id: actor, role: "admin" }, actor)).toBe(false);
  });

  it("allows mutating admins and users", () => {
    expect(canMutateAccount({ id: "a1", role: "admin" }, actor)).toBe(true);
    expect(canMutateAccount({ id: "u1", role: "user" }, actor)).toBe(true);
  });
});

describe("nextAssignableRole", () => {
  it("toggles only between admin and user", () => {
    expect(nextAssignableRole("admin")).toBe("user");
    expect(nextAssignableRole("user")).toBe("admin");
    expect(nextAssignableRole("superAdmin")).toBe("admin");
  });
});
