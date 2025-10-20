class LeituraClinica {
  constructor({ id, utenteId, tipo, valor, dataHora, inseridoPor }) {
    if (!id) throw new Error('ID da leitura clínica é obrigatório');
    if (!utenteId) throw new Error('ID do utente é obrigatório');
    if (!tipo) throw new Error('Tipo da leitura é obrigatório');
    if (!['PA', 'glicemia', 'peso'].includes(tipo)) {
      throw new Error('Tipo de leitura clínica inválido');
    }
    if (valor == null) throw new Error('Valor da leitura é obrigatório');

    this.id = id;
    this.utenteId = utenteId;
    this.tipo = tipo;
    this.valor = parseFloat(valor);
    this.dataHora = dataHora ? new Date(dataHora) : new Date();
    this.inseridoPor = inseridoPor || null;
  }
}

module.exports = LeituraClinica;