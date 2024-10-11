const jwt = require('jsonwebtoken');

const middleware = (req, res, next) => {
  let token;

  // Verificar si el token viene en el header 'Authorization'
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.replace('Bearer ', '');
  }

  // Verificar si el token viene en las cookies
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Si no se encuentra el token en ningún lugar, retornar un error
  if (!token) {
    return res.status(401).send({ error: 'Token no proporcionado. Autenticación requerida.' });
  }

  try {
    // Verificar el token
    const secret = process.env.JWT_SECRET || 'SECRET_KEY'; // Usar el secreto desde variables de entorno
    const decoded = jwt.verify(token, secret);

    // Almacenar la información del usuario en `req.user`
    req.user = decoded;

    // Pasar al siguiente middleware o ruta
    next();
  } catch (err) {
    // Manejar el error de token expirado
    if (err.name === 'TokenExpiredError') {
      return res.status(401).send({ error: 'El token ha expirado.' });
    }

    // Otros errores relacionados con el token
    return res.status(401).send({ error: 'Token inválido.' });
  }
};

module.exports = middleware;
