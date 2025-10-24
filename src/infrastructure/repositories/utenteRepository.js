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
        idLocal: utente.idLocal,
        senha: utente.senha
      }
    });
  }

  async findById(id) {
    return await prisma.utente.findUnique({ where: { id } });
  }

  async findByContacto(contacto) {
  return await prisma.utente.findUnique({ where: { contacto } });
}

  async findAll() {
    return await prisma.utente.findMany({
      select: {
        id: true,
        nome: true,
        dataNascimento: true,
        sexo: true,
        contacto: true,
        localizacao: true,
        idLocal: true,
        zona: {
          select: { nome: true }
        }
      }
    });
  }

}

module.exports = UtenteRepository;
//module.exports = {findByContacto} ;