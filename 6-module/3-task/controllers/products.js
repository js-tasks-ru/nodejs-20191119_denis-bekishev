const Product = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = ctx.query.query;
  const products = await Product.find({$text: {$search: query}}).sort( {score: {$meta: 'textScore'}} );
  ctx.body = {products};
};
