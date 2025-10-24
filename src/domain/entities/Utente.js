class Utente {
  constructor({ id, nome, dataNascimento, sexo, contacto, localizacao, idLocal, senha }) {
    if (!id) throw new Error('ID do utente é obrigatório');
    if (!nome) throw new Error('Nome do utente é obrigatório');
    
    this.id = id;
    this.nome = nome;
    this.dataNascimento = dataNascimento ? new Date(dataNascimento) : null;
    this.sexo = sexo || null;
    this.contacto = contacto;
    this.localizacao = localizacao || null;
    this.idLocal = idLocal || null;
    this.senha = senha || null;
  }
}

module.exports = Utente;