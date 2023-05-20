import Category from "../models/CategoryModel.js";
import { Op } from "sequelize";

export const getCategorys = async(req, res) =>{
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Category.count({
        where:{
            [Op.or]: [{namaKategori:{
                [Op.iLike]: '%'+search+'%'
            }}]
        }
    }); 
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Category.findAll({
        where:{
            [Op.or]: [{namaKategori:{
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


export const getCategorysById = async(req, res) =>{
    try {
        const response = await Category.findOne({
            where:{
                id: req.params.id
            }  
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createCategory = async(req, res) =>{
    try {
        await Category.create(req.body);
        res.status(201).json({msg: "Category created"});
    } catch (error) {
        console.log(error.message);
    }
}

export const updateCategory = async(req, res) =>{
    try {
        await Category.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Category updated"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteCategory = async(req, res) =>{
    try {
        await Category.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Category deleted"});
    } catch (error) {
        console.log(error.message);
    }
}