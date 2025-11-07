const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { estatisticasConsultasPorData } = require('../controllers/consultaController');
// Total de utentes
router.get('/utentes/total', dashboardController.getTotalUtentes);

// Consultas feitas hoje
router.get('/consultas/hoje', dashboardController.getConsultasHoje);

// Triagens feitas hoje
router.get('/triagens/today', dashboardController.getTriagensHoje);

// Número total de médicos
router.get('/usuarios/medicos', dashboardController.getTotalMedicos);

// Estatísticas de consultas
router.get('/consultas/estatisticas', estatisticasConsultasPorData);

// Triagens por zona
router.get('/triagens/por-zona', dashboardController.getTriagensPorZona);

module.exports = router;
