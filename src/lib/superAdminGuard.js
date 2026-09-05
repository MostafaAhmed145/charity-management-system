export function canMutateAccount(target, actorUid) {
  if (!target?.id) return false;
  if (target.role === "superAdmin") return false;
  if (actorUid && target.id === actorUid) return false;
  return true;
}

export function nextAssignableRole(role) {
  return role === "admin" ? "user" : "admin";
}
