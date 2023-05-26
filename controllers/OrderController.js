import db from "../config/Database.js";
import moment from "moment/moment.js";
import Order from "../models/OrderModel.js";
import OrderDetail from "../models/OrderDetailModel.js";
import Product from "../models/ProductModel.js"
import { Op, QueryTypes } from "sequelize";

/**
 * API generate Invoice Number 
 * @param {*} trx 
 * @returns 
 */
export const generateInvoiceNumber= async(req, res) =>{
  const trx = await db.transaction();
  try {

    let timeNow = moment().format('YYMMDD')
    let tmpInvNo = await Order.findOne({ order: [[ 'invoiceNo', 'DESC' ]], limit: 1, transaction: trx })
    tmpInvNo = !tmpInvNo ? `${timeNow}00000` : tmpInvNo.invoiceNo
    let ctxTime = tmpInvNo.slice(7,9)
    let num = parseInt(tmpInvNo.slice(9))
    let chkTimeNow = timeNow.slice(4,6)
    
    let invoiceNo = ''
    
    if (chkTimeNow !== ctxTime) {
      num = 1
      invoiceNo = `INV${timeNow}${num.toString().padStart(5, '0')}`
    } else {
      num += 1
      invoiceNo = `INV${timeNow}${num.toString().padStart(5, '0')}`
    }

    await trx.commit()
      
    res.status(200).json({data: invoiceNo});
  } catch (error) {
      await trx.rollback();
      console.log(error.message);
      res.status(500).json({msg: error.message});
  }
}

/**
 * API create order 
 * @param {*} trx 
 * @returns 
 */
export const createOrder = async(req, res) =>{
  const trx = await db.transaction();
  try {

    /**
     * checking data order by invoice_no
     */
    let invNo = req.body.invoiceNo
    let chkOrder = await Order.findOne({ where: { invoiceNo: invNo } })
    if (chkOrder) {
      return res.status(400).json({msg: `Order ${invNo} sudah ada!`})
    }

    let dataOrder = await Order.create({
      invoiceNo: invNo,
      username: req.body.username
    }, {transaction: trx})

    let subtotal = 0
    for (let i = 0; i < req.body.items.length; i++) {
      const el = req.body.items[i];
      
      let chkProduk = await Product.findOne({ where: { kodeProduk: el.kdProduk }, transaction: trx })
      if (!chkProduk) {
        return res.status(400).json({msg: `Produk ${el.kdProduk} tidak ditemukan!`})
      }
      if (chkProduk.qty < el.qty) {
        return res.status(400).json({msg: `Qty Produk ${el.kdProduk} tidak mencukupi!`})
      }

      subtotal += (parseFloat(el.harga) * Math.floor(el.qty))

      await OrderDetail.create({
        kdProduk: el.kdProduk,
        orderId: dataOrder.id,
        qty: el.qty,
        harga: parseFloat(el.harga),
        hargaBeli: parseFloat(chkProduk.hargaBeli),
      }, {transaction: trx})

      await Product.update({ qty: (chkProduk['qty'] - el.qty) }, { where: { kodeProduk: el.kdProduk }, transaction: trx })
    }

    const taxRate = (req.body.tax * subtotal) / 100;
    const discountRate = (req.body.discount * subtotal) / 100;
    const total = subtotal - discountRate + taxRate;
    const kembalian = req.body.bayar - total;

    await Order.update({ 
      tax: req.body.tax, 
      taxRate: taxRate, 
      discount: req.body.discount, 
      discountRate: discountRate, 
      subtotal: subtotal, 
      bayar: req.body.bayar, 
      kembalian: kembalian, 
      total: total, 
    }, { where: { id: dataOrder.id }, transaction: trx })

    await trx.commit()
      
    res.status(200).json({msg: 'Berhasil simpan order'});
  } catch (error) {
      await trx.rollback();
      console.log(error.message);
      res.status(500).json({msg: error.message});
  }
}

/**
 * API generate Invoice Number 
 * @param {*} trx 
 * @returns 
 */
