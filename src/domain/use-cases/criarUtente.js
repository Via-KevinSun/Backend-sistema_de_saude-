const Utente = require("../entities/Utente");
const Auditoria = require("../entities/Auditoria");
const bcrypt = require("bcrypt");

class CriarUtente {
  constructor({ utenteRepository, auditoriaRepository }) {
    this.utenteRepository = utenteRepository;
    this.auditoriaRepository = auditoriaRepository;
  }

  async execute(
    { nome, dataNascimento, sexo, contacto, localizacao, idLocal, senha },
    userId
  ) {
    const hashedSenha = senha ? await bcrypt.hash(senha, 10) : null;
    // Criar entidade Utente com validações
    const utente = new Utente({
      id: require("crypto").randomUUID(), // Gera UUID para o ID
      nome,
      dataNascimento,
      sexo,
      contacto,
      localizacao,
      idLocal,
      senha: hashedSenha,
    });

    // Salvar no repositório
    const createdUtente = await this.utenteRepository.create(utente);

    // Registrar auditoria
    const auditoria = new Auditoria({
      id: require("crypto").randomUUID(),
      entidade: "Utente",
      entidadeId: createdUtente.id,
      acao: "create",
      userId,
      detalhe: `Utente ${nome} criado`,
    });
    await this.auditoriaRepository.create(auditoria);

    const zona = await this.utenteRepository.findZonaById(idLocal);
    if (!zona) throw new Error("Zona inválida");

    return createdUtente;
  }
}

module.exports = CriarUtente;
