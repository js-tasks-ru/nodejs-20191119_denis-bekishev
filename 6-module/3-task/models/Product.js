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

productSchema.index(
    {
      title: 'text',
      description: 'text',
    },
    {
      weights: {
        title: 10,
        description: 5,
      },
      name: 'TextSearchIndex',
      default_language: 'russian',
    }
);


const Product = connection.model('Product', productSchema);
module.exports = Product;
