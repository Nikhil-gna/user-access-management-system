import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./dataSource/dataSource";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import softwareRoutes from "./routes/software.routes";
import requestRoutes from "./routes/request.routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();
const app = express();

const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});
app.use("/api/auth", authRoutes);
app.use("/api/software", softwareRoutes);
app.use("/api/requests", requestRoutes);

app.use(errorHandler);

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
