import { Router } from "express";
import {
  createEvent,
  getEventById,
  getEvents,
  getUpcomingEvents,
} from "../controllers/event-controller.js";

const router = Router();

router.get("/", getEvents);
router.get("/upcoming", getUpcomingEvents); // /:id'den ÖNCE olmalı
router.get("/:id", getEventById);
router.post("/", createEvent);

export default router;