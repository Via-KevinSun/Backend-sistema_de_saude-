const CriarUsuario = require('../../../domain/use-cases/criarUsuario');
const UsuarioRepository = require('../../../infrastructure/repositories/usuarioRepository');
const AuditoriaRepository = require('../../../infrastructure/repositories/auditoriaRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usuarioRepository = new UsuarioRepository();
const auditoriaRepository = new AuditoriaRepository();
const criarUsuarioUseCase = new CriarUsuario({ usuarioRepository, auditoriaRepository });

async function criarUsuario(req, res) {
  try {
    const { nome, email, senha, papel, mfaSecret } = req.body;
    const usuario = await criarUsuarioUseCase.execute(
      { nome, email, senha, papel, mfaSecret },
      req.usuario ? req.usuario.id : null // UserId do usuário autenticado, se houver
    );
    res.status(201).json({ id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;
    const usuario = await usuarioRepository.findByEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas 1' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
     return res.status(401).json({ error: 'Credenciais inválidas 2' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, papel: usuario.papel },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );

    res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel } });
  } catch (error) {
    res.status(500).json({ error: 'Erro no login' });
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

module.exports = { criarUsuario, login, eliminarUsuario };