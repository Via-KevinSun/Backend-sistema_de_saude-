const Triagem = require('../entities/Triagem');
const Auditoria = require('../entities/Auditoria');

class ProcessarTriagem {
  constructor({ triagemRepository, auditoriaRepository }) {
    this.triagemRepository = triagemRepository;
    this.auditoriaRepository = auditoriaRepository;
  }

  async execute({ utenteId, respostasJson, resultado, recomendacao }, userId) {
    // Validar existência do utente (será implementado no repositório)
    const utente = await this.triagemRepository.findUtenteById(utenteId);
    if (!utente) throw new Error('Utente não encontrado');

    // Criar entidade Triagem
    const triagem = new Triagem({
      id: require('crypto').randomUUID(),
      utenteId,
      respostasJson,
      resultado,
      recomendacao: recomendacao || this.determinarRecomendacao(respostasJson)
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
      detalhe: `Triagem processada para utente ${utenteId}`
    });
    await this.auditoriaRepository.create(auditoria);

    return createdTriagem;
  }

  // Lógica simples de recomendação (expansível com regras clínicas)
  determinarRecomendacao(respostasJson) {
    const respostas = typeof respostasJson === 'string' ? JSON.parse(respostasJson) : respostasJson;
    // Exemplo: Se há febre alta, recomendar teleconsulta
    if (respostas.febre === 'alta') return 'Agendar teleconsulta';
    return 'Auto-cuidar';
  }
}

module.exports = ProcessarTriagem;