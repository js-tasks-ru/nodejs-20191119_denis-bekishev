const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const verificationToken = uuid();
  let newUser;
  try {
    newUser = new User({
      ...ctx.request.body,
      verificationToken,
    });
    await newUser.setPassword(ctx.request.body.password);
    await newUser.save();

    sendMail({
      template: 'confirmation',
      locals: {token: verificationToken},
      to: newUser.email,
      subject: 'Подтвердите почту',
    });
  } catch (err) {
    ctx.status = 400;
    ctx.body = {errors: Object.keys(err.errors).reduce((acc, item) => {
      acc[item] = err.errors[item].message;
      return acc;
    }, {})};
    return next();
  }

  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  const user = await User.findOne({verificationToken});
  if (!user) {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
    return next();
  }
  await user.updateOne({$unset: {verificationToken: 1}});
  ctx.body={token: verificationToken};
};
