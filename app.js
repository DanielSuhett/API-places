require('dotenv').config()

const express = require("express");
const app = express();
const verifyJWT = require('./config/auth');

require("./config/middlewares")(app);

require("./routes/places.routes")(app, verifyJWT);
require("./routes/auth.routes")(app);
require("./routes/vote.routes")(app);

require('./config/server')(app)
    


   