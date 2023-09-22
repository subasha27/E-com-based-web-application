"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productsController_1 = __importDefault(require("../controller/productsController"));
const middleware_1 = __importDefault(require("../Middleware/middleware"));
const router = express_1.default.Router();
router.post("/createProduct", middleware_1.default, productsController_1.default.createProduct);
router.put("/UpdateProduct/:id", middleware_1.default, productsController_1.default.updateProduct);
router.delete("/DeleteProduct/:id", middleware_1.default, productsController_1.default.deleteProduct);
router.get("/GetProduct/:id", middleware_1.default, productsController_1.default.getProduct);
router.get("/GetAllProduct", productsController_1.default.getAllProduct);
exports.default = router;
