import {Sequelize} from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Unit = db.define('unit',{
    namaSatuan: {
        type: DataTypes.STRING
      }
},{
    freezeTableName:true
});

export default Unit;