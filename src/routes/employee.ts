import { Router } from "express";
import { EmployeeSchema } from "../model/Employee";
import { StatusCodes } from "http-status-codes";
import { addEmployee, allEmployees, findEmployee } from "../service/EmployeeDB";
import { ObjectId } from "mongodb";
import { getAdminUsername } from "../service/AdminDB";

const employee = Router();
employee.get("/all", async (req, res) => {
  const userKey = req.header("x-admin-key");
  if (!userKey) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }
  const username = await getAdminUsername(userKey);
  if (!username) {
    res.sendStatus(StatusCodes.FORBIDDEN);
    return;
  }
  console.log(
    `*** admin ${username} accessed all employee records at ${new Date().toString()} ***`,
  );
  const employees = await allEmployees();
  res.json(employees);
});

employee.get("/all", async (_, res) => {
  const employees = await allEmployees();
  res.json(employees);
});

employee.get("/:id", async (req, res) => {
  const { id } = req.params;
  const employee = await findEmployee(new ObjectId(id));
  if (!employee) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }
  res.json(employee);
});

employee.post("/", async (req, res) => {
  const body = EmployeeSchema.safeParse(req.body);
  if (!body.success) {
    const errors = body.error.issues.map((issue) => issue.message);
    res.status(StatusCodes.BAD_REQUEST).json({ errors });
    return;
  }
  const { data } = body;
  const id = await addEmployee(data);
  res.json({ id });
});

export default employee;
