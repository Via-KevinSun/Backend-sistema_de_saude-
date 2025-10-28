// domain/use-cases/listarTriagens.js
class ListarTriagens {
  constructor({ triagemRepository }) {
    this.triagemRepository = triagemRepository;
  }

  async execute() {
    return await this.triagemRepository.findAll();
  }
}

module.exports = ListarTriagens;
