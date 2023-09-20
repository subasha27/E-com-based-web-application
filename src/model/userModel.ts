import sequelize from "../config/db"
import { Sequelize, Model, DataTypes } from "sequelize";

class UserLogins extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
}


UserLogins.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: "UserLogins",
    timestamps: true
}
)

export default UserLogins;  