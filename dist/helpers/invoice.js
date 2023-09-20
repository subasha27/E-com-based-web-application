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
exports.sendEmail = exports.invoiceGen = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const userShopingModel_1 = __importDefault(require("../model/userShopingModel"));
const invoiceGen = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield userShopingModel_1.default.findAll({ where: { id: orderId } });
    const totalAmount = orders.reduce((acc, order) => acc + order.price * order.quantity, 0);
    const invoiceNumber = orderId;
    const invoice = {
        invoiceNumber,
        totalAmount,
        orders,
    };
    return invoice;
});
exports.invoiceGen = invoiceGen;
const sendEmail = (mail, invoice) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.user,
            pass: process.env.pass
        },
    });
    yield transporter.sendMail({
        from: process.env.user,
        to: mail,
        subject: "Purchase Order",
        html: `<pre>${JSON.stringify(invoice, null, 2)}</pre>`
    });
    console.log("email sent sucessfully");
});
exports.sendEmail = sendEmail;
