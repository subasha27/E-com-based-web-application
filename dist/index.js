"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const superAdminRouter_1 = __importDefault(require("./router/superAdminRouter"));
const productsRouter_1 = __importDefault(require("./router/productsRouter"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
const userShoping_1 = __importDefault(require("./router/userShoping"));
const db_1 = __importDefault(require("./config/db"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: 'samsub',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/api", superAdminRouter_1.default);
app.use("/api", productsRouter_1.default);
app.use("/", userRouter_1.default);
app.use("/api", userShoping_1.default);
db_1.default.sync();
const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`);
});
