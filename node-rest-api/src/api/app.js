// src/api/app.js

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRoutes = require('./routes/user.route');
const taskRoutes = require('./routes/task.route');
const historyRoutes = require('./routes/history.route');
const loginRoutes = require('./routes/auth.route');
const { logger, morganMiddleware } = require("../config/logger");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

// use the morganMiddleware function to log request errors and response time
app.use(morganMiddleware);


app.use('/api', userRoutes);
app.use('/api', taskRoutes);
app.use('/api', historyRoutes);
app.use('/api', loginRoutes);


// define a route that returns an error
app.get("/error", function (req, res, next) {
    // simulate an error by calling next() with an error object
    next(new Error("Server error"));
  });
  
  // define a route that returns a success response
  app.get("/success", function (req, res) {
    res.send("Hello, world!");
  });


app.use(function (err, req, res, next) {
    // log the error using Winston
    logger.error(err.message, { stack: err.stack });
    
    // check if the error status is 404
    if (err.status === 404) {
      // respond with the error message
      res.status(404).send(err.message);
    } else {
      // respond with a generic error message
      res.status(500).send("Server error");
    }
  });
  

module.exports = app;