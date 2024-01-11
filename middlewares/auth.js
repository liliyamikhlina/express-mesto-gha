const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { cookie } = req.headers;

  if (!cookie) {
    throw new Unauthorized('Необходима авторизация');
  }

  const tokenPair = cookie.split('; ').find((cookiePair) => cookiePair.split('=')[0] === 'jwt');

  if (!tokenPair) {
    throw new Unauthorized('Необходима авторизация');
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
