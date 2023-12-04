import { Router } from "express";
import { MongoClient } from "mongodb";
import Database from "../service/Database";
import { PathLike } from "fs";
import { preloadEmployees } from "../service/EmployeeDB";
import { loadAdmins } from "../service/AdminDB";

const { url, dbName } = Database;

const setup = (employeeFile: PathLike, adminFile: PathLike) => {
  const router = Router();

  const isSetup = async (): Promise<boolean> => {
    const client = new MongoClient(url);
    try {
      await client.connect();
      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();
      return collections.length !== 0;
    } catch (e: unknown) {
      console.error(e);
      return Promise.reject(e);
    } finally {
      client.close();
    }
  };

  router.get("/setup", async (_, res) => {
    const client = new MongoClient(url);
    try {
      const alreadySetup = await isSetup();
      if (!alreadySetup) {
        //set up collections
        await Promise.all([
          preloadEmployees(employeeFile),
          loadAdmins(adminFile),
        ]);
      }
      res.send("setup complete");
    } catch (e: unknown) {
      console.error(e);
    } finally {
      client.close();
    }
  });
  return router;
};
export default setup;
