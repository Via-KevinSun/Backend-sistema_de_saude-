// src/infrastructure/repositories/usuarioRepository.js
const IUsuarioRepository = require("../../interfaces/repositories/iUsuarioRepository");
const { prisma } = require("../../config/database");

class UsuarioRepository extends IUsuarioRepository {
  async create(usuario) {
    return await prisma.usuario.create({
      data: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha, // Já vem hasheada do use case
        papel: usuario.papel,
        mfaSecret: usuario.mfaSecret,
        criadoEm: usuario.criadoEm,
      },
    });
  }

  async findByEmail(email) {
    return await prisma.usuario.findUnique({ where: { email } });
  }

  // Dentro da classe UsuarioRepository

async findByPapel(papel) {
  return await prisma.usuario.findMany({
    where: { papel }, // filtra pelo papel fornecido
    select: {
      id: true,
      nome: true,
      email: true,
      papel: true,
      criadoEm: true,
    },
    orderBy: { nome: 'asc' }, 
  });
}

  async findById(id) {
    return await prisma.usuario.findUnique({ 
      where: { id },
      select: { id: true, nome: true, email: true, papel: true, criadoEm: true }
    });
  }

  async findByPapel(papel) {
    return await prisma.usuario.findMany({ where: { papel } });
  }

  async findAll() {
    return await prisma.usuario.findMany({
      select: { id: true, nome: true, email: true, papel: true, criadoEm: true },
      orderBy: { criadoEm: 'desc' }
    });
  }

  async update(id, data) {
    return await prisma.usuario.update({
      where: { id },
      data,
      select: { id: true, nome: true, email: true, papel: true }
    });
  }

  async delete(id) {
    return await prisma.usuario.delete({ where: { id } });
  }

  async delete(id) {
  return await prisma.usuario.delete({
    where: { id },
  });
}

}

module.exports = UsuarioRepository;