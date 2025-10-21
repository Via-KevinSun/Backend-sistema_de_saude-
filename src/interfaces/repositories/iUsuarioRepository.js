class IUsuarioRepository {
  async create(usuario) { throw new Error('Método create não implementado'); }
  async findByEmail(email) { throw new Error('Método findByEmail não implementado'); }
  async findById(id) { throw new Error('Método findById não implementado'); }
}

module.exports = IUsuarioRepository;