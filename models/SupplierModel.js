import {Sequelize} from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Supplier = db.define('supplier',{
    namaSupplier: {
        type: DataTypes.STRING
    },  alamat: {
        type: DataTypes.STRING
    },  telepon: {
        type: DataTypes.STRING
    }
},{
    freezeTableName:true
});

export default Supplier;