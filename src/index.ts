// import bodyParser from "body-parser";
import express from "express";
import { PORT } from "./config";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import router from "./routers/router";
import { errorHandler } from "./helper/generalFunction";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(router);
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server Listen at http://localhost:${PORT}`)
);
