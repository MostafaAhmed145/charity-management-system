export function isSidebarLinkActive(pathname, match) {
  return Array.isArray(match) && match.includes(pathname);
}
