const mongoose = require('mongoose');
const connection = require('../libs/connection');

function removeProperties(...properties) {
  return function(doc, ret, options) {
    for (const prop of properties) {
      delete ret[prop];
    }
    return ret;
  };
}

const changeId = () => {
  return (doc, ret, options) => {
    ret.id = ret['_id'].toHexString();
    delete ret['_id'];
    return ret;
  };
};

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
},
{
  toObject: {
    transform: changeId(),
    versionKey: false
  },
  toJSON: {
    transform: changeId(),
    versionKey: false
  },
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
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

module.exports = connection.model('Category', categorySchema);
