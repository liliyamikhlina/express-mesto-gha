const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { cookie } = req.headers;

  if (!cookie) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const tokenPair = cookie.split('; ').find((cookiePair) => cookiePair.split('=')[0] === 'jwt');

  if (!tokenPair) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = tokenPair.split('=')[1];
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next();
};
