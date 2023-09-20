import sequelize from "../config/db"
import { Sequelize, Model, DataTypes } from "sequelize";

class products extends Model {
    public id!: number;
    public productName!: string;
    public details!: string;
    public price!: number;
    public specification!:string;
    public stock!:number;
    
}


products.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    details: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    specification:{
        type:DataTypes.STRING,
        allowNull: false
    },
    stock:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
}, {
    sequelize,
    modelName: "products",
    timestamps: true
}
)

export default products;  