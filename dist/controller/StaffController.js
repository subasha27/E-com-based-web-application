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
const staffModel_1 = __importDefault(require("../model/staffModel"));
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SendEmail_1 = __importDefault(require("../helpers/SendEmail"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Staff {
    staffCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const staffData = req.body;
            const staffPass = req.body.password;
            try {
                const existingStaff = yield staffModel_1.default.findOne({ where: { mail: staffData.mail } });
                if (existingStaff)
                    return res.send({ message: "staff mail Already exists" });
                const hashedPassword = yield bcrypt.hash(req.body.password, 10);
                staffData.password = hashedPassword;
                const staffCreation = yield staffModel_1.default.create(staffData);
                const id = staffCreation.id;
                const subject = "Account Created";
                const text = `New Accounnt Is created \n id : ${id}\npassword : ${staffPass}`;
                yield SendEmail_1.default.sendEmail(staffData.mail, subject, text);
                return res.send({ message: "Staff member created Successfully", id });
            }
            catch (err) {
                console.error(err);
                return res.send({ message: "Server Error", err });
            }
        });
    }
    staffFirstLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const staffData = req.body;
            try {
                const existingStaff = yield staffModel_1.default.findOne({ where: { mail: staffData.mail } });
                if (!existingStaff)
                    return res.send({ message: "Staff does not exists" });
                const comparePass = yield bcrypt.compare(staffData.password, existingStaff.password);
                if (comparePass) {
                    const hashedPassword = yield bcrypt.hash(req.body.newpass, 10);
                    const newNamePass = {
                        name: req.body.name,
                        password: hashedPassword
                    };
                    yield existingStaff.update(newNamePass);
                    return res.send({ message: "Initial Login Successfull and the password is changed" });
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
    staffLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const staffData = req.body;
            try {
                const existingStaff = yield staffModel_1.default.findOne({ where: { mail: staffData.mail } });
                if (!existingStaff)
                    return res.send({ message: "Staff does not exists" });
                const comparePass = yield bcrypt.compare(staffData.password, existingStaff.password);
                if (comparePass) {
                    const token = jsonwebtoken_1.default.sign(staffData.mail, process.env.Secret);
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
exports.default = new Staff();
