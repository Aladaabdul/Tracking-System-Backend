const express = require("express");
const movementController = require("../controllers/movement-controller");
const { authenticateOffice } = require("../config/auth");


const movementRouter = express.Router();


movementRouter.post('/movements/:docId', authenticateOffice, movementController.createMovement);
movementRouter.get('/movements/:docId', movementController.getAllDocMovement);


module.exports = movementRouter;