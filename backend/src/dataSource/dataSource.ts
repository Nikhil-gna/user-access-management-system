import { DataSource } from "typeorm";
import { User } from "../entities/User.entity";
import { Software } from "../entities/Software.entity";
import { Request } from "../entities/Request.entity";
import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Software, Request],
});
