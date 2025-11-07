// src/infrastructure/repositories/zonaRepository.js
const { prisma } = require("../../config/database");

class ZonaRepository {
  async create(zona) {
    return await prisma.zona.create({ data: zona });
  }

  async findAll() {
    return await prisma.zona.findMany({
      orderBy: { nome: "asc" },
    });
  }

  async findById(id) {
    return await prisma.zona.findUnique({ where: { id } });
  }

  async update(id, data) {
    return await prisma.zona.update({ where: { id }, data });
  }

  async delete(id) {
    return await prisma.zona.delete({ where: { id } });
  }

  async findUtentesByZonaId(zonaId) {
    return await prisma.utente.findMany({
      where: { idLocal: zonaId },
      select: { id: true, nome: true },
    });
  }
}

module.exports = ZonaRepository;
