const ITriagemRepository = require('../../interfaces/repositories/iTriagemRepository');
const { prisma } = require('../../config/database');

class TriagemRepository extends ITriagemRepository {
  async create(triagem) {
    return await prisma.triagem.create({
      data: {
        id: triagem.id,
        utenteId: triagem.utenteId,
        respostasJson: triagem.respostasJson,
        resultado: triagem.resultado,
        recomendacao: triagem.recomendacao,
        data: new Date()
      }
    });
  }

  async findUtenteById(utenteId) {
    return await prisma.utente.findUnique({ where: { id: utenteId } });
  }

  async findByZonaAndPeriodo(zonaId, periodoInicio, periodoFim) {
    return await prisma.triagem.findMany({
      where: {
        utente: { idLocal: zonaId },
        data: {
          gte: new Date(periodoInicio),
          lte: new Date(periodoFim)
        }
      }
    });
  }

  async findAll() {
    return await prisma.triagem.findMany({
      include: {
        utente: {
          select: {
            id: true,
            nome: true,
            dataNascimento: true,
            sexo: true,
            contacto: true
          }
        }
      },
      orderBy: {
        data: 'desc' 
      }
    });
  }
}

module.exports = TriagemRepository;
