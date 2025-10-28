const AgendarTeleconsulta = require('../../../domain/use-cases/agendarTeleconsulta');
const ConsultaRepository = require('../../../infrastructure/repositories/consultaRepository');
const AuditoriaRepository = require('../../../infrastructure/repositories/auditoriaRepository');
const ListarConsultas = require('../../../domain/use-cases/listarConsultas');

const consultaRepository = new ConsultaRepository();
const auditoriaRepository = new AuditoriaRepository();
const agendarTeleconsultaUseCase = new AgendarTeleconsulta({ consultaRepository, auditoriaRepository });
const listarConsultasUseCase = new ListarConsultas({ consultaRepository });

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

async function listarConsultas(req, res) {
  try {
    const consultas = await listarConsultasUseCase.execute();
    res.json(consultas);
  } catch (error) {
    console.error('Erro ao listar consultas:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { agendarTeleconsulta, listarConsultas };