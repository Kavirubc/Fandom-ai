import { DeepPartial } from "ai";
import { z } from "zod";

export const infoSchema = z.object({
  title: z.string().describe("the setup of the title"),
  description: z.string().describe("the description of the title"),
});

export type info = DeepPartial<typeof infoSchema>;
