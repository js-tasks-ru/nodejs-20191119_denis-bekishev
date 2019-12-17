const mongoose = require('mongoose');
const connection = require('../libs/connection');

const changeId = () => {
  return (doc, ret, options) => {
    ret.id = ret['_id'].toHexString();
    delete ret['_id'];
    return ret;
  };
};

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  images: [String],

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

module.exports = connection.model('Product', productSchema);
