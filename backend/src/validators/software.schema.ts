import { z } from "zod";

export const CreateSoftwareSchema = z.object({
  name: z.string().min(2, "Software name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  accessLevels: z
    .array(z.enum(["Read", "Write", "Admin"]))
    .min(1, "At least one access level must be provided"),
});
