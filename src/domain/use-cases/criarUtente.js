const Utente = require('../entities/Utente');
const Auditoria = require('../entities/Auditoria');

class CriarUtente {
  constructor({ utenteRepository, auditoriaRepository }) {
    this.utenteRepository = utenteRepository;
    this.auditoriaRepository = auditoriaRepository;
  }

  async execute({ nome, dataNascimento, sexo, contacto, localizacao, idLocal }, userId) {
    // Criar entidade Utente com validações
    const utente = new Utente({
      id: require('crypto').randomUUID(), // Gera UUID para o ID
      nome,
      dataNascimento,
      sexo,
      contacto,
      localizacao,
      idLocal
    });

    // Salvar no repositório
    const createdUtente = await this.utenteRepository.create(utente);

    // Registrar auditoria
    const auditoria = new Auditoria({
      id: require('crypto').randomUUID(),
      entidade: 'Utente',
      entidadeId: createdUtente.id,
      acao: 'create',
      userId,
      detalhe: `Utente ${nome} criado`
    });
    await this.auditoriaRepository.create(auditoria);

    return createdUtente;
  }
}

module.exports = CriarUtente;