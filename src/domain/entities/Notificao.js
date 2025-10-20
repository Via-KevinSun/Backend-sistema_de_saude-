class Notificacao {
  constructor({ id, utenteId, tipo, mensagem, enviadoEm, status }) {
    if (!id) throw new Error('ID da notificação é obrigatório');
    if (!utenteId) throw new Error('ID do utente é obrigatório');
    if (!tipo) throw new Error('Tipo da notificação é obrigatório');
    if (!mensagem) throw new Error('Mensagem da notificação é obrigatória');

    this.id = id;
    this.utenteId = utenteId;
    this.tipo = tipo;
    this.mensagem = mensagem;
    this.enviadoEm = enviadoEm ? new Date(enviadoEm) : new Date();
    this.status = status || null;
  }
}

module.exports = Notificacao;