import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_request, response) => {
  response.json({
    success: true,
    service: "cipher-designlab-api",
    timestamp: new Date().toISOString(),
  });
});