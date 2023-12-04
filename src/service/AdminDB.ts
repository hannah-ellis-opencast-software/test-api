import { PathLike } from "fs";
import { Admin, AdminList, AdminListSchema } from "../model/Admin";
import { readFile } from "fs/promises";
import { MongoClient } from "mongodb";
import Database from "./Database";

const { url, dbName, adminCollectionName } = Database;

const readAdminKeys = async (path: PathLike): Promise<AdminList> => {
  const file = await readFile(path);
  const obj = JSON.parse(file.toString());
  const admins = AdminListSchema.parse(obj);
  return admins;
};

const addAdmins = async (admins: AdminList) => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection<Admin>(adminCollectionName);
    const result = await collection.insertMany(admins);
  } catch (e: unknown) {
    console.error(e);
  } finally {
    client.close();
  }
};

export const loadAdmins = async (filepath: PathLike) => {
  const admins = await readAdminKeys(filepath);
  await addAdmins(admins);
};

export const getAdminUsername = async (
  target: string,
): Promise<string | undefined> => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection<Admin>(adminCollectionName);
    const result = await collection.findOne({ key: target });
    return result?.username;
  } catch (e: unknown) {
    console.error(e);
    return undefined;
  } finally {
    client.close();
  }
};
