class ExcluirZona {
  constructor({ zonaRepository, auditoriaRepository }) {
    this.zonaRepository = zonaRepository;
    this.auditoriaRepository = auditoriaRepository;
  }

  async execute(id, userId) {
    const zona = await this.zonaRepository.findById(id);
    if (!zona) throw new Error("Zona não encontrada");

    // VERIFICA SE TEM UTENTES
    const utentesNaZona = await this.zonaRepository.findUtentesByZonaId(id);
    if (utentesNaZona.length > 0) {
      throw new Error(
        `Não é possível excluir: ${utentesNaZona.length} utentes estão nesta zona`
      );
    }

    await this.zonaRepository.delete(id);

    await this.auditoriaRepository.create({
      entidade: "zona",
      entidadeId: id,
      acao: "excluir",
      userId,
      detalhe: `Zona excluída: ${zona.nome}`,
    });

    return { message: "Zona excluída com sucesso" };
  }
}

module.exports = ExcluirZona;
