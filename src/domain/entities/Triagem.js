class Triagem {
  constructor({ id, utenteId, respostasJson, resultado, recomendacao, data }) {
    if (!id) throw new Error('ID da triagem é obrigatório');
    if (!utenteId) throw new Error('ID do utente é obrigatório');
    if (!respostasJson) throw new Error('Respostas da triagem são obrigatórias');
    if (!resultado) throw new Error('Resultado da triagem é obrigatório');

    this.id = id;
    this.utenteId = utenteId;
    this.respostasJson = typeof respostasJson === 'string' ? respostasJson : JSON.stringify(respostasJson);
    this.resultado = resultado;
    this.recomendacao = recomendacao || null;
    this.data = data ? new Date(data) : new Date();
  }
}

module.exports = Triagem;