import { DeepPartial } from "ai";
import { link } from "fs";
import { z } from "zod";

export const linkSchema = z.object({
    title: z.string().describe("the setup of the title"),
    description: z.string().describe("the description of the title"),
    link: z.string().describe("the link of the title"),
});

export type link = DeepPartial<typeof linkSchema>;
