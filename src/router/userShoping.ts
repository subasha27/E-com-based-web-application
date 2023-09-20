import express from "express";
import usershopee from "../controller/userShoping";
import userToken from "../helpers/userMiddleware";
const router = express.Router();

router.get("/GetAllProduct",usershopee.getAllProduct);
router.post("/Order",userToken,usershopee.oderPlacing);
router.put("/Order/:id",userToken,usershopee.updateOrder);
router.get('/generateCsv',usershopee.csvGenerate);

export default router;