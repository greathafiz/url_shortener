require("express-async-errors");
const express = require("express");
const app = express();
const urlRouter = require("./routes/url");
const redirectRouter = require('./routes/redirect')
const connectDB = require("./db/connect");

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use('/', redirectRouter)
app.use("/api/v1", urlRouter);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error(error);
  }
};

start();
