class Auditoria {
  constructor({ id, entidade, entidadeId, acao, userId, timestamp, detalhe }) {
    if (!id) throw new Error('ID da auditoria é obrigatório');
    if (!entidade) throw new Error('Entidade é obrigatória');
    if (!entidadeId) throw new Error('ID da entidade é obrigatório');
    if (!acao) throw new Error('Ação é obrigatória');

    this.id = id;
    this.entidade = entidade;
    this.entidadeId = entidadeId;
    this.acao = acao;
    this.userId = userId || null;
    this.timestamp = timestamp ? new Date(timestamp) : new Date();
    this.detalhe = detalhe || null;
  }
}

module.exports = Auditoria;