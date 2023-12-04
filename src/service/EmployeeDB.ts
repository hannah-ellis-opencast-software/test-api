import { MongoClient, ObjectId, WithId } from "mongodb";
import Employee, { EmployeeSchema } from "../model/Employee";
import { PathLike } from "fs";
import { readFile } from "fs/promises";
import { z } from "zod";
import Database from "./Database";

const { url, dbName, employeeCollectionName } = Database;

const readEmployeeList = async (filePath: PathLike): Promise<Employee[]> => {
  try {
    const file = await readFile(filePath);
    const data = file.toString();
    const obj = JSON.parse(data);
    const parsed = z.array(EmployeeSchema).safeParse(obj);
    if (!parsed.success) {
      const errors =
        "Parse Error when reading employee list file:\n" +
        parsed.error.issues.map((issue) => issue.message).join("\n");
      console.error(errors);
      throw new Error(errors);
    }
    return parsed.data;
  } catch (e) {
    //if all else fails log and give back empty
    console.error("Could not parse file : ", e);
    return [];
  }
};

export const preloadEmployees = async (filePath: PathLike) => {
  const employees = await readEmployeeList(filePath);
  await Promise.all(employees.map((employee) => addEmployee(employee)));
};

export const addEmployee = async (employee: Employee): Promise<ObjectId> => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection<Employee>(employeeCollectionName);
    const result = await collection.insertOne(employee);
    return result.insertedId;
  } catch (e: unknown) {
    console.error(e);
    return Promise.reject();
  } finally {
    client.close();
  }
};

export const allEmployees = async (): Promise<WithId<Employee>[]> => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection<Employee>(employeeCollectionName);
    return await collection.find({}).toArray();
  } catch (e: unknown) {
    console.error(e);
    return Promise.reject();
  } finally {
    client.close();
  }
};

export const findEmployee = async (
  target: ObjectId,
): Promise<WithId<Employee> | null> => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection<Employee>(employeeCollectionName);
    return await collection.findOne({ _id: target });
  } catch (e: unknown) {
    console.error(e);
    return Promise.reject();
  } finally {
    client.close();
  }
};
