import { z } from "zod";

export const SubmitRequestSchema = z.object({
  softwareId: z.number({ required_error: "Software ID is required" }),
  accessType: z.enum(["Read", "Write", "Admin"], {
    errorMap: () => ({ message: "AccessType must be Read, Write, or Admin" }),
  }),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
});

export const UpdateRequestStatusSchema = z.object({
  status: z.enum(["Pending", "Approved", "Rejected"], {
    errorMap: () => ({
      message: "Status must be Pending, Approved or Rejected",
    }),
  }),
});
