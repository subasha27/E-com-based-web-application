"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const SuperAdminModel_1 = __importDefault(require("../model/SuperAdminModel"));
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class SuperAdminCrud {
    superAdminCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const superAdminData = req.body;
            try {
                const existingAdmin = yield SuperAdminModel_1.default.findOne({ where: { mail: superAdminData.mail } });
                if (existingAdmin)
                    return res.send({ message: "Admin Already exists" });
                const hashedPassword = yield bcrypt.hash(req.body.password, 10);
                superAdminData.password = hashedPassword;
                const adminCreate = yield SuperAdminModel_1.default.create(superAdminData);
                const id = adminCreate.id;
                return res.send({ message: "Super Admin created Successfully", id });
            }
            catch (err) {
                console.error(err);
                return res.send({ message: "Server Error", err });
            }
        });
    }
    superAdminLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const superAdminData = req.body;
            try {
                const existingAdmin = yield SuperAdminModel_1.default.findOne({ where: { mail: superAdminData.mail } });
                if (!existingAdmin)
                    return res.send({ message: "Admin does not exists" });
                const comparePass = yield bcrypt.compare(superAdminData.password, existingAdmin.password);
                if (comparePass) {
                    const token = jsonwebtoken_1.default.sign(superAdminData.mail, process.env.Secret);
                    return res.send({ message: "Login Successfull", token });
                }
                else {
                    return res.send({ message: "Invalid Password" });
                }
            }
            catch (err) {
                console.error(err);
                return res.send({ message: "Server Error", err });
            }
        });
    }
}
exports.default = new SuperAdminCrud();
