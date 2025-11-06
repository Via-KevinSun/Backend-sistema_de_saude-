// src/interfaces/http/controllers/usuarioController.js
const CriarUsuario = require("../../../domain/use-cases/criarUsuario");
const AtualizarUsuario = require("../../../domain/use-cases/atualizarUsuario");
const ExcluirUsuario = require("../../../domain/use-cases/excluirUsuario");
const UsuarioRepository = require("../../../infrastructure/repositories/usuarioRepository");
const AuditoriaRepository = require("../../../infrastructure/repositories/auditoriaRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Instâncias
const usuarioRepository = new UsuarioRepository();
const auditoriaRepository = new AuditoriaRepository();

// Use Cases
const criarUsuarioUseCase = new CriarUsuario({
  usuarioRepository,
  auditoriaRepository,
});
const atualizarUsuarioUseCase = new AtualizarUsuario({
  usuarioRepository,
  auditoriaRepository,
});
const excluirUsuarioUseCase = new ExcluirUsuario({
  usuarioRepository,
  auditoriaRepository,
});

// === LOGIN (RECUPERADO!) ===
async function login(req, res) {
  try {
    const { email, senha } = req.body;
    const usuario = await usuarioRepository.findByEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: usuario.id, papel: usuario.papel },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

// === CRIAR USUÁRIO (RECUPERADO!) ===
async function criarUsuario(req, res) {
  try {
    const { nome, email, senha, papel, mfaSecret } = req.body;
    const usuario = await criarUsuarioUseCase.execute(
      { nome, email, senha, papel, mfaSecret },
      req.usuario ? req.usuario.id : null
    );
    res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function listarUsuarios(req, res) {
  try {
    const usuarios = await usuarioRepository.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
}

// === ADICIONE ESSA FUNÇÃO ===
async function listarMedicos(req, res) {
  try {
    const medicos = await usuarioRepository.findByPapel("medico");
    res.json({ total: medicos.length });
  } catch (error) {
    console.error("Erro ao listar médicos:", error);
    res.status(500).json({ error: "Erro ao buscar médicos" });
  }
}

async function buscarUsuario(req, res) {
  try {
    const { id } = req.params;
    const usuario = await usuarioRepository.findById(id);
    if (!usuario)
      return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
}

async function atualizarUsuario(req, res) {
  try {
    const { id } = req.params;
    const dados = req.body;
    dados.id = id;

    const usuario = await atualizarUsuarioUseCase.execute(
      dados,
      req.usuario.id
    );
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function excluirUsuario(req, res) {
  try {
    const { id } = req.params;
    await excluirUsuarioUseCase.execute(id, req.usuario.id);
    res.json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function listarMedicosDisponiveis(req, res) {
  try {
    const medicos = await usuarioRepository.findByPapel("medico");
    res.json(
      medicos.map(m => ({
        id: m.id,
        nome: m.nome,
        email: m.email
      }))
    );
  } catch (error) {
    res.status(500).json({ error: "Erro ao carregar médicos" });
  }
}

module.exports = {
  login,
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  excluirUsuario,
  listarMedicos,
  listarMedicosDisponiveis
};
