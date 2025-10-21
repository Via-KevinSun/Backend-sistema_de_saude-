const jwt = require('jsonwebtoken');
const { prisma } = require('../../../config/database');

function authMiddleware(rolesPermitidos = []) {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      // Verificar token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
      const usuario = await prisma.usuario.findUnique({ where: { id: decoded.id } });

      if (!usuario) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      // Verificar papel (RBAC)
      if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario.papel)) {
        return res.status(403).json({ error: 'Acesso não autorizado' });
      }

      // Adicionar usuário ao request para uso posterior
      req.usuario = usuario;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };
}

module.exports = authMiddleware;