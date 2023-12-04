import { z } from "zod";

export const AdminSchema = z.object({
  username: z
    .string({
      description: "Admin's user name",
      required_error: "Admin username must be included",
      invalid_type_error: "admin username must be a string",
    })
    .min(1, "Admin username must have at least one character"),
  key: z
    .string({
      description: "admin user key",
      required_error: "key is required",
      invalid_type_error: "key must be a string",
    })
    .min(1, "key must have at least 16 characters"),
});

export type Admin = z.infer<typeof AdminSchema>;

export const AdminListSchema = z.array(AdminSchema);
export type AdminList = z.infer<typeof AdminListSchema>;
