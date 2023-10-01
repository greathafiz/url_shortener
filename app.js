require("express-async-errors");
require('dotenv').config()
const express = require("express");
const app = express();
const urlRouter = require("./routes/url");
const redirectRouter = require("./routes/redirect");
const connectDB = require("./db/connect");
const errorHandlerMiddleware = require("./middleware/error-handler");

const port = process.env.PORT || 3000;

app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", redirectRouter);
app.use("/api/v1", urlRouter);

app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB();
    app.listen(port, console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error(error);
  }
};

start();
