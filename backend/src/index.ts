import cors from "cors";
import dotenv from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";
import { orderRoutes } from "./routes/orderRoutes.js";

dotenv.config({ path: ".env.local" });

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/ai", orderRoutes);

app.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      error: "Invalid JSON body.",
    });
  }

  return next(error);
});

app.listen(port, () => {
  console.log(`Intelligent Bistro backend listening on port ${port}`);
});
