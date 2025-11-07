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

async function eliminarUsuario(req, res) {
  try {
    const { id } = req.params;

    // Verifica se o usuário existe
    const usuario = await usuarioRepository.findById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Impede que o gestor apague a si mesmo
    if (req.usuario.id === id) {
      return res.status(400).json({ error: 'Não pode eliminar a si próprio' });
    }

    // Elimina o usuário
    await usuarioRepository.delete(id);

    // Registra auditoria
    await auditoriaRepository.create({
      id: require('crypto').randomUUID(),
      entidade: 'Usuario',
      entidadeId: id,
      acao: 'delete',
      userId: req.usuario.id,
      detalhe: `Usuário ${usuario.nome} eliminado pelo gestor ${req.usuario.nome}`
    });

    res.json({ message: 'Usuário eliminado com sucesso' });
  } catch (error) {
    console.error('Erro ao eliminar usuário:', error);
    res.status(500).json({ error: 'Erro ao eliminar usuário' });
  }
}

// === CRIAR USUÁRIO ===
async function criarUsuario(req, res) {
  try {
    const { nome, email, senha, papel } = req.body;

    // validação básica
    if (!nome || !email || !senha || !papel) {
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });
    }

    // verifica se o e-mail já existe
    const existente = await usuarioRepository.findByEmail(email);
    if (existente) {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    // criptografa a senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // cria o usuário
    const novoUsuario = await usuarioRepository.create({
      nome,
      email,
      senha: senhaHash,
      papel,
    });

    // registra auditoria
    await auditoriaRepository.create({
      id: require("crypto").randomUUID(),
      entidade: "Usuario",
      entidadeId: novoUsuario.id,
      acao: "create",
      userId: req.usuario ? req.usuario.id : null,
      detalhe: `Usuário ${novoUsuario.nome} criado.`,
    });

    res.status(201).json({
      message: "Usuário criado com sucesso",
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        papel: novoUsuario.papel,
      },
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
}

async function listarUsuarios(req, res) {
  try {
    // Verificar se o usuário logado é gestor
    if (!req.usuario || req.usuario.papel !== 'gestor') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const usuarios = await usuarioRepository.findAll();
    
    res.json({ usuarios });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
}

async function listarMedicos(req, res) {
  try {

    if (!req.usuario || req.usuario.papel !== 'gestor') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const medicos = await usuarioRepository.findByPapel('medico');

    res.json({ medicos });
  } catch (err) {
    console.error("Erro ao listar médicos:", err);
    res.status(500).json({ error: "Erro ao listar médicos" });
  }
}


module.exports = {login, eliminarUsuario, criarUsuario, listarUsuarios, listarMedicos};
