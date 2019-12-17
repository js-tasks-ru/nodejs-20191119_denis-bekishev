const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const order = new Order({
    ...ctx.request.body,
    user: ctx.user._id,
  });

  await order.save();
  const product = await Product.findOne({_id: order.product});

  await sendMail({
    to: ctx.user.email,
    subject: 'Подтвердите почту',
    locals: {id: order._id, product},
    template: 'order-confirmation',
  });

  ctx.body = {order: order._id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user._id}).populate('product');
  ctx.body = {orders};
};
