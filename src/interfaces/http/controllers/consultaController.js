const AgendarTeleconsulta = require('../../../domain/use-cases/agendarTeleconsulta');
const ConsultaRepository = require('../../../infrastructure/repositories/consultaRepository');
const AuditoriaRepository = require('../../../infrastructure/repositories/auditoriaRepository');

const consultaRepository = new ConsultaRepository();
const auditoriaRepository = new AuditoriaRepository();
const agendarTeleconsultaUseCase = new AgendarTeleconsulta({ consultaRepository, auditoriaRepository });

async function agendarTeleconsulta(req, res) {
  try {
    const { utenteId, profissionalId, tipo, data } = req.body;
    const consulta = await agendarTeleconsultaUseCase.execute(
      { utenteId, profissionalId, tipo, data },
      req.usuario ? req.usuario.id : null
    );
    res.status(201).json(consulta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { agendarTeleconsulta };