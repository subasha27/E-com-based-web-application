import sequelize from "../config/db"
import { Sequelize, Model, DataTypes } from "sequelize";

class StaffMembers extends Model {
    public id!: number;
    public name!: string;
    public mail!: string;
    public password!: string;
}


StaffMembers.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mail: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "StaffMembers",
    timestamps: true
}
)

export default StaffMembers;  