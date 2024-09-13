import express from "express";
import { SERVER } from "./config";
import cookieParser from "cookie-parser";
import router from "./routers/router";
import { errorHandler } from "./helper/generalFunction";
import { existsSync, mkdirSync } from "fs";
import path from "path";
const app = express();

const publicPath: string = path.join(__dirname, "../public");
const uploadPath: string = path.join(__dirname, "../public/uploads");
if (!existsSync(publicPath)) {
  mkdirSync(publicPath);
}
if (!existsSync(uploadPath)) {
  mkdirSync(uploadPath);
}
app.use(express.json());
app.use(cookieParser());

app.use(router);
app.use(errorHandler);

app.listen(SERVER.PORT, () =>
  console.log(`Server Listen at http://localhost:${SERVER.PORT}`)
);
