const jwt = require('jsonwebtoken');

function authMiddlewareUtente(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    req.usuario = { id: decoded.id }; // o ID do utente vem do token gerado no login
    next();
  } catch (error) {
    console.error('Erro no authMiddlewareUtente:', error);
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = authMiddlewareUtente;
