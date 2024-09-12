import express from "express";
import { SERVER } from "./config";
import cookieParser from "cookie-parser";
import router from "./routers/router";
import { errorHandler } from "./helper/generalFunction";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(router);
app.use(errorHandler);

app.listen(SERVER.PORT, () =>
  console.log(`Server Listen at http://localhost:${SERVER.PORT}`)
);
