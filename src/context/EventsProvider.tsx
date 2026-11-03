import { useState, type ReactNode } from "react";
import { events as initialEvents } from "../data/events";
import type { CampusEvent, Category, EventFormData } from "../types/campus-event";
import { EventsContext } from "./events-context";

function toEvent(id: string, data: EventFormData, image?: string): CampusEvent {
  return {
    id,
    title: data.title.trim(),
    category: data.category as Category, // form doğrulandıktan sonra boş olamaz
    capacity: Number(data.capacity),
    date: data.date,
    time: data.time,
    location: data.location.trim(),
    description: data.description.trim(),
    image,
  };
}

export default function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CampusEvent[]>(initialEvents);

  function addEvent(data: EventFormData) {
    setEvents((prev) => [...prev, toEvent(`event-${Date.now()}`, data)]);
  }

  function updateEvent(id: string, data: EventFormData) {
    setEvents((prev) => prev.map((e) => (e.id === id ? toEvent(id, data, e.image) : e)));
  }

  function deleteEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <EventsContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  );
}
