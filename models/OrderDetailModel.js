import {Sequelize} from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

export const OrderDetail = db.define('orderDetails',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    kdProduk:{
        type:DataTypes.STRING
    },orderId:{
        type:DataTypes.INTEGER
    },qty:{
        type:DataTypes.INTEGER
    },harga:{
        type:DataTypes.DECIMAL
    },hargaBeli:{
        type:DataTypes.DECIMAL
    }
    
},{
    freezeTableName:true
});

export default OrderDetail;