// src/interfaces/http/routes/routes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authMiddlewareUtente = require("../middlewares/authMiddlewareUtente");
const { prisma } = require('../../../config/database');
const {
  criarUsuario,
  login,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  excluirUsuario,
  listarMedicos,
  listarMedicosDisponiveis,
} = require("../controllers/usuarioController");

const {
  criarUtente,
  loginUtente,
  listarUtentes,
  listarPerfil,
  buscarUtente,
  atualizarUtente,
  excluirUtente,
} = require("../controllers/utenteController");
const {
  processarTriagem,
  listarTriagensHoje,
  triagensPorZona,
} = require("../controllers/triagemController");
const {
  agendarTeleconsulta,
  listarConsultasHoje,
  estatisticasConsultas,
} = require("../controllers/consultaController");
const { gerarPrescricao } = require("../controllers/prescricaoController");
const {
  monitorarLeituraClinica,
} = require("../controllers/leituraClinicaController");
const {
  gerarRelatorioVigilancia,
} = require("../controllers/relatorioVigilanciaController");

// ADICIONE NO FINAL
const {
  criarZona,
  listarZonas,
  atualizarZona,
  excluirZona,
} = require("../controllers/zonaController");

// === REPOSITÓRIOS (já existiam) ===
const UtenteRepository = require("../../../infrastructure/repositories/utenteRepository");
const ConsultaRepository = require("../../../infrastructure/repositories/consultaRepository");
const TriagemRepository = require("../../../infrastructure/repositories/triagemRepository");
const UsuarioRepository = require("../../../infrastructure/repositories/usuarioRepository");

const utenteRepository = new UtenteRepository();
const consultaRepository = new ConsultaRepository();
const triagemRepository = new TriagemRepository();
const usuarioRepository = new UsuarioRepository();

// === ROTAS DE AUTENTICAÇÃO ===
router.post("/usuarios/login", login);
router.post("/utentes/login", loginUtente);

// === ROTAS DE USUÁRIOS (CRUD COMPLETO) ===
router.post("/usuarios/criar", authMiddleware(["gestor"]), criarUsuario);
router.get("/usuarios", authMiddleware(["gestor"]), listarUsuarios);
router.get("/usuarios/:id", authMiddleware(["gestor"]), buscarUsuario);
router.put("/usuarios/:id", authMiddleware(["gestor"]), atualizarUsuario);
router.delete("/usuarios/:id", authMiddleware(["gestor"]), excluirUsuario);

// === ROTAS DE UTENTES ===
router.post(
  "/utentes/criar",
  authMiddleware(["gestor", "medico", "enfermeiro", "agente"]),
  criarUtente
);
router.get(
  "/utentes",
  authMiddleware(["gestor", "medico", "agente","enfermeiro"]),
  listarUtentes
);
router.get("/utentes/me", authMiddlewareUtente, listarPerfil);

router.get("/utentes/:id", authMiddleware(["gestor", "medico"]), buscarUtente); // Nova!
router.put(
  "/utentes/:id",
  authMiddleware(["gestor", "medico"]),
  atualizarUtente
);
router.delete("/utentes/:id", authMiddleware(["gestor"]), excluirUtente);

// === ROTAS CLÍNICAS ===
router.post(
  "/triagens",
  authMiddleware(["agente", "enfermeiro", "medico", "gestor"]),
  processarTriagem
);
router.post(
  "/consultas",
  authMiddleware(["agente", "enfermeiro", "medico", "gestor"]),
  agendarTeleconsulta
);
router.post("/prescricoes", authMiddleware(["medico"]), gerarPrescricao);
router.post(
  "/leituras-clinicas",
  authMiddleware(["agente", "enfermeiro", "medico"]),
  monitorarLeituraClinica
);
router.post(
  "/relatorios/vigilancia",
  authMiddleware(["gestor"]),
  gerarRelatorioVigilancia
);

// === DASHBOARD GESTOR ===
router.get(
  "/dashboard/utentes/total",
  authMiddleware(["gestor"]),
  async (req, res) => {
    try {
      const utentes = await utenteRepository.findAll();
      res.json({ total: utentes.length });
    } catch (error) {
      res.status(500).json({ error: "Erro ao contar utentes" });
    }
  }
);

router.get(
  "/dashboard/consultas/hoje",
  authMiddleware(["gestor","medico","enfermeiro"]),
  listarConsultasHoje
);
router.get(
  "/dashboard/triagens/hoje",
  authMiddleware(["gestor", "agente", "medico"]),
  listarTriagensHoje
);
router.get(
  "/dashboard/usuarios/medicos",
  authMiddleware(["gestor"]),
  listarMedicos
);
router.get(
  "/dashboard/consultas/estatisticas",
  authMiddleware(["gestor"]),
  estatisticasConsultas
);
router.get(
  "/dashboard/triagens/por-zona",
  authMiddleware(["gestor"]),
  triagensPorZona
);

// === ROTAS DE ZONAS ===
router.post("/zonas", authMiddleware(["gestor"]), criarZona);
router.get(
  "/zonas",
  authMiddleware(["gestor", "medico", "enfermeiro", "agente"]),
  listarZonas
);
router.put("/zonas/:id", authMiddleware(["gestor"]), atualizarZona);
router.delete("/zonas/:id", authMiddleware(["gestor"]), excluirZona);

// === ROTAS DE TRIAGENS ===
router.get(
  "/triagens/utente/:utenteId",
  authMiddleware(["gestor", "medico", "enfermeiro", "agente"]),
  async (req, res) => {
    try {
      const { utenteId } = req.params;
      const triagens = await prisma.triagem.findMany({
        where: { utenteId },
        orderBy: { data: "desc" },
        take: 5,
      });
      res.json(triagens);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar triagens" });
    }
  }
);

// === ROTAS DE CONSULTAS ===
router.put(
  "/consultas/:id/realizada",
  authMiddleware(["medico", "enfermeiro", "gestor"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const consulta = await prisma.consulta.update({
        where: { id },
        data: { realizada: true },
        include: { utente: true },
      });
      res.json(consulta);
    } catch (error) {
      console.error("Erro ao marcar consulta:", error);
      res.status(400).json({ error: "Erro ao marcar como realizada" });
    }
  }
);

router.get(
  "/medicos",
  authMiddleware(["gestor", "medico", "enfermeiro", "agente"]),
  listarMedicosDisponiveis
);


module.exports = router;

//Adicionei agora
/*
router.get(
  "/triagens/recentes-medico",
  authMiddleware(["medico"]),
  async (req, res) => {
    try {
      const medicoId = req.user.id;
      const triagens = await prisma.triagem.findMany({
        where: {
          consulta: {
            profissionalId: medicoId
          }
        },
        include: {
          utente: {
            select: { nome: true, contacto: true }
          }
        },
        orderBy: { data: "desc" },
        take: 5
      });
      res.json(triagens);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar triagens" });
    }
  }
);
*/