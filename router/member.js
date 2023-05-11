const express =require ('express');
const member=require('../controller/members');
const router=express.Router();

router.get("/get/:id",member.GetMemberById);
router.post("/add",member.addMemberToDB);
router.get("/get",member.GetAll);

module.exports=router;