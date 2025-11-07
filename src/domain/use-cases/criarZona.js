class CriarZona {
  constructor({ zonaRepository, auditoriaRepository }) {
    this.zonaRepository = zonaRepository;
    this.auditoriaRepository = auditoriaRepository;
  }

  async execute({ nome, coordenadas }, userId) {
    const zona = await this.zonaRepository.create({
      nome,
      coordenadas
    });

    await this.auditoriaRepository.create({
      entidade: 'zona',
      entidadeId: zona.id,
      acao: 'create',
      userId,
      detalhe: `Zona criada: ${nome}`
    });

    return zona;
  }
}

module.exports = CriarZona;