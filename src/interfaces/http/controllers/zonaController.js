// src/interfaces/http/controllers/zonaController.js
const ZonaRepository = require('../../../infrastructure/repositories/zonaRepository');
const AuditoriaRepository = require('../../../infrastructure/repositories/auditoriaRepository');
const CriarZona = require('../../../domain/use-cases/criarZona');

const zonaRepository = new ZonaRepository();
const auditoriaRepository = new AuditoriaRepository();
const criarZonaUseCase = new CriarZona({ zonaRepository, auditoriaRepository });

const AtualizarZona = require('../../../domain/use-cases/atualizarZona');
const ExcluirZona = require('../../../domain/use-cases/excluirZona');

const atualizarZonaUseCase = new AtualizarZona({ zonaRepository, auditoriaRepository });
const excluirZonaUseCase = new ExcluirZona({ zonaRepository, auditoriaRepository });

async function atualizarZona(req, res) {
  try {
    const { id } = req.params;
    const dados = { id, ...req.body };
    const zona = await atualizarZonaUseCase.execute(dados, req.usuario.id);
    res.json(zona);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function excluirZona(req, res) {
  try {
    const { id } = req.params;
    await excluirZonaUseCase.execute(id, req.usuario.id);
    res.json({ message: 'Zona excluída' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function criarZona(req, res) {
  try {
    const { nome, coordenadas } = req.body;
    const zona = await criarZonaUseCase.execute({ nome, coordenadas }, req.usuario.id);
    res.status(201).json(zona);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function listarZonas(req, res) {
  try {
    const zonas = await zonaRepository.findAll();
    res.json(zonas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar zonas' });
  }
}

module.exports = { criarZona, listarZonas, atualizarZona, excluirZona };