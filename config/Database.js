import {Sequelize} from "sequelize";

const db = new Sequelize('postgres','postgres','pPiwBAcDN1tsFDvA',{
    host: 'db.ocohnvdeemzqygqydnsb.supabase.co',
    dialect: 'postgres'
});

export default db;