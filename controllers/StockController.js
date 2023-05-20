import db from "../config/Database.js";
import Stock from "../models/StockModel.js";
import Product from "../models/ProductModel.js"
import Supplier from "../models/SupplierModel.js"
import Unit from "../models/UnitModel"
import { Op } from "sequelize";

// export const getStocks = async(req, res) => {
//     try {
//         const response = await Stock.findAll({
//             attributes:['productKodeProduk','qtyIn','tglMasuk', 'supplierId'],
//             include: [{
//                 model: Supplier,
//                 attributes:['namaSupplier']
            
//         }, {
//             model: Product,
//             attributes:['namaProduk']
//         }]
            
//         });
//         res.json(response);
//     } catch (error) {
//         console.log(error);
//     }
// }

export const getStocks = async(req, res) =>{
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Stock.count({
       include: [{
        model: Product,
        attributes:['namaProduk'],
        where: {
            [Op.or]: [{namaProduk:{
                [Op.iLike]: '%'+search+'%'
            }}]
        }
       }]
    }); 
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Stock.findAll({
        attributes:['id','productKodeProduk','qtyIn','tglMasuk', 'supplierId'],
        include: [{
            model: Product,
            attributes:['namaProduk'],
            where:{
            [Op.or]: [{namaProduk:{
                [Op.iLike]: '%'+search+'%'
            }}]
        }
        
    }, {
        model: Supplier,
        attributes:['namaSupplier']
    }, {model: Unit,
        attributes:['namaSatuan']
    }],      
        
        offset: offset,
        limit: limit,
        order:[
            ['id', 'DESC']
        ]
    });
    res.json({
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage
    });
}


export const createStock= async(req, res) =>{
    const trx = await db.transaction();
    try {
        /**
         * checking data product by kodeProduk
         */
        let kdProduk = req.body['productKodeProduk']
        let qtyIn = req.body['qtyIn']
        let chkProduk = await Product.findOne({ where: { kodeProduk: kdProduk } })
        console.log(`----------------------`, chkProduk)
        if (!chkProduk) {
            return res.status(400).json({msg: "Kode Produk tidak ditemukan!"})
        }
        await Stock.create(req.body, { transaction: trx });

        await Product.update({ qty: (chkProduk['qty'] + qtyIn) }, { where: { kodeProduk: kdProduk }, transaction: trx })

        await trx.commit()
        
        res.status(201).json({msg: "Stock created"});
    } catch (error) {
        await trx.rollback();
        console.log(error.message);
    }
}

export const deleteStock = async(req, res) =>{
    const trx = await db.transaction();
    try {
        /**
         * checking data stock
         */
        let stockId = req.params.id;
        let chkStock = await Stock.findOne({ where: { id: stockId } });
        if (!chkStock) {
            return res.status(400).json({msg: "Stock tidak ditemukan!"})
        }
        /**
         * checking data product
         */
        let kdProduk = chkStock.productKodeProduk;
        let qtyInStock = chkStock.qtyIn;
        let chkProduk = await Product.findOne({ where: { kodeProduk: kdProduk } });
        if (!chkProduk) {
            return res.status(400).json({msg: "Produk tidak ditemukan!"})
        }
        let qtyProduk = chkProduk.qty <= 0 ? 0 : (chkProduk['qty'] - qtyInStock)
        
        await Product.update({ qty: qtyProduk }, { where: { kodeProduk: kdProduk }, transaction: trx });

        await Stock.destroy({
            where:{
                id: req.params.id
            },
            transaction: trx
        });

        await trx.commit();

        res.status(200).json({msg: "Stock deleted"});
    } catch (error) {
        await trx.rollback();
        console.log(error.message);
    }
}
