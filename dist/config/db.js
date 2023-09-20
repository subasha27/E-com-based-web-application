"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('shoping', 'root', 'rootpass', {
    host: 'localhost',
    dialect: 'mysql'
});
sequelize.authenticate().then(() => {
    console.log("Connection established successfully");
}).catch((error) => {
    console.log("Connection Error", error);
});
exports.default = sequelize;
