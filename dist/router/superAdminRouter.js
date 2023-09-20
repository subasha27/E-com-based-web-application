"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SuperAdminController_1 = __importDefault(require("../controller/SuperAdminController"));
const StaffController_1 = __importDefault(require("../controller/StaffController"));
const middleware_1 = __importDefault(require("../helpers/middleware"));
const router = express_1.default.Router();
//Admin creation and login
router.post("/SuperAdmin", SuperAdminController_1.default.superAdminCreate);
router.post("/SuperAdminLogin", SuperAdminController_1.default.superAdminLogin);
//staff creation and login
router.post("/StaffCreation", middleware_1.default, StaffController_1.default.staffCreate);
router.post("/StaffFirstLogin", StaffController_1.default.staffFirstLogin);
router.post("/StaffLogin", StaffController_1.default.staffLogin);
exports.default = router;
