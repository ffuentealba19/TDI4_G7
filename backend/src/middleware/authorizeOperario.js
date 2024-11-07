const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET; // Ensure you have a JWT_SECRET in your .env file

const authorizeOperario = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    console.log('Token:', token);
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    try {
        const verified = jwt.verify(token, secretKey);
        if (verified.role !== 'Operario') {
            console.log('Operario no autorizado:', verified);
        return res.status(403).json({ error: 'Access denied. Not an operator.' });
        }
        req.user = verified;
        console.log('Operario autorizado:', );
        next();
    } catch (err) {
        return res.status(400).json({ error: 'Invalid token.' });
    }
};

module.exports = authorizeOperario;
    