// src/domain/use-cases/criarUtente.js
const Utente = require("../entities/Utente");
const Auditoria = require("../entities/Auditoria");
const bcrypt = require("bcrypt");

class CriarUtente {
  constructor({ utenteRepository, auditoriaRepository }) {
    this.utenteRepository = utenteRepository;
    this.auditoriaRepository = auditoriaRepository;
  }

  async execute({ nome, dataNascimento, sexo, contacto, localizacao, idLocal, senha }, userId) {
    // Verifica se a zona existe
    const zona = await this.utenteRepository.findZonaById(idLocal);
    if (!zona) throw new Error("Zona inválida");

    const hashedSenha = senha ? await bcrypt.hash(senha, 10) : null;

    const utente = new Utente({
      id: require("crypto").randomUUID(),
      nome,
      dataNascimento,
      sexo,
      contacto,
      localizacao,
      idLocal,
      senha: hashedSenha,
    });

    const createdUtente = await this.utenteRepository.create(utente);

    // Auditoria
    const auditoria = new Auditoria({
      id: require("crypto").randomUUID(),
      entidade: "Utente",
      entidadeId: createdUtente.id,
      acao: "create",
      userId,
      detalhe: `Utente ${nome} criado`,
    });
    await this.auditoriaRepository.create(auditoria);

    return createdUtente; // Retorna utente já com zona
  }
}

module.exports = CriarUtente;
