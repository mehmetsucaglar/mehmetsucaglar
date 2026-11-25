import mongoose from "mongoose";
import { Event } from "../models/event-model.js";

function notFound(res) {
  return res.status(404).json({ error: { message: "Event not found" } });
}

export async function getEvents(req, res, next) {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (typeof search === "string" && search.trim()) {
      // ( * ? gibi işaretler aramayı bozmasın
      const guvenli = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.title = { $regex: guvenli, $options: "i" };
    }

    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
}

export async function getEventById(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return notFound(res);
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return notFound(res);
    }

    res.json(event);
  } catch (err) {
    next(err);
  }
}

export async function createEvent(req, res, next) {
  try {
    const event = await Event.create(req.body ?? {});
    res.status(201).json(event);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: { message: err.message } });
    }
    next(err);
  }
}