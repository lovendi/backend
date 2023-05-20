import {Sequelize} from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

export const Orders = db.define('orders',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    invoiceNo:{
        type:DataTypes.STRING
    },
    username:{
        type:DataTypes.STRING
    },total:{
        type:DataTypes.DECIMAL
    },bayar:{
        type:DataTypes.DECIMAL
    },subtotal:{
        type:DataTypes.DECIMAL
    },tax:{
        type:DataTypes.DECIMAL
    },discount:{
        type:DataTypes.DECIMAL
    },taxRate:{
        type:DataTypes.DECIMAL
    },discountRate:{
        type:DataTypes.DECIMAL
    },kembalian:{
        type:DataTypes.DECIMAL
    }
    
},{
    freezeTableName:true
});

export default Orders;