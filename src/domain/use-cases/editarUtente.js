const Auditoria = require('../entities/Auditoria');

class EditarUtente {
  constructor({ utenteRepository, auditoriaRepository }) {
    this.utenteRepository = utenteRepository;
    this.auditoriaRepository = auditoriaRepository;
  }

  async execute(id, data, userId) {
    const utenteExistente = await this.utenteRepository.findById(id);
    if (!utenteExistente) {
      throw new Error('Utente não encontrado');
    }

    const utenteAtualizado = await this.utenteRepository.update(id, data);

    // Registrar auditoria
    const auditoria = new Auditoria({
      id: require('crypto').randomUUID(),
      entidade: 'Utente',
      entidadeId: id,
      acao: 'update',
      userId,
      detalhe: `Utente ${data.nome || utenteExistente.nome} atualizado pelo gestor`,
    });
    await this.auditoriaRepository.create(auditoria);

    return utenteAtualizado;
  }
}

module.exports = EditarUtente;
