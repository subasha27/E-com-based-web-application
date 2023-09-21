import express from "express";
import SuperAdminController from "../controller/SuperAdminController";
import StaffController from "../controller/StaffController";
import authenticateToken from "../Middleware/middleware";
const router = express.Router();


//Admin creation and login
router.post("/SuperAdmin",SuperAdminController.superAdminCreate);
router.post("/SuperAdminLogin",SuperAdminController.superAdminLogin);

//staff creation and login
router.post("/StaffCreation",authenticateToken,StaffController.staffCreate);
router.post("/StaffFirstLogin",StaffController.staffFirstLogin);
router.post("/StaffLogin",StaffController.staffLogin);


export default router;