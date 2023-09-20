"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userShoping_1 = __importDefault(require("../controller/userShoping"));
const userMiddleware_1 = __importDefault(require("../helpers/userMiddleware"));
const router = express_1.default.Router();
router.get("/GetAllProduct", userShoping_1.default.getAllProduct);
router.post("/Order", userMiddleware_1.default, userShoping_1.default.oderPlacing);
router.put("/Order/:id", userMiddleware_1.default, userShoping_1.default.updateOrder);
router.get('/generateCsv', userShoping_1.default.csvGenerate);
exports.default = router;
