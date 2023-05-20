import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import ProductRoute from "./routes/ProductRoute.js";
import CategoryRoute  from "./routes/CategoryRoute.js";
import UnitRoute  from "./routes/UnitRoute.js";
import SupplierRoute  from "./routes/SupplierRoute.js";
import StockRoute  from "./routes/StockRoute.js";
import OrderRoute  from "./routes/OrderRoute.js";
import UserRoute  from "./routes/UserRoute.js";
import Product from "./models/ProductModel.js";
import Category from "./models/CategoryModel.js";
import Unit from "./models/UnitModel.js";
import Supplier from "./models/SupplierModel.js";
import Stock from "./models/StockModel.js";
import db from "./config/Database.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

Category.hasMany(Product);
Unit.hasMany(Product);
Supplier.hasMany(Product);

Product.belongsTo(Category);
Product.belongsTo(Unit);
Product.belongsTo(Supplier)

Product.hasMany(Stock);
Supplier.hasMany(Stock);
Unit.hasMany(Stock);

Stock.belongsTo(Product);
Stock.belongsTo(Supplier);
Stock.belongsTo(Unit);

// (async()=>{
//   await db.sync();
// })();


app.use(ProductRoute);
app.use(CategoryRoute);
app.use(UnitRoute);
app.use(SupplierRoute);
app.use(StockRoute);
app.use(OrderRoute);
app.use(UserRoute);

app.listen(5000, ()=> console.log('Server up and running...'));