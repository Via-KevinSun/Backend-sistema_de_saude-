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

  
  async delete(id) {
    return await prisma.utente.delete({ where: { id } });
  }

  async update(id, data) {
  return await prisma.utente.update({
    where: { id },
    data: {
      nome: data.nome,
      dataNascimento: data.dataNascimento,
      sexo: data.sexo,
      contacto: data.contacto,
      localizacao: data.localizacao,
      idLocal: data.idLocal,
    },
  });
}

}



module.exports = UtenteRepository;
//module.exports = {findByContacto} ;