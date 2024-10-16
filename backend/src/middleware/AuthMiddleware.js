const jwt = require('jsonwebtoken');

const middleware = (req, res, next) => {
  let token;
  const authHeader = req.header('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.replace('Bearer ', '');
  }

  if (!token) {
    return res.status(401).send({ error: 'Token no proporcionado. Autenticación requerida.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'SECRET_KEY';
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Asignar el usuario decodificado a req.user
    next();
  } catch (err) {
    return res.status(401).send({ error: 'Token inválido.' });
  }
};


module.exports = middleware;
