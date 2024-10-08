const jwt = require('jsonwebtoken');

const middleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).send({ error: 'Token no proporcionado. Autenticación requerida.' });
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(400).send({ error: 'Formato de token incorrecto. Debe comenzar con "Bearer".' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, 'SECRET_KEY'); // Verifica el token
    req.user = decoded; // Almacena la información del usuario en el objeto `req`
    next(); // Pasa al siguiente middleware o ruta
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).send({ error: 'El token ha expirado.' });
    }
    return res.status(401).send({ error: 'Token inválido.' });
  }
};

module.exports = middleware;
