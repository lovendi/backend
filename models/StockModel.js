import {Sequelize} from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Stock = db.define('stock',{
    tglMasuk: {
        type: DataTypes.DATEONLY
    }, 
    qtyIn: {
        type: DataTypes.INTEGER
    }
},{
    freezeTableName:true
});

export default Stock;