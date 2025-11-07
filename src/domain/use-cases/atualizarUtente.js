// src/domain/use-cases/atualizarUtente.js
const bcrypt = require("bcrypt");

class AtualizarUtente {
  constructor({ utenteRepository, auditoriaRepository }) {
    this.utenteRepository = utenteRepository;
    this.auditoriaRepository = auditoriaRepository;
  }

  async execute(dados, userId) {
    const {
      id,
      nome,
      dataNascimento,
      sexo,
      contacto,
      localizacao,
      idLocal,
      senha,
    } = dados;

    const utenteExistente = await this.utenteRepository.findById(id);
    if (!utenteExistente) throw new Error("Utente não encontrado");

    const updateData = { nome, dataNascimento, sexo, localizacao };

    // Só atualiza contacto se for diferente (e válido)
    if (contacto && contacto !== utenteExistente.contacto) {
      updateData.contacto = contacto;
    }

    // VALIDA ZONA SE FOR INFORMADA
    if (idLocal) {
      const zona = await this.utenteRepository.findZonaById(idLocal);
      if (!zona) throw new Error("Zona selecionada não existe");
      updateData.idLocal = idLocal;
    }

    if (senha) {
      updateData.senha = await bcrypt.hash(senha, 10);
    }

    const utente = await this.utenteRepository.update(id, updateData);

    // Auditoria
    await this.auditoriaRepository.create({
      entidade: "utente",
      entidadeId: id,
      acao: "atualizar",
      userId,
      detalhe: `Atualizado: ${nome}`,
    });

    return utente;
  }
}

module.exports = AtualizarUtente;
