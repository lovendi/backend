import Supplier from "../models/supplierModel.js";
import { Op } from "sequelize";

export const getSuppliers = async(req, res) =>{
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Supplier.count({
        where:{
            [Op.or]: [{namaSupplier:{
                [Op.iLike]: '%'+search+'%'
            }}]
        }
    }); 
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Supplier.findAll({
        where:{
            [Op.or]: [{namaSupplier:{
                [Op.iLike]: '%'+search+'%'
            }}]
        },
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

export const getSuppliersById = async(req, res) =>{
    try {
        const response = await Supplier.findOne({
            where:{
                id: req.params.id
            }  
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createSupplier = async(req, res) =>{
    try {
        await Supplier.create(req.body);
        res.status(201).json({msg: "supplier created"});
    } catch (error) {
        console.log(error.message);
    }
}

export const updateSupplier = async(req, res) =>{
    try {
        await Supplier.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "supplier updated"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteSupplier = async(req, res) =>{
    try {
        await Supplier.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "supplier deleted"});
    } catch (error) {
        console.log(error.message);
    }
}