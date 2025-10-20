// src/config/database.js
const { PrismaClient } = require('../src/generated/prisma'); // Ajuste o path relativo ao output que você configurou no schema.prisma

const prisma = new PrismaClient({
  // Opcional: Adicione configurações extras se necessário, ex.: log: ['query'] para debugging
});

module.exports = { prisma };