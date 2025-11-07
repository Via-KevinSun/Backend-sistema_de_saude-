// src/domain/use-cases/atualizarUsuario.js
const bcrypt = require('bcrypt');

class AtualizarUsuario {
  constructor({ usuarioRepository, auditoriaRepository }) {
    this.usuarioRepository = usuarioRepository;
    this.auditoriaRepository = auditoriaRepository;
  }

  async execute(dados, userId) {
    const { id, nome, email, senha, papel } = dados;

    const usuarioExistente = await this.usuarioRepository.findById(id);
    if (!usuarioExistente) throw new Error('Usuário não encontrado');

    const updateData = { nome, email, papel };
    if (senha) {
      updateData.senha = await bcrypt.hash(senha, 10);
    }

    const usuario = await this.usuarioRepository.update(id, updateData);

    await this.auditoriaRepository.create({
      entidade: 'usuario',
      entidadeId: id,
      acao: 'atualizar',
      userId,
      detalhe: `Atualizado: ${nome}`
    });

    return usuario;
  }
}

module.exports = AtualizarUsuario;