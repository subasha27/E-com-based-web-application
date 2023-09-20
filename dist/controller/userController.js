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
exports.handleSuccessCallback = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const handleSuccessCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user || !user.emails || user.emails.length === 0) {
            return res.redirect('/sign/auth/google/callback/failure');
        }
        const { displayName, emails } = user;
        const name = displayName || '';
        const email = emails[0].value || '';
        let userToken = "";
        if (email.length > 0) {
            console.log(email);
            const token = jsonwebtoken_1.default.sign(email, process.env.SecretKeyForUser);
            userToken = token;
        }
        const existingUser = yield userModel_1.default.findOne({ where: { email } });
        let id = 0;
        if (existingUser) {
            // User with the same email exists, update their information
            existingUser.name = name;
            id = existingUser.id;
            yield existingUser.save();
        }
        else {
            // User with the same email doesn't exist, create a new user
            const newUser = yield userModel_1.default.create({ name, email });
            id = newUser.id;
        }
        res.setHeader('Content-Type', 'text/html');
        return res.send('Welcome ' + name + '<br>' + '<br>' + `User Token : ${userToken}` + '<br>' + `ID :${id}`);
    }
    catch (error) {
        console.error('Error saving user data:', error);
        return res.redirect('/sign/auth/google/callback/failure');
    }
});
exports.handleSuccessCallback = handleSuccessCallback;