export const productList= async(req, res) =>{
  try {
    let kdProduk = req.body.kdProduk || ''
    let namaProduk = req.body.namaProduk || ''
    let data = await Product.findAll({
      where: {
        expired: {
          [Op.gte]: new Date()
        },
        [Op.or]: [
          {
            kodeProduk: {
              [Op.iLike]: '%'+kdProduk+'%'
            },
          }, {
            namaProduk: {
              [Op.iLike]: '%'+namaProduk+'%'
            }
          }
        ]
      },
      attributes: [['kodeProduk', 'kdProduk'], 'namaProduk', 'qty', ['hargaJual','harga']]
    })
      
    res.status(200).json({data: data});
  } catch (error) {
      console.log(error.message);
      res.status(500).json({msg: error.message});
  }
}

export const orderList = async(req, res) =>{
  try {
    const page = parseInt(req.body.page) || 0;
    const limit = parseInt(req.body.limit) || 10;
    let date = req.body.search_date && req.body.search_date.length > 0 ? req.body.search_date : [moment().format('YYYY-MM-DD'), moment().add(7, 'days').format('YYYY-MM-DD')]
    const offset = limit * page;
    const totalRows = await Order.count({
      where: {
        createdAt: {
          [Op.between]: [date[0], date[1]]
        }
      }
    }); 
    const totalPage = Math.ceil(totalRows / limit);
    // Order.hasMany(OrderDetail, {foreignKey: 'orderId'})
    // OrderDetail.belongsTo(Order, {foreignKey: 'orderId'})
    // Product.hasMany(OrderDetail, {foreignKey: 'kdProduk'})
    // OrderDetail.belongsTo(Product, {foreignKey: 'kdProduk'})
    // const result = await Order.findAll({
    //     attributes:[[db.literal('row_number() over (order by id)'), 'no'], 'invoiceNo', 'username', 'total',
    //     ['createdAt','tgl_transaksi']],
    //     include: [
    //       {
    //         model: OrderDetail,
    //         include: [
    //           {
    //             model: Product
    //           }
    //         ]
    //       }
    //     ],
    //     where: {
    //       createdAt: {
    //         [Op.between]: [date[0], date[1]]
    //       }
    //     },  
    //     group: "id",
    //     offset: offset,
    //     limit: limit,
    // });

    const result = await db.query(`
      SELECT
      row_number() over (order by ord.id desc) AS no, ord."invoiceNo", ord.username, ord.total,
      ord."createdAt" AS tgl_transaksi, array_agg(prd."namaProduk") AS produkList
      FROM orders AS ord
      LEFT JOIN "orderDetails" AS ords ON ords."orderId" = ord.id
      LEFT JOIN product AS prd ON prd."kodeProduk" = ords."kdProduk"
      WHERE ord."createdAt" between :startDate and :endDate
      GROUP BY ord.id
      ORDER BY ord.id desc
      LIMIT :limit
      OFFSET :offset
    `, {
      replacements: {
        startDate: date[0],
        endDate: date[1],
        limit: limit,
        offset: offset,
      },
      type: QueryTypes.SELECT
    })
    res.status(200).json({
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({msg: error.message});
  }
}

export const getOmzet = async(req, res) =>{
  try {
    let date = req.body.search_date && req.body.search_date.length > 0 ? req.body.search_date : [moment().format('YYYY-MM-DD'), moment().add(7, 'days').format('YYYY-MM-DD')]

    const result = await Order.findAll({
        attributes:[[db.literal('sum(total)'), 'omzet']],
        where: {
          createdAt: {
            [Op.between]: [date[0], date[1]]
          }
        }
    });
    let data = result[0]
    res.status(200).json({
        data
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({msg: error.message});
  }
}

export const getProfit = async(req, res) =>{
  try {
    let date = req.body.search_date && req.body.search_date.length > 0 ? req.body.search_date : [moment().format('YYYY-MM-DD'), moment().add(7, 'days').format('YYYY-MM-DD')]

    const result = await db.query(`
      SELECT SUM((ords.harga - ords."hargaBeli")*qty) AS profit
      FROM orders AS ord
      LEFT JOIN "orderDetails" AS ords ON ords."orderId" = ord.id
      WHERE ord."createdAt" between :startDate and :endDate
    `, {
      replacements: {
        startDate: date[0],
        endDate: date[1]
      },
      type: QueryTypes.SELECT
    })
    let data = result[0]
    res.status(200).json({
        data
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({msg: error.message});
  }
}