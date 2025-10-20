const Auditoria = require('../entities/Auditoria');

class RegistrarAuditoria {
  constructor({ auditoriaRepository }) {
    this.auditoriaRepository = auditoriaRepository;
  }

  async execute({ entidade, entidadeId, acao, userId, detalhe }) {
    // Criar entidade Auditoria
    const auditoria = new Auditoria({
      id: require('crypto').randomUUID(),
      entidade,
      entidadeId,
      acao,
      userId,
      detalhe
    });

    // Salvar auditoria
    const createdAuditoria = await this.auditoriaRepository.create(auditoria);
    return createdAuditoria;
  }
}

module.exports = RegistrarAuditoria;