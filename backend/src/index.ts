import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./dataSource/dataSource";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
