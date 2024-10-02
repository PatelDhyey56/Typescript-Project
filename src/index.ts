import cookieParser from "cookie-parser";
import express from "express";
import { existsSync, mkdirSync } from "fs";
import { createServer } from "http";
import path from "path";
import { SERVER } from "./config";
import { errorHandler } from "./helper/generalFunction";
import router from "./routers/router";

const app = express();
export const httpServer = createServer(app);

import "./helper/socket";

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

httpServer.listen(SERVER.PORT, () =>
  console.log(`Server Listen at http://localhost:${SERVER.PORT}`)
);
