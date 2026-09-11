import "dotenv/config";
import { z } from "zod";
const EnvSchema = z.object({
    PORT: z.coerce
        .number()
        .int()
        .positive()
        .default(4000),
    MONGODB_URI: z
        .string()
        .min(1, "MONGODB_URI is required"),
    CLIENT_ORIGIN: z
        .string()
        .default("http://localhost:5173"),
    OPENROUTER_API_KEY: z
        .string()
        .min(1)
        .optional(),
    OPENROUTER_MODEL: z
        .string()
        .min(1)
        .default("openrouter/free"),
});
export const env = EnvSchema.parse(process.env);
