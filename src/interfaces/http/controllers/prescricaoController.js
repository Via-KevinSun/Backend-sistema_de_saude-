const GerarPrescricao = require('../../../domain/use-cases/gerarPrescricao');
const PrescricaoRepository = require('../../../infrastructure/repositories/prescricaoRepository');
const ConsultaRepository = require('../../../infrastructure/repositories/consultaRepository');
const AuditoriaRepository = require('../../../infrastructure/repositories/auditoriaRepository');

const prescricaoRepository = new PrescricaoRepository();
const consultaRepository = new ConsultaRepository();
const auditoriaRepository = new AuditoriaRepository();
const gerarPrescricaoUseCase = new GerarPrescricao({ prescricaoRepository, consultaRepository, auditoriaRepository });

async function gerarPrescricao(req, res) {
  try {
    const { consultaId, medicamento, dosagem, duracao, observacoes } = req.body;
    const prescricao = await gerarPrescricaoUseCase.execute(
      { consultaId, medicamento, dosagem, duracao, observacoes },
      req.usuario ? req.usuario.id : null
    );
    res.status(201).json(prescricao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { gerarPrescricao };