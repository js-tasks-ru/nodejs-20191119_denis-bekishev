const mongoose = require('mongoose');
const connection = require('../libs/connection');

const changeId = () => {
  return (doc, ret, options) => {
    ret.id = ret['_id'].toHexString();
    delete ret['_id'];
    return ret;
  };
};

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  phone: {
    type: String,
    required: true,
    validate: [
      {
        validator(value) {
          return /\+?\d{6,14}$/.test(value);
        },
        message: 'Неверный формат номера телефона.',
      },
    ],
  },
  address: {
    type: String,
    required: true,
  },
},
  {
    toObject: {
      transform: changeId(),
      versionKey: false,
    },
    toJSON: {
      transform: changeId(),
      versionKey: false,
    },
  });

module.exports = connection.model('Order', orderSchema);
