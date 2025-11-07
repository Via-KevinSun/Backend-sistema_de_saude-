// src/interfaces/http/routes/routes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authMiddlewareUtente = require('../middlewares/authMiddlewareUtente');
const { login, eliminarUsuario, criarUsuario, listarUsuarios, listarMedicos} = require('../controllers/usuarioController');
const { criarUtente, loginUtente, listarUtentes, listarPerfil, eliminarUtente, editarUtente } = require('../controllers/utenteController');
const { processarTriagem, listarTriagens  } = require('../controllers/triagemController');
const { agendarTeleconsulta, listarConsultas } = require('../controllers/consultaController');
const { gerarPrescricao, listarPrescricoes } = require('../controllers/prescricaoController');
const { monitorarLeituraClinica } = require('../controllers/leituraClinicaController');
const { gerarRelatorioVigilancia } = require('../controllers/relatorioVigilanciaController');
const { listarZonas } = require("../controllers/zonaController");
const { route } = require("./dashboardRoutes");

// Rotas de Usuário
router.post('/usuarios',authMiddleware(['gestor']), criarUsuario); // Apenas gestores criam usuários

//Listar Usuario
router.get('/usuarios', authMiddleware(['gestor']),listarUsuarios);

//Gestor eliminar usuarios
router.delete('/usuarios/:id', authMiddleware(['gestor']), eliminarUsuario);


router.post('/usuarios/login', login); // Login aberto

router.get('/usuarios/medico', authMiddleware(['gestor']), listarMedicos);

// Rotas de Utente
router.post('/cadUtente', authMiddleware(['agente', 'enfermeiro', 'medico', 'gestor']), criarUtente);

// Rotas de Triagem
router.post('/triagens', processarTriagem);

//Listar triagens
router.get(
  '/triagens',
  authMiddleware(['agente', 'enfermeiro', 'medico', 'gestor']),
  listarTriagens
);

// Rotas de Consulta
router.post('/consultas', authMiddleware(['agente', 'enfermeiro', 'medico']), agendarTeleconsulta);

router.get(
  '/consultas',
  authMiddleware(['agente', 'enfermeiro', 'medico', 'gestor']),
  listarConsultas
);

// Rotas de Prescrição
router.post('/prescricoes', authMiddleware(['medico']), gerarPrescricao); // Apenas médicos criam prescrições

//listar prescricoes
router.get(
  '/prescricoes',
  authMiddleware(['medico', 'gestor']),
  listarPrescricoes
);


// Rotas de Leitura Clínica
router.post('/leituras-clinicas', authMiddleware(['agente', 'enfermeiro', 'medico']), monitorarLeituraClinica);

// Rotas de Vigilância Epidemiológica
router.post('/relatorios/vigilancia', authMiddleware(['gestor']), gerarRelatorioVigilancia); // Apenas gestores geram relatórios


/*UTENTES*/
//Cadastro de um utente ao sistema
router.post('/utentes', criarUtente);

/*Eliminar utente rota disponivel para o gestor*/
router.delete('/utentes/:id', authMiddleware(['gestor']), eliminarUtente);
//login do utente
router.post('/Utentes/login', loginUtente);

/*Editar utente */
router.put('/utentes/:id', authMiddleware(['gestor']), editarUtente);

//Usuario listar utentes
/*Essa rota permite que apenas medicos e gestor liste todos os Utentes*/
router.get('/utentes', authMiddleware(['gestor','medico','enfermeiro']),listarUtentes);

/*Essa rota permite que um utente veja os seus proprios dados*/
router.get('/utentes/me', authMiddlewareUtente, listarPerfil);

/*ZONAS */
router.get("/zonas", listarZonas);


// Rota raiz
router.get('/', (req, res) => {
  res.json({ message: 'API eSaúde Local' });
});

module.exports = router;
