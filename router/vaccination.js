const express =require ('express');
const vaccination=require('../controller/vaccination');
const router=express.Router();

router.get("/get",vaccination.GetAllVaccination);
router.get("/get/:id",vaccination.getVaccinationById);
router.post("/add",vaccination.addMemberVaccinate);


module.exports=router;