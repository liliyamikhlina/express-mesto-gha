const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { cookie } = req.headers;

  const token = cookie.split('; ').find((cookiePair) => cookiePair.split('=')[0] === 'jwt').split('=')[1];

  if (!token) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   return res.status(401).send({ message: 'Необходима авторизация' });
  // }

  // const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next();
};
