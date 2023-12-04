import { z } from "zod";

export const RoleSchema = z.object({
  title: z.enum(["developer", "tester", "operations"], {
    description: "The title of the role",
    required_error: "Every role a title",
    invalid_type_error: "Must be either developer, tester or operations",
  }),
  level: z.enum(["junior", "senior", "lead"], {
    description: "The seniority of the role",
    required_error: "The role level is required",
    invalid_type_error: "Must either junior, senior, or lead",
  }),
});

type Role = z.infer<typeof RoleSchema>;
export default Role;
