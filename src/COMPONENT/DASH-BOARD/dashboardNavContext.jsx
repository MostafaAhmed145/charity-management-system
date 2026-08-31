import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "hidaya-sidebar-open";
const DashboardNavContext = createContext(null);

function readStoredOpen() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "1") return true;
    if (stored === "0") return false;
  } catch {
    /* ignore quota / private mode */
  }
  return null;
}

function persistOpen(next) {
  try {
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function getDefaultOpen() {
  if (typeof window === "undefined") return false;
  const stored = readStoredOpen();
  if (stored !== null) return stored;
  return window.matchMedia("(min-width: 768px)").matches;
}

export function DashboardNavProvider({ children }) {
  const [open, setOpenState] = useState(getDefaultOpen);

  const setOpen = useCallback((next) => {
    setOpenState(next);
  }, []);

  const toggle = useCallback(() => {
    setOpenState((prev) => {
      const next = !prev;
      persistOpen(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      if (!mq.matches) setOpenState(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenState(false);
        persistOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const value = useMemo(() => ({ open, setOpen, toggle }), [open, setOpen, toggle]);

  return (
    <DashboardNavContext.Provider value={value}>
      {children}
    </DashboardNavContext.Provider>
  );
}

export function useDashboardNav() {
  const ctx = useContext(DashboardNavContext);
  if (!ctx) {
    return { open: false, setOpen: () => {}, toggle: () => {}, enabled: false };
  }
  return { ...ctx, enabled: true };
}
