
class ListarPrescricoes {
  constructor({ prescricaoRepository }) {
    this.prescricaoRepository = prescricaoRepository;
  }

  async execute() {
    const prescricoes = await this.prescricaoRepository.findAll();
    return prescricoes;
  }
}

module.exports = ListarPrescricoes;
