const jwt = require('jsonwebtoken');

const middleware = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Asegúrate de usar tu clave secreta adecuada
    req.user = verified; // Extrae el userId u otra información del token
    next(); // Pasa al siguiente middleware o ruta
  } catch (err) {
    return res.status(400).json({ error: 'Token no válido.' });
  }
};


module.exports = middleware;
