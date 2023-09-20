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
const userShopingModel_1 = __importDefault(require("../model/userShopingModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const sequelize_1 = require("sequelize");
const exceljs_1 = __importDefault(require("exceljs"));
const invoice_1 = require("../helpers/invoice");
const dotenv_1 = __importDefault(require("dotenv"));
const Wishlist_1 = __importDefault(require("../model/Wishlist"));
dotenv_1.default.config();
class UserShopee {
    getAllProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
    oderPlacing(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let orderIdTo = 0;
                const productData = req.body;
                const productQuantity = typeof (productData.product_id);
                const user = req.user;
                if (productQuantity == 'number') { // For One Product Purchase
                    const userId = yield userModel_1.default.findOne({ where: { email: user } });
                    if (!userId)
                        return res.send({ message: "User Not Found" });
                    const productDetail = yield productModel_1.default.findByPk(productData.product_id);
                    if (!productDetail)
                        return res.status(404).json({ message: "Product Not Found" });
                    if (productDetail) {
                        if (productDetail.stock >= productData.quantity) {
                            productData.user_id = userId.id;
                            productData.product_Name = productDetail.productName;
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const totalQuantityPurchasedToday = yield userShopingModel_1.default.sum('quantity', {
                                where: {
                                    user_id: userId.id,
                                    createdAt: { [sequelize_1.Op.gte]: today }
                                }
                            });
                            if (totalQuantityPurchasedToday >= 5) {
                                return res.status(403).json({ error: 'You can only buy a maximum of 5 products in total per day.' });
                            }
                            productData.price = productData.quantity * productDetail.price;
                            const quantityLesser = productDetail.stock - productData.quantity;
                            yield productModel_1.default.update({ stock: quantityLesser }, { where: { id: productData.product_id } });
                            const order = yield userShopingModel_1.default.create(productData);
                            orderIdTo = order.id;
                            const createdInvoice = yield (0, invoice_1.invoiceGen)(orderIdTo);
                            (0, invoice_1.sendEmail)(user, createdInvoice);
                            console.log(order.id);
                            return res.send({ message: "Order Placed Successfully", order });
                        }
                        else {
                            return res.send({ message: `Choose less Quantity, The available quantity is : ${productDetail.stock}` });
                        }
                    }
                }
                if (productQuantity == 'undefined') {
                    const productData = req.body;
                    const user = req.user;
                    // Ensure that productData is an array
                    if (!Array.isArray(productData)) {
                        return res.status(400).json({ error: 'Invalid product data format. Expecting an array.' });
                    }
                    const userId = yield userModel_1.default.findOne({ where: { email: user } });
                    if (!userId)
                        return res.send({ message: "User Not Found" });
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const totalQuantityPurchasedToday = yield userShopingModel_1.default.sum('quantity', {
                        where: {
                            user_id: userId.id,
                            createdAt: { [sequelize_1.Op.gte]: today }
                        }
                    });
                    // Calculate the total quantity of products being purchased
                    const totalQuantityBeingPurchased = productData.reduce((total, item) => {
                        if (typeof item.product_id === 'number' && typeof item.quantity === 'number') {
                            return total + item.quantity;
                        }
                        return total;
                    }, 0);
                    if (totalQuantityPurchasedToday + totalQuantityBeingPurchased > 5) {
                        return res.status(403).json({ error: 'You can only buy a maximum of 5 products in total per day.' });
                    }
                    // Process each product in the array
                    for (const item of productData) {
                        if (typeof item.product_id === 'number' && typeof item.quantity === 'number') {
                            const productDetail = yield productModel_1.default.findByPk(item.product_id);
                            if (!productDetail)
                                return res.status(404).json({ message: "Product Not Found" });
                            if (productDetail.stock >= item.quantity) {
                                item.user_id = userId.id;
                                item.product_Name = productDetail.productName;
                                item.price = item.quantity * productDetail.price;
                                const quantityLesser = productDetail.stock - item.quantity;
                                yield productModel_1.default.update({ stock: quantityLesser }, { where: { id: item.product_id } });
                                const order = yield userShopingModel_1.default.create(item);
                                orderIdTo = order.id;
                                const createdInvoice = yield (0, invoice_1.invoiceGen)(orderIdTo);
                                (0, invoice_1.sendEmail)(user, createdInvoice);
                            }
                            else {
                                return res.send({ message: `Choose less Quantity, The available quantity for product ${productDetail.productName} is: ${productDetail.stock}` });
                            }
                        }
                    }
                    return res.status(201).json({ message: 'Orders placed successfully' });
                }
            }
            catch (err) {
                console.error(err);
                return res.send({ message: "Server Error", err });
            }
        });
    }
    updateOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedData = req.body;
            try {
                const existingProduct = yield productModel_1.default.findAll();
                if (!existingProduct)
                    return res.status(404).json({ message: "Order not found" });
                yield existingProduct[0].update(updatedData);
                return res.status(200).json({ message: "Order updated successfully" });
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ message: "Server Error", error: err });
            }
        });
    }
    addToWishlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, productId } = req.body;
                const user = yield userModel_1.default.findByPk(userId);
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }
                const wishlistData = yield Wishlist_1.default.create(req.body);
                return res.status(201).json({ message: 'Product added to wishlist' });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    csvGenerate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const csvData = yield userShopingModel_1.default.findAll();
                const workbook = new exceljs_1.default.Workbook();
                const worksheet = workbook.addWorksheet("Table Data");
                worksheet.columns = [
                    { header: "id", key: "id", width: 15 },
                    { header: "user_id", key: "user_id", width: 15 },
                    { header: "product_id", key: "product_id", width: 15 },
                    { header: "product_Name", key: "product_Name", width: 15 },
                    { header: "quantity", key: "quantity", width: 15 },
                    { header: "price", key: "price", width: 15 }
                    // Excel format
                ];
                csvData.forEach((user) => {
                    worksheet.addRow(user);
                });
                const excelBuffer = yield workbook.xlsx.writeBuffer();
                const excelFileName = "Report.xlsx"; // The name of the downloaded Excel file
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename=${excelFileName}`);
                res.send(excelBuffer);
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ message: "Server Error", error: err });
            }
        });
    }
}
exports.default = new UserShopee();
