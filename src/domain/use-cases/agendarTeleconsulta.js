const Consulta = require('../entities/Consulta');
const Auditoria = require('../entities/Auditoria');

class AgendarTeleconsulta {
  constructor({ consultaRepository, auditoriaRepository }) {
    this.consultaRepository = consultaRepository;
    this.auditoriaRepository = auditoriaRepository;
  }

  async execute({ utenteId, profissionalId, tipo, data }, userId) {
    // Validar utente
    const utente = await this.consultaRepository.findUtenteById(utenteId);
    if (!utente) throw new Error('Utente não encontrado');

    // Criar entidade Consulta
    const consulta = new Consulta({
      id: require('crypto').randomUUID(),
      utenteId,
      profissionalId: profissionalId || null,
      tipo: tipo || 'teleconsulta',
      data,
      resumo: null,
      prescricaoId: null
    });

    // Verificar disponibilidade (simplificado; expansível com motor de agendamento)
    const isDisponivel = await this.consultaRepository.verificarDisponibilidade(profissionalId, data);
    if (!isDisponivel) throw new Error('Horário não disponível');

    // Salvar consulta
    const createdConsulta = await this.consultaRepository.create(consulta);

    // Registrar auditoria
    const auditoria = new Auditoria({
      id: require('crypto').randomUUID(),
      entidade: 'Consulta',
      entidadeId: createdConsulta.id,
      acao: 'create',
      userId,
      detalhe: `Teleconsulta agendada para utente ${utenteId}`
    });
    await this.auditoriaRepository.create(auditoria);

    return createdConsulta;

  }

  
}

module.exports = AgendarTeleconsulta;