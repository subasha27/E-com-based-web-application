import express from "express";
import productController from "../controller/productsController";
import authenticateToken from "../Middleware/middleware";
const router = express.Router();

router.post("/createProduct",authenticateToken,productController.createProduct);
router.put("/UpdateProduct/:id",authenticateToken,productController.updateProduct);
router.delete("/DeleteProduct/:id",authenticateToken,productController.deleteProduct);
router.get("/GetProduct/:id",authenticateToken,productController.getProduct);
router.get("/GetAllProduct",productController.getAllProduct);

export default router;