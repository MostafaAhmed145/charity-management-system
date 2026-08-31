import { PATHS } from "./paths.js";

export function resolveRole(docRole, claimRole) {
  if (typeof docRole === "string" && docRole) return docRole;
  if (typeof claimRole === "string" && claimRole) return claimRole;
  return "";
}

export function homeForRole(role) {
  if (role === "admin" || role === "superAdmin") return PATHS.dashboard;
  if (role === "user") return PATHS.userHome;
  return "";
}
