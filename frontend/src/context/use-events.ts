import { useContext } from "react";
import { EventsContext, type EventsContextValue } from "./events-context";

export function useEvents(): EventsContextValue {
  const ctx = useContext(EventsContext);
  if (ctx === null) {
    throw new Error("useEvents, EventsProvider içinde kullanılmalı.");
  }
  return ctx;
}
