const LeituraClinica = require('../entities/LeituraClinica');
const Auditoria = require('../entities/Auditoria');

class MonitorarLeituraClinica {
  constructor({ leituraClinicaRepository, notificacaoRepository, auditoriaRepository }) {
    this.leituraClinicaRepository = leituraClinicaRepository;
    this.notificacaoRepository = notificacaoRepository;
    this.auditoriaRepository = auditoriaRepository;
  }

  async execute({ utenteId, tipo, valor, inseridoPor }, userId) {
    // Validar utente
    const utente = await this.leituraClinicaRepository.findUtenteById(utenteId);
    if (!utente) throw new Error('Utente não encontrado');

    // Criar entidade LeituraClinica
    const leitura = new LeituraClinica({
      id: require('crypto').randomUUID(),
      utenteId,
      tipo,
      valor,
      inseridoPor
    });

    // Salvar leitura
    const createdLeitura = await this.leituraClinicaRepository.create(leitura);

    // Verificar thresholds e gerar alerta se necessário
    const alerta = this.verificarThresholds(tipo, valor);
    if (alerta) {
      const notificacao = new Notificacao({
        id: require('crypto').randomUUID(),
        utenteId,
        tipo: 'alerta',
        mensagem: alerta.mensagem,
        status: 'pendente'
      });
      await this.notificacaoRepository.create(notificacao);
    }

    // Registrar auditoria
    const auditoria = new Auditoria({
      id: require('crypto').randomUUID(),
      entidade: 'LeituraClinica',
      entidadeId: createdLeitura.id,
      acao: 'create',
      userId,
      detalhe: `Leitura clínica (${tipo}) registrada para utente ${utenteId}`
    });
    await this.auditoriaRepository.create(auditoria);

    return { leitura: createdLeitura, alerta };
  }

  // Lógica de thresholds (expansível com regras clínicas)
  verificarThresholds(tipo, valor) {
    if (tipo === 'PA' && valor > 140) {
      return { mensagem: 'Pressão arterial elevada! Contatar médico.' };
    }
    if (tipo === 'glicemia' && valor > 200) {
      return { mensagem: 'Glicemia elevada! Contatar médico.' };
    }
    return null;
  }
}

module.exports = MonitorarLeituraClinica;