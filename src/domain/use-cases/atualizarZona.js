class AtualizarZona {
  constructor({ zonaRepository, auditoriaRepository }) {
    this.zonaRepository = zonaRepository;
    this.auditoriaRepository = auditoriaRepository;
  }

  async execute({ id, nome, coordenadas }, userId) {
    const zona = await this.zonaRepository.update(id, { nome, coordenadas });
    await this.auditoriaRepository.create({
      entidade: 'zona',
      entidadeId: id,
      acao: 'atualizar',
      userId,
      detalhe: `Zona atualizada: ${nome}`
    });
    return zona;
  }
}

module.exports = AtualizarZona;