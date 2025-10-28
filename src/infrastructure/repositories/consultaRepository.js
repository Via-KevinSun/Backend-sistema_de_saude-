const IConsultaRepository = require('../../interfaces/repositories/iConsultaRepository');
const { prisma } = require('../../config/database');

class ConsultaRepository extends IConsultaRepository {
  async create(consulta) {
    return await prisma.consulta.create({
      data: {
        id: consulta.id,
        utenteId: consulta.utenteId,
        profissionalId: consulta.profissionalId,
        tipo: consulta.tipo,
        data: consulta.data,
        resumo: consulta.resumo,
        prescricaoId: consulta.prescricaoId
      }
    });
  }

  async findById(id) {
    return await prisma.consulta.findUnique({ where: { id } });
  }

  async update(id, data) {
    return await prisma.consulta.update({
      where: { id },
      data
    });
  }

  async verificarDisponibilidade(profissionalId, data) {
    // Lógica simplificada: verificar se há consulta no mesmo horário
    const consultaExistente = await prisma.consulta.findFirst({
      where: {
        profissionalId,
        data
      }
    });
    return !consultaExistente; // Retorna true se disponível
  }

  async findUtenteById(utenteId) {
    return await prisma.utente.findUnique({ where: { id: utenteId } });
  }

   async findAll() {
    return await prisma.consulta.findMany({
      include: {
        utente: { select: { id: true, nome: true, contacto: true } },
        // Inclua profissional se tiver modelo Usuario/Profissional
      },
      orderBy: { data: 'desc' }
    });
  }
}

module.exports = ConsultaRepository;