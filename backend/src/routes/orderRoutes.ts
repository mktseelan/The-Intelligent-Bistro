import { Router } from "express";
import { ZodError } from "zod";
import { orderRequestSchema } from "../schemas/orderSchema.js";
import { generateOrderResponse } from "../services/orderAI.js";

export const orderRoutes = Router();

orderRoutes.post("/order", async (req, res) => {
  const parsedBody = orderRequestSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      error: "Invalid request body.",
      details: parsedBody.error.flatten(),
    });
  }

  try {
    const response = await generateOrderResponse(parsedBody.data);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(502).json({
        error: "AI response did not match the expected schema.",
        details: error.flatten(),
      });
    }

    return res.status(500).json({
      error: "Unable to process the order request.",
    });
  }
});
