import Unit from "../models/UnitModel.js";
import { Op } from "sequelize";

export const getUnits = async(req, res) =>{
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Unit.count({
        where:{
            [Op.or]: [{namaSatuan:{
                [Op.iLike]: '%'+search+'%'
            }}]
        }
    }); 
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Unit.findAll({
        where:{
            [Op.or]: [{namaSatuan:{
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

export const getUnitsById = async(req, res) =>{
    try {
        const response = await Unit.findOne({
            where:{
                id: req.params.id
            }  
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createUnit = async(req, res) =>{
    try {
        await Unit.create(req.body);
        res.status(201).json({msg: "Unit created"});
    } catch (error) {
        console.log(error.message);
    }
}

export const updateUnit = async(req, res) =>{
    try {
        await Unit.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Unit updated"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteUnit = async(req, res) =>{
    try {
        await Unit.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Unit deleted"});
    } catch (error) {
        console.log(error.message);
    }
}