class ITriagemRepository {
  async create(triagem) { throw new Error('Método create não implementado'); }
  async findUtenteById(utenteId) { throw new Error('Método findUtenteById não implementado'); }
  async findByZonaAndPeriodo(zonaId, periodoInicio, periodoFim) { throw new Error('Método findByZonaAndPeriodo não implementado'); }
}

module.exports = ITriagemRepository;