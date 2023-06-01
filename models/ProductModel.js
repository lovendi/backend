import {Sequelize} from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

export const Product = db.define('product',{
    kodeProduk: {
        type: DataTypes.STRING,
        primaryKey: true
    }
    , namaProduk:{
        type:DataTypes.STRING
    }, qty:{
        type:DataTypes.INTEGER
    }, hargaBeli:{
        type:DataTypes.INTEGER
    }, hargaJual:{
        type:DataTypes.INTEGER
    }
    
},{
    freezeTableName:true
});

export default Product;