const GerarRelatorioVigilancia = require('../../../domain/use-cases/gerarRelatorioVigilancia');
const TriagemRepository = require('../../../infrastructure/repositories/triagemRepository');
const LeituraClinicaRepository = require('../../../infrastructure/repositories/leituraClinicaRepository');
const AuditoriaRepository = require('../../../infrastructure/repositories/auditoriaRepository');

const triagemRepository = new TriagemRepository();
const leituraClinicaRepository = new LeituraClinicaRepository();
const auditoriaRepository = new AuditoriaRepository();
const gerarRelatorioVigilanciaUseCase = new GerarRelatorioVigilancia({
  triagemRepository,
  leituraClinicaRepository,
  auditoriaRepository
});

async function gerarRelatorioVigilancia(req, res) {
  try {
    const { zonaId, periodoInicio, periodoFim } = req.body;
    const relatorio = await gerarRelatorioVigilanciaUseCase.execute(
      { zonaId, periodoInicio, periodoFim },
      req.usuario ? req.usuario.id : null
    );
    res.status(200).json(relatorio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { gerarRelatorioVigilancia };