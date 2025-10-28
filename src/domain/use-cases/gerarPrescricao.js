const Prescricao = require('../entities/Prescricao');
const Auditoria = require('../entities/Auditoria');

class GerarPrescricao {
  constructor({ prescricaoRepository, consultaRepository, auditoriaRepository }) {
    this.prescricaoRepository = prescricaoRepository;
    this.consultaRepository = consultaRepository;
    this.auditoriaRepository = auditoriaRepository;
  }

  async execute({ consultaId, medicamento, dosagem, duracao, observacoes }, userId) {
    // Validar consulta
    const consulta = await this.consultaRepository.findById(consultaId);
    if (!consulta) throw new Error('Consulta não encontrada');
    if (consulta.prescricaoId) throw new Error('Consulta já tem prescrição');

    // Criar entidade Prescricao
    const prescricao = new Prescricao({
      id: require('crypto').randomUUID(),
      consultaId,
      medicamento,
      dosagem,
      duracao,
      observacoes
    });

    // Salvar prescrição
    const createdPrescricao = await this.prescricaoRepository.create(prescricao);

    // Atualizar consulta com prescricaoId
    await this.consultaRepository.update(consultaId, { prescricaoId: createdPrescricao.id });

    // Registrar auditoria
    const auditoria = new Auditoria({
      id: require('crypto').randomUUID(),
      entidade: 'Prescricao',
      entidadeId: createdPrescricao.id,
      acao: 'create',
      userId,
      detalhe: `Prescrição gerada para consulta ${consultaId}`
    });
    await this.auditoriaRepository.create(auditoria);

    return createdPrescricao;
  }
}



module.exports = GerarPrescricao;