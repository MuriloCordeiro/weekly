import { Router } from "express";
import express from "express";
import router from "./routes";
import { Mongoose } from "mongoose";
import connectDB from "./db/mongoose";

const server = express();
// const router = Router();

const port = 3333;

server.use(express.json());

server.use(router);

connectDB();

server.listen(port, () => {
  console.log(`Server ta rodando${port} `);
});
