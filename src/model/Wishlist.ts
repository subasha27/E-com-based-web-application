// models/Wishlist.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';


class Wishlist extends Model {
  public id!: number;
  public userId!: number;
}

Wishlist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id:{
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Wishlist', // Use PascalCase for model name
    timestamps: true,
  }
);

export default Wishlist;
