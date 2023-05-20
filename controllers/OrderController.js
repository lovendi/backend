import db from "../config/Database.js";
import moment from "moment/moment.js";
import Order from "../models/OrderModel.js";
import OrderDetail from "../models/OrderDetailModel.js";
import Product from "../models/ProductModel.js"
import { Op } from "sequelize";

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
    let ctxTime = tmpInvNo.slice(4,6)
    let num = parseInt(tmpInvNo.slice(6))
    let chkTimeNow = timeNow.slice(4,6)
    
    let invoiceNo = ''
    
    if (chkTimeNow !== ctxTime) {
      num = 1
      invoiceNo = `${timeNow}${num.toString().padStart(5, '0')}`
    } else {
      num += 1
      invoiceNo = `${timeNow}${num.toString().padStart(5, '0')}`
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
        harga: parseFloat(el.harga)
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
    let data = await Product.findAll({
      where: {
        [Op.and]: [{
          expired: {
            [Op.gte]: new Date()
          }
        }]
      },
      attributes: [['kodeProduk', 'kdProduk'], 'namaProduk', 'qty', ['hargaJual','harga']]
    })
      
    res.status(200).json({data: data});
  } catch (error) {
      console.log(error.message);
      res.status(500).json({msg: error.message});
  }
}
