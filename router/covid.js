const express = require('express');
const covid = require('../controller/covid');
const router = express.Router();

router.post("/add", covid.addInfectedToDB);
router.get("/get/:id", covid.getInfectionByMemberId);
router.get("/get", covid.GetAllVacc);

module.exports = router;