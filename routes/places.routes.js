const router = require("express").Router();
const controller = require("../controllers/places.controller");

const multer = require('multer');
const multerConfig = require('../config/multer');

router.get("/", controller.getPlaces); 

router.get("/:id", controller.getPlace);

router.delete('/:id', controller.deletePlace);

router.put("/:id", controller.updatePlace);

router.post("/create", multer(multerConfig).single('file'), controller.createPlace);


module.exports = (app, verifyJWT) => app.use("/places", verifyJWT, router);
