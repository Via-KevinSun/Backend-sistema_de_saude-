class GetTotalUtentes {
  constructor({ utenteRepository }) {
    this.utenteRepository = utenteRepository;
  }

  async execute() {
    const total = await this.utenteRepository.count();
    return { totalUtentes: total };
  }
}

module.exports = GetTotalUtentes;
