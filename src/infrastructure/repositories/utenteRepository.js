const IUtenteRepository = require('../../interfaces/repositories/iUtenteRepository');
const { prisma } = require('../../config/database');

class UtenteRepository extends IUtenteRepository {
  async create(utente) {
    return await prisma.utente.create({
      data: {
        id: utente.id,
        nome: utente.nome,
        dataNascimento: utente.dataNascimento,
        sexo: utente.sexo,
        contacto: utente.contacto,
        localizacao: utente.localizacao,
        idLocal: utente.idLocal
      }
    });
  }

  async findById(id) {
    return await prisma.utente.findUnique({ where: { id } });
  }
}

module.exports = UtenteRepository;