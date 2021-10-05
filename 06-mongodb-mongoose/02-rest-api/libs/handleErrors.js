module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.name === 'CastError') {
      err.status = 400;
      err.message = 'Неверный формат параметров';
      throw err;
    }
  }
};
