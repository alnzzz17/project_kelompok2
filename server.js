const express = require('express');
const app = express();

//import router user
const userRouter = require("./routes/user");
const appRouter = require("./routes/appointment");

//middleware untuk parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//router user
app.use(userRouter);
//router appointment
app.use(appRouter);

//konfigurasi CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

//default route
app.get("/", (req, res, next) => {
  try {
    res.json({
      message: "Hello from another service"
    });
  } catch (error) {
    console.log(error);
  }
});

const association = require('./util/dbAssoc'); //dbAssoc.js

association()
  .then(() => {
    app.listen(5000, () => {
      console.log("connected to db and server is running on port 5000");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
