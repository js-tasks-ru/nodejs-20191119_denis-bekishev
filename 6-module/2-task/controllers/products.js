const Product = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subCategory = ctx.query.subcategory;
  const products = await Product.find({subcategory: subCategory});

  ctx.body = {products};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});
  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;
  const isValidId = mongoose.Types.ObjectId.isValid(id)
  if (!isValidId) ctx.throw(400)
  const product = await Product.findById(id);
  if (!product) ctx.throw(404)
  ctx.body = {product};
};

