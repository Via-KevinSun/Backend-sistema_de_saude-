class GetTriagensPorZona {
  constructor({ triagemRepository }) {
    this.triagemRepository = triagemRepository;
  }

  async execute() {
    const data = await this.triagemRepository.groupByZona();
    return data;
  }
}

module.exports = GetTriagensPorZona;
