import cors from "cors";
import express from "express";
import { aiRouter } from "./routes/ai.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/ai", aiRouter);

