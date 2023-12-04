import express, { json } from "express";
import morgan from "morgan";
import employee from "./routes/employee";
import { join } from "path";
import { exit } from "process";
import setup from "./routes/setup";

const start = async () => {
  try {
    const app = express();
    app.use(json());
    app.use(morgan("combined"));

    app.use("/employee", employee);
    app.use(
      "/",
      setup(
        join(__filename, "..", "..", "employees.json"),
        join(__filename, "..", "..", "keys.json"),
      ),
    );

    const host: string = "0.0.0.0";
    const port: number = 8080;
    app.listen(port, host, () => console.log(`listening on ${host}:${port}`));
  } catch (e) {
    console.error("Could not start service : ", e);
    exit(1);
  }
};

start();
