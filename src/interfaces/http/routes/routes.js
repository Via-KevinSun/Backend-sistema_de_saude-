const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { criarUsuario, login } = require('../controllers/usuarioController');
const { criarUtente } = require('../controllers/utenteController');
const { processarTriagem } = require('../controllers/triagemController');
const { agendarTeleconsulta } = require('../controllers/consultaController');
const { gerarPrescricao } = require('../controllers/prescricaoController');
const { monitorarLeituraClinica } = require('../controllers/leituraClinicaController');
const { gerarRelatorioVigilancia } = require('../controllers/relatorioVigilanciaController');

// Rotas de Usuário
router.post('/usuarios', authMiddleware(['gestor']), criarUsuario); // Apenas gestores criam usuários
router.post('/usuarios/login', login); // Login aberto

// Rotas de Utente
router.post('/utentes', authMiddleware(['agente', 'enfermeiro', 'medico', 'gestor']), criarUtente);

// Rotas de Triagem
router.post('/triagens', authMiddleware(['agente', 'enfermeiro', 'medico']), processarTriagem);

// Rotas de Consulta
router.post('/consultas', authMiddleware(['agente', 'enfermeiro', 'medico', 'gestor']), agendarTeleconsulta);

// Rotas de Prescrição
router.post('/prescricoes', authMiddleware(['medico']), gerarPrescricao); // Apenas médicos criam prescrições

// Rotas de Leitura Clínica
router.post('/leituras-clinicas', authMiddleware(['agente', 'enfermeiro', 'medico']), monitorarLeituraClinica);

// Rotas de Vigilância Epidemiológica
router.post('/relatorios/vigilancia', authMiddleware(['gestor']), gerarRelatorioVigilancia); // Apenas gestores geram relatórios

// Rota raiz
router.get('/', (req, res) => {
  res.json({ message: 'API eSaúde Local' });
});

module.exports = router;