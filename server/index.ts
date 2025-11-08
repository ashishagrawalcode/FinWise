 import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleCoach } from "./routes/coach";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  const router = express.Router();
  
  router.get("/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  router.get("/demo", handleDemo);
  router.post("/coach", handleCoach);
  
  // Mount all API routes under /api
  app.use("/api", router);

  return app;
}
