const Triagem = require('../entities/Triagem');
const Auditoria = require('../entities/Auditoria');

class ProcessarTriagem {
  constructor({ triagemRepository, auditoriaRepository }) {
    this.triagemRepository = triagemRepository;
    this.auditoriaRepository = auditoriaRepository;
  }

  async execute({ utenteId, respostasJson }, userId) {
    // Verifica se o utente existe
    const utente = await this.triagemRepository.findUtenteById(utenteId);
    if (!utente) throw new Error('Utente não encontrado');

    // Converter para objeto (caso venha string)
    const respostas = typeof respostasJson === 'string' ? JSON.parse(respostasJson) : respostasJson;

    // Determinar o resultado e recomendação
    const { resultado, recomendacao } = this.analisarRespostas(respostas);

    // Criar entidade de triagem
    const triagem = new Triagem({
      id: require('crypto').randomUUID(),
      utenteId,
      respostasJson: JSON.stringify(respostas),
      resultado,
      recomendacao
    });

    // Salvar triagem
    const createdTriagem = await this.triagemRepository.create(triagem);

    // Registrar auditoria
    const auditoria = new Auditoria({
      id: require('crypto').randomUUID(),
      entidade: 'Triagem',
      entidadeId: createdTriagem.id,
      acao: 'create',
      userId,
      detalhe: `Triagem processada automaticamente — ${resultado} (${recomendacao})`
    });
    await this.auditoriaRepository.create(auditoria);

    return createdTriagem;
  }

  /**
   * Lógica inteligente para analisar respostas e gerar recomendação.
   * Aqui pode crescer com novas perguntas, pesos, ou IA.
   */
  analisarRespostas(respostas) {
    let sintomasGraves = 0;
    let sintomasModerados = 0;

    // Exemplo de estrutura de perguntas esperadas
    // { febre: "alta", tosse: "sim", dor_peito: "sim", fadiga: "leve", dificuldade_respirar: "sim" }

    // Lógica simples de contagem
    if (respostas.febre === 'alta') sintomasGraves++;
    if (respostas.dificuldade_respirar === 'sim') sintomasGraves++;
    if (respostas.dor_peito === 'sim') sintomasGraves++;

    if (respostas.fadiga === 'moderada' || respostas.tosse === 'sim') sintomasModerados++;

    let resultado = '';
    let recomendacao = '';

    if (sintomasGraves >= 2) {
      resultado = 'Risco Alto';
      recomendacao = 'Agendar teleconsulta ou dirigir-se imediatamente a um posto de saúde mais próximo.';
    } else if (sintomasModerados >= 2 || sintomasGraves === 1) {
      resultado = 'Risco Moderado';
      recomendacao = 'Marcar uma consulta de triagem presencial para melhor avaliação.';
    } else {
      resultado = 'Risco Baixo';
      recomendacao = 'Pode permanecer em casa e tomar medicação leve caso necessário.';
    }

    return { resultado, recomendacao };
  }
}

module.exports = ProcessarTriagem;
