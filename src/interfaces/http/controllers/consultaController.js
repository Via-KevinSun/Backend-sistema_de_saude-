// ADICIONE NO TOPO
const { prisma } = require('../../../config/database'); // ← IMPORTA PRISMA

const AgendarTeleconsulta = require('../../../domain/use-cases/agendarTeleconsulta');
const ConsultaRepository = require('../../../infrastructure/repositories/consultaRepository');
const AuditoriaRepository = require('../../../infrastructure/repositories/auditoriaRepository');

// Instâncias únicas
const consultaRepository = new ConsultaRepository();
const auditoriaRepository = new AuditoriaRepository();
const agendarTeleconsultaUseCase = new AgendarTeleconsulta({ consultaRepository, auditoriaRepository });

// === FUNÇÕES DO DASHBOARD ===
async function listarConsultasHoje(req, res) {
  try {
    const hoje = new Date().toISOString().split('T')[0];
    const consultas = await consultaRepository.findByDate(hoje);
    
    res.json({ consultas }); // ← Array direto
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar consultas' });
  }
}

async function estatisticasConsultas(req, res) {
  try {
    const resultado = [];
    for (let i = 6; i >= 0; i--) {
      const data = new Date();
      data.setDate(data.getDate() - i);
      const dataStr = data.toISOString().split('T')[0];
      const consultas = await consultaRepository.findByDate(dataStr);
      resultado.push({ data: dataStr, total: consultas.length });
    }
    res.json(resultado);
  } catch (error) {
    console.error('Erro em estatisticasConsultas:', error);
    res.status(500).json({ error: 'Erro ao gerar estatísticas' });
  }
}

// === FUNÇÃO PRINCIPAL ===
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

module.exports = {
  agendarTeleconsulta,
  listarConsultasHoje,
  estatisticasConsultas
};