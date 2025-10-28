const GerarPrescricao = require('../../../domain/use-cases/gerarPrescricao');
const PrescricaoRepository = require('../../../infrastructure/repositories/prescricaoRepository');
const ConsultaRepository = require('../../../infrastructure/repositories/consultaRepository');
const AuditoriaRepository = require('../../../infrastructure/repositories/auditoriaRepository');  
const ListarPrescricoes = require('../../../domain/use-cases/listarPrescricoes');

const prescricaoRepository = new PrescricaoRepository();
const consultaRepository = new ConsultaRepository();
const auditoriaRepository = new AuditoriaRepository();
const gerarPrescricaoUseCase = new GerarPrescricao({ prescricaoRepository, consultaRepository, auditoriaRepository });
const listarPrescricoesUseCase = new ListarPrescricoes({ prescricaoRepository });


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

async function listarPrescricoes(req, res) {
  try {
    const prescricoes = await listarPrescricoesUseCase.execute();
    res.status(200).json(prescricoes);
  } catch (error) {
    console.error('Erro ao listar prescrições:', error);
    res.status(500).json({ error: 'Erro ao listar prescrições' });
  }
}

module.exports = { gerarPrescricao, listarPrescricoes };