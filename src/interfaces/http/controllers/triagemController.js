// src/interfaces/http/controllers/triagemController.js
const { prisma } = require('../../../config/database');
const ProcessarTriagem = require('../../../domain/use-cases/processarTriagem');
const ListarTriagens = require('../../../domain/use-cases/listarTriagens');
const TriagemRepository = require('../../../infrastructure/repositories/triagemRepository');
const AuditoriaRepository = require('../../../infrastructure/repositories/auditoriaRepository');

// Instâncias
const auditoriaRepository = new AuditoriaRepository();
const triagemRepository = new TriagemRepository(); // <-- Use apenas UMA vez
const processarTriagemUseCase = new ProcessarTriagem({ triagemRepository, auditoriaRepository });
const listarTriagensUseCase = new ListarTriagens({ triagemRepository });

// Função principal de triagem
async function processarTriagem(req, res) {
  try {
    const { utenteId, respostasJson } = req.body;

    const triagem = await processarTriagemUseCase.execute(
      { utenteId, respostasJson },
      req.usuario ? req.usuario.id : null
    );

    res.status(201).json({
      message: 'Triagem processada com sucesso',
      triagem
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function listarTriagens(req, res) {
  try {
    const triagens = await listarTriagensUseCase.execute();
    res.status(200).json(triagens);
  } catch (error) {
    console.error('Erro ao listar triagens:', error);
    res.status(500).json({ error: 'Erro ao listar triagens' });
  }
}

module.exports = { processarTriagem, listarTriagens };
