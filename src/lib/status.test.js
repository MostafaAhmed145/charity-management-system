import { describe, it, expect } from "vitest";
import { getStatus, maskNationalId, statusReassurance } from "./status.js";

describe("getStatus", () => {
  it("maps approved to in_progress copy", () => {
    expect(getStatus("approved").text).toBe(getStatus("in_progress").text);
  });
  it("pending is قيد المراجعة", () => {
    expect(getStatus("pending").text).toBe("قيد المراجعة");
  });
});

describe("maskNationalId", () => {
  it("keeps last 4", () => {
    expect(maskNationalId("29501011234567")).toBe("**********4567");
  });
});

describe("statusReassurance", () => {
  it("pending sentence", () => {
    expect(statusReassurance("pending")).toContain("بنراجع");
  });
});
