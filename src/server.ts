import { Router } from "express";
import express from "express";
import router from "./routes";
import { Mongoose } from "mongoose";
import connectDB from "./db/mongoose";
import cors from "cors";

const server = express();
// const router = Router();

const port = 3333;
const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
  optionSuccessStatus: 200,
};
server.use(cors(corsOptions));
server.use(express.json());

server.use(router);

connectDB();

server.listen(port, () => {
  console.log(`Server ta rodando${port} `);
});
