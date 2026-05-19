import { Router } from "express";
import { parseOrderFallback } from "../lib/fallbackParser.js";
import { parseOrderWithOpenAI } from "../lib/openaiParser.js";
import { orderRequestSchema } from "../types/order.js";

export const aiRouter = Router();

aiRouter.post("/order", async (req, res) => {
  const parsedRequest = orderRequestSchema.safeParse(req.body);

  if (!parsedRequest.success) {
    return res.status(400).json({
      error: "Invalid request body.",
      details: parsedRequest.error.flatten(),
    });
  }

  try {
    const openAIResult = await parseOrderWithOpenAI(parsedRequest.data);

    if (openAIResult) {
      return res.json(openAIResult);
    }

    return res.json(parseOrderFallback(parsedRequest.data));
  } catch (error) {
    const fallbackResult = parseOrderFallback(parsedRequest.data);

    return res.status(200).json({
      ...fallbackResult,
      reply: `${fallbackResult.reply} The assistant used fallback parsing for this request.`,
      debug: error instanceof Error ? error.message : "Unknown AI error",
    });
  }
});

