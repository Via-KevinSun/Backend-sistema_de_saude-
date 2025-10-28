class ListarConsultas {
  constructor({ consultaRepository }) {
    this.consultaRepository = consultaRepository;
  }

  async execute() {
    return await this.consultaRepository.findAll();
  }
}

module.exports = ListarConsultas;
