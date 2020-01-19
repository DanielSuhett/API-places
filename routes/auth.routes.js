const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");

router.post("/signup", controller.createUser);

router.post("/signin", controller.login);

module.exports = (app) => app.use(router);
