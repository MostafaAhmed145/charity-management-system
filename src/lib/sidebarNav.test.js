import { describe, expect, it } from "vitest";
import { PATHS } from "./paths.js";
import { isSidebarLinkActive } from "./sidebarNav.js";

describe("isSidebarLinkActive", () => {
  const casesMatch = [PATHS.dashboard, PATHS.dashboardCases];

  it("marks cases on both dashboard index and /cases", () => {
    expect(isSidebarLinkActive(PATHS.dashboard, casesMatch)).toBe(true);
    expect(isSidebarLinkActive(PATHS.dashboardCases, casesMatch)).toBe(true);
  });

  it("does not mark cases on trash", () => {
    expect(isSidebarLinkActive(PATHS.dashboardTrash, casesMatch)).toBe(false);
  });

  it("rejects empty match lists", () => {
    expect(isSidebarLinkActive(PATHS.dashboard, [])).toBe(false);
    expect(isSidebarLinkActive(PATHS.dashboard, null)).toBe(false);
  });
});
