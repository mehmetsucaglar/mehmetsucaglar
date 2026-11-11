import express from "express";
import cors from "cors";
import eventRoutes from "./routes/event-routes.js";

const app = express();

app.use(cors());
app.use(express.json()); // body -> req.body

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    student: "2416501032",
  });
});

app.use("/events", eventRoutes);

// eşleşme yoksa
app.use((req, res) => {
  res.status(404).json({ error: { message: "Route not found" } });
});

// bozuk JSON gibi beklenmeyen hatalar da aynı biçimde döner
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: { message: "Invalid JSON body" } });
  }
  res.status(500).json({ error: { message: "Internal server error" } });
});

export default app;