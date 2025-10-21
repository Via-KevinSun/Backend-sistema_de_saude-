const ProcessarTriagem = require('../../../domain/use-cases/processarTriagem');
const TriagemRepository = require('../../../infrastructure/repositories/triagemRepository');
const AuditoriaRepository = require('../../../infrastructure/repositories/auditoriaRepository');

const triagemRepository = new TriagemRepository();
const auditoriaRepository = new AuditoriaRepository();
const processarTriagemUseCase = new ProcessarTriagem({ triagemRepository, auditoriaRepository });

async function processarTriagem(req, res) {
  try {
    const { utenteId, respostasJson, resultado, recomendacao } = req.body;
    const triagem = await processarTriagemUseCase.execute(
      { utenteId, respostasJson, resultado, recomendacao },
      req.usuario ? req.usuario.id : null
    );
    res.status(201).json(triagem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { processarTriagem };