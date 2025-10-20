const Auditoria = require('../entities/Auditoria');

class GerarRelatorioVigilancia {
  constructor({ triagemRepository, leituraClinicaRepository, auditoriaRepository }) {
    this.triagemRepository = triagemRepository;
    this.leituraClinicaRepository = leituraClinicaRepository;
    this.auditoriaRepository = auditoriaRepository;
  }

  async execute({ zonaId, periodoInicio, periodoFim }, userId) {
    // Buscar triagens e leituras no período
    const triagens = await this.triagemRepository.findByZonaAndPeriodo(zonaId, periodoInicio, periodoFim);
    const leituras = await this.leituraClinicaRepository.findByZonaAndPeriodo(zonaId, periodoInicio, periodoFim);

    // Agregar dados (simplificado; expansível com lógica analítica)
    const relatorio = {
      zonaId,
      periodo: { inicio: new Date(periodoInicio), fim: new Date(periodoFim) },
      totalTriagens: triagens.length,
      totalLeituras: leituras.length,
      alertas: this.gerarAlertasEpidemiologicos(triagens, leituras)
    };

    // Registrar auditoria
    const auditoria = new Auditoria({
      id: require('crypto').randomUUID(),
      entidade: 'RelatorioVigilancia',
      entidadeId: zonaId,
      acao: 'generate',
      userId,
      detalhe: `Relatório de vigilância gerado para zona ${zonaId}`
    });
    await this.auditoriaRepository.create(auditoria);

    return relatorio;
  }

  // Lógica de alertas epidemiológicos (simplificada)
  gerarAlertasEpidemiologicos(triagens, leituras) {
    const febreAltaCount = triagens.filter(t => JSON.parse(t.respostasJson).febre === 'alta').length;
    if (febreAltaCount > 5) {
      return [{ tipo: 'surto', mensagem: 'Possível surto de febre detectado' }];
    }
    return [];
  }
}

module.exports = GerarRelatorioVigilancia;