const router = require("express").Router();
const controller = require("../controllers/vote.controller");

router.get("/:id", controller.getPlacesToVote);
router.put("/:id", controller.vote)

module.exports = app => app.use("/vote", router);
