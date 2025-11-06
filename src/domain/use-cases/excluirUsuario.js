// src/domain/use-cases/excluirUsuario.js
class ExcluirUsuario {
  constructor({ usuarioRepository, auditoriaRepository }) {
    this.usuarioRepository = usuarioRepository;
    this.auditoriaRepository = auditoriaRepository;
  }

  async execute(id, userId) {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) throw new Error('Usuário não encontrado');

    await this.usuarioRepository.delete(id);

    await this.auditoriaRepository.create({
      entidade: 'usuario',
      entidadeId: id,
      acao: 'excluir',
      userId,
      detalhe: `Excluído: ${usuario.nome}`
    });

    return { message: 'Usuário excluído com sucesso' };
  }
}

module.exports = ExcluirUsuario;