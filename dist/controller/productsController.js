"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productModel_1 = __importDefault(require("../model/productModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class product {
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productData = req.body;
            try {
                const existingStaff = yield productModel_1.default.findOne({ where: { productName: productData.productName } });
                if (existingStaff)
                    return res.send({ message: "product Already exists" });
                const productCreation = yield productModel_1.default.create(productData);
                const product_id = productCreation.id;
                return res.send({ message: "products added Successfully", product_id });
            }
            catch (err) {
                console.error(err);
                return res.send({ message: "Server Error", err });
            }
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = req.params.id;
            const updatedData = req.body;
            try {
                const existingProduct = yield productModel_1.default.findByPk(productId);
                if (!existingProduct)
                    return res.status(404).json({ message: "Product not found" });
                yield existingProduct.update(updatedData);
                return res.status(200).json({ message: "Product updated successfully" });
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ message: "Server Error", error: err });
            }
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = req.params.id;
            try {
                const existingProduct = yield productModel_1.default.findByPk(productId);
                if (!existingProduct)
                    return res.status(404).json({ message: "Product not found" });
                yield existingProduct.destroy();
                return res.status(200).json({ message: "Product deleted successfully" });
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ message: "Server Error", error: err });
            }
        });
    }
    getProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = req.params.id;
            try {
                const product = yield productModel_1.default.findByPk(productId);
                if (!product)
                    return res.status(404).json({ message: "Product not found" });
                return res.status(200).json({ product });
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ message: "Server Error", error: err });
            }
        });
    }
    getAllProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = req.params.id;
            try {
                const product = yield productModel_1.default.findAll();
                return res.status(200).json({ product });
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ message: "Server Error", error: err });
            }
        });
    }
}
exports.default = new product();
