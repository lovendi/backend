import {Sequelize} from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const StockHistory = db.define('stockHistory',{
    tglMasuk: {
        type: DataTypes.DATEONLY
    }, 
    qtyIn: {
        type: DataTypes.INTEGER
    }
},{
    freezeTableName:true
});

export default StockHistory;