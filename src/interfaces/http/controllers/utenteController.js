const CriarUtente = require('../../../domain/use-cases/criarUtente');
const UtenteRepository = require('../../../infrastructure/repositories/utenteRepository');
const AuditoriaRepository = require('../../../infrastructure/repositories/auditoriaRepository');

const utenteRepository = new UtenteRepository();
const auditoriaRepository = new AuditoriaRepository();
const criarUtenteUseCase = new CriarUtente({ utenteRepository, auditoriaRepository });

async function criarUtente(req, res) {
  try {
    const { nome, dataNascimento, sexo, contacto, localizacao, idLocal } = req.body;
    const utente = await criarUtenteUseCase.execute(
      { nome, dataNascimento, sexo, contacto, localizacao, idLocal },
      req.usuario ? req.usuario.id : null
    );
    res.status(201).json(utente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { criarUtente };