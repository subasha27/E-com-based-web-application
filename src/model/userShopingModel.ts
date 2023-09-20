import sequelize from "../config/db"
import { Sequelize, Model, DataTypes } from "sequelize";

class OrderPlace extends Model {
    public id!: number;
    public user_id!: number;
    public product_id!: number;
    public product_Name!:string;
    public quantity!: number;
    public price!: number;
}


OrderPlace.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "OrderPlace",
    timestamps: true
}
)

export default OrderPlace;  