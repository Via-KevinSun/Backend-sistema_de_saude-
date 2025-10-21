const MonitorarLeituraClinica = require('../../../domain/use-cases/monitorarLeituraClinica');
const LeituraClinicaRepository = require('../../../infrastructure/repositories/leituraClinicaRepository');
const NotificacaoRepository = require('../../../infrastructure/repositories/notificacaoRepository');
const AuditoriaRepository = require('../../../infrastructure/repositories/auditoriaRepository');

const leituraClinicaRepository = new LeituraClinicaRepository();
const notificacaoRepository = new NotificacaoRepository();
const auditoriaRepository = new AuditoriaRepository();
const monitorarLeituraClinicaUseCase = new MonitorarLeituraClinica({
  leituraClinicaRepository,
  notificacaoRepository,
  auditoriaRepository
});

async function monitorarLeituraClinica(req, res) {
  try {
    const { utenteId, tipo, valor, inseridoPor } = req.body;
    const result = await monitorarLeituraClinicaUseCase.execute(
      { utenteId, tipo, valor, inseridoPor },
      req.usuario ? req.usuario.id : null
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { monitorarLeituraClinica };