const Usuario = require('../entities/Usuario');
const Auditoria = require('../entities/Auditoria');
const bcrypt = require('bcrypt');

class CriarUsuario {
  constructor({ usuarioRepository, auditoriaRepository }) {
    this.usuarioRepository = usuarioRepository;
    this.auditoriaRepository = auditoriaRepository;
  }

  async execute({ nome, email, senha, papel, mfaSecret }, userId) {
    const hashedSenha = senha ? await bcrypt.hash(senha, 10) : null;
    // Validar email único
    const usuarioExistente = await this.usuarioRepository.findByEmail(email);
    if (usuarioExistente) throw new Error('Email já registrado');

    // Criar entidade Usuario
    const usuario = new Usuario({
      id: require('crypto').randomUUID(),
      nome,
      email,
      senha: hashedSenha, // Será encriptada no repositório
      papel,
      mfaSecret
    });

    // Salvar usuário
    const createdUsuario = await this.usuarioRepository.create(usuario);

    // Registrar auditoria
    const auditoria = new Auditoria({
      id: require('crypto').randomUUID(),
      entidade: 'Usuario',
      entidadeId: createdUsuario.id,
      acao: 'create',
      userId,
      detalhe: `Usuário ${nome} criado com papel ${papel}`
    });
    await this.auditoriaRepository.create(auditoria);

    return createdUsuario;
  }
}

module.exports = CriarUsuario;