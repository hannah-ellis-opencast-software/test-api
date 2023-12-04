import { z } from "zod";
import { RoleSchema } from "./Role";

export const EmployeeSchema = z.object({
  forename: z
    .string({
      description: "Employee's first name",
      required_error: "Employee's must have a first name",
      invalid_type_error: "Forename must be text",
    })
    .min(1, "Forename must have at least one character"),
  surname: z
    .string({
      description: "Employee's last name",
      required_error: "Employee's must have a last name",
      invalid_type_error: "surname must be text",
    })
    .min(1, "Surname must have at least one character"),
  salary: z
    .number({
      description: "The amount the employee get paid annually",
      required_error: "All employees must have a salary",
      invalid_type_error: "Salary must be a numeric value",
    })
    .positive("Must be a positive value for salary"),
  holidayAllowance: z
    .number({
      description: "The number of days the employee gets for holiday annually",
      required_error: "Every employee gets a holiday allowance",
      invalid_type_error: "holiday allowance should be a numeric value",
    })
    .positive("holiday allowance must be a positive number")
    .max(
      365,
      "An employee cannot have more than a years worth of days off a year",
    ),
  roles: z.array(RoleSchema, {
    description: "The roles that the employee takes up within the company",
    required_error: "Every employee has a role in the company",
    invalid_type_error: "roles is an array",
  }),
});

type Employee = z.infer<typeof EmployeeSchema>;
export default Employee;
