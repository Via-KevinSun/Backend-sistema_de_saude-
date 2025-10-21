class Usuario {
  constructor({ id, nome, email, senha, papel, mfaSecret, criadoEm }) {
    if (!id) throw new Error('ID do usuário é obrigatório');
    if (!nome) throw new Error('Nome do usuário é obrigatório');
    if (!email) throw new Error('Email do usuário é obrigatório');
    if (!senha) throw new Error('Senha do usuário é obrigatória');
    if (!papel) throw new Error('Papel do usuário é obrigatório');
    if (!['utente', 'agente', 'enfermeiro', 'medico', 'gestor'].includes(papel)) {
      throw new Error('Papel inválido');
    }

    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha; // Será encriptada no repositório
    this.papel = papel;
    this.mfaSecret = mfaSecret || null;
    this.criadoEm = criadoEm ? new Date(criadoEm) : new Date();
  }
}

module.exports = Usuario;