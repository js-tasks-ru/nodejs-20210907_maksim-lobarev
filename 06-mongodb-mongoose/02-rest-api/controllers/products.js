const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const data = await Product.find({subcategory});
  const products = data.map(prod => productFormat(prod));

  ctx.body = {products};
};

module.exports.productList = async function productList(ctx, next) {
  const data = await Product.find();
  const products = data.map(prod => productFormat(prod));

  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  const data = await Product.findById(ctx.params.id)

  ctx.body = { product: productFormat(data) };
};

const productFormat = (data) => {
  return {
    id: data._id,
    images: data.images,
    title: data.title,
    description: data.description,
    price: data.price,
    category: data.category,
    subcategory: data.subcategory
  };
}

