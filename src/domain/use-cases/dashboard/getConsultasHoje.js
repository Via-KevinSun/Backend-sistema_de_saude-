class GetConsultasHoje {
  constructor({ consultaRepository }) {
    this.consultaRepository = consultaRepository;
  }

  async execute() {
    const hoje = new Date();
    const total = await this.consultaRepository.countByDate(hoje);
    return { consultasHoje: total };
  }
}

module.exports = GetConsultasHoje;
