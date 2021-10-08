const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const data = await Category.find();

  const categories = data.map(cat => ({
    id: cat._id,
    title: cat.title,
    subcategories: cat.subcategories.map(subcat => ({
      id: subcat._id,
      title: subcat.title
    }))
  }));

  ctx.body = {categories};
};
