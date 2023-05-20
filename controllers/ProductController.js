import Product from "../models/ProductModel.js"
import Category from "../models/CategoryModel.js";
import Unit from "../models/UnitModel.js";
import { Op } from "sequelize";
import moment from "moment/moment.js";

export const getProducts = async(req, res) =>{
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Product.count({
        where:{
            [Op.or]: [{namaProduk:{
                [Op.iLike]: '%'+search+'%'
            }}, {kodeProduk:{
                [Op.iLike]: '%'+search+'%'
            }}]
        }
    }); 
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Product.findAll({
        attributes: ['id', 'kodeProduk', 'namaProduk', 'qty', 'expired', 'hargaBeli', 'hargaJual', 'categoryId', 'supplierId', 'unitId'],
        include: [{
            model: Category,
            attributes:['namaKategori']
        
    }, {
        model: Unit,
        attributes:['namaSatuan']
    }],
        where:{
            [Op.or]: [{namaProduk:{
                [Op.iLike]: '%'+search+'%'
            }}, {kodeProduk:{
                [Op.iLike]: '%'+search+'%'
            }}]
        },
        offset: offset,
        limit: limit,
        order:[
            ['kodeProduk', 'DESC']
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


export const getProductsOutOfStock = async(req, res) => {
    try {
        const response = await Product.findAll({
            limit: 10,
            attributes:['id', 'namaProduk','qty'],
            where:{
                [Op.or]: [{qty:{
                    [Op.lte]: 5
                }}]
            }
            
        });
        res.json(response);
    } catch (error) {
        console.log(error);
    }
}

export const getExpiredProducts = async(req, res) => {
    try {
        const response = await Product.findAll({
            attributes:['kodeProduk','namaProduk','expired'],
            where:{
                [Op.or]: [{expired:{
                    [Op.lte]: moment().add(7, 'days').calendar()
                }}]
            }
            
        });
        res.json(response);
    } catch (error) {
        console.log(error);
    }
}

export const getProductsById = async(req, res) =>{
    try {
        const response = await Product.findOne({
            where:{
                id: req.params.id
            }  
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createProduct= async(req, res) =>{
    try {
        await Product.create(req.body);
        res.status(201).json({msg: "Product created"});
    } catch (error) {
        console.log(error.message);
    }
}

export const updateProduct= async(req, res) =>{
    try {
        await Product.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Product updated"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteProduct= async(req, res) =>{
    try {
        await Product.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Product deleted"});
    } catch (error) {
        console.log(error.message);
    }
}
