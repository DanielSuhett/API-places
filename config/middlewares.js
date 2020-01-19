const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors")

module.exports = app => {
  app.use(bodyParser.json());
  app.use(cors())

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use(logger("dev"));
  
}

