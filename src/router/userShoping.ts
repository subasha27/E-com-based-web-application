import express from "express";
import usershopee from "../controller/userShoping";
import userToken from "../Middleware/userMiddleware";
const router = express.Router();

router.get("/GetAllProduct",userToken,usershopee.getAllProduct);
router.post("/Order",userToken,usershopee.oderPlacing);
router.put("/Order/:id",userToken,usershopee.updateOrder);
router.get('/generateCsv',usershopee.csvGenerate);
router.post("/Wishlist",userToken,usershopee.addToWishlist)

export default router;