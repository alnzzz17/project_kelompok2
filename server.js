const express = require('express');
const app = express();

// Import the user router
const userRouter = require("./routes/user");
// const appointmentRouter = require("./routes/appointment"); (uncomment kalau mau testing)

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the user router
app.use(userRouter);

// CORS configuration
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Default route
app.get("/", (req, res, next) => {
  try {
    res.json({
      message: "Hello from another service"
    });
  } catch (error) {
    console.log(error);
  }
});

const association = require('./util/dbAssoc'); // Assuming this sets up database associations

association()
  .then(() => {
    app.listen(5000, () => {
      console.log("connected to db and server is running on port 5000");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
