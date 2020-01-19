const router = require("express").Router();
const controller = require("../controllers/places.controller");

router.get("/:id", controller.getPlace);
router.put("/:id", controller.votedPlace)

module.exports = app => app.use("/vote", router);
