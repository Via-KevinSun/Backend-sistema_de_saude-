class IConsultaRepository {
  async create(consulta) { throw new Error('Método create não implementado'); }
  async findById(id) { throw new Error('Método findById não implementado'); }
  async update(id, data) { throw new Error('Método update não implementado'); }
  async verificarDisponibilidade(profissionalId, data) { throw new Error('Método verificarDisponibilidade não implementado'); }
  async findUtenteById(utenteId) { throw new Error('Método findUtenteById não implementado'); }
}

module.exports = IConsultaRepository;