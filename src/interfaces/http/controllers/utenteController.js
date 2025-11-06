const CriarUtente = require('../../../domain/use-cases/criarUtente');
const UtenteRepository = require('../../../infrastructure/repositories/utenteRepository');
const AuditoriaRepository = require('../../../infrastructure/repositories/auditoriaRepository');

const AtualizarUtente = require('../../../domain/use-cases/atualizarUtente');
const ExcluirUtente = require('../../../domain/use-cases/excluirUtente');

// const Utente = require('../../../domain/entities/Utente');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

const utenteRepository = new UtenteRepository();
const auditoriaRepository = new AuditoriaRepository();
const criarUtenteUseCase = new CriarUtente({ utenteRepository, auditoriaRepository });

const atualizarUtenteUseCase = new AtualizarUtente({ utenteRepository, auditoriaRepository });
const excluirUtenteUseCase = new ExcluirUtente({ utenteRepository, auditoriaRepository });

//Cadastro de um Utente
async function criarUtente(req, res) {
  try {
    const { nome, dataNascimento, sexo, contacto, localizacao, idLocal, senha } = req.body;
    const utente = await criarUtenteUseCase.execute(
      { nome, dataNascimento, sexo, contacto, localizacao, idLocal, senha },
      req.usuario ? req.usuario.id : null
    );
    res.status(201).json(utente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
//Permite que os Utente facam login no sistema
async function loginUtente(req, res) {
  try {
    const { contacto, senha } = req.body;

    const utente = await utenteRepository.findByContacto(contacto);
    if (!utente) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, utente.senha); // <-- corrigido
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: utente.id }, // <-- corrigido
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );

    res.json({ token, utente: { id: utente.id, nome: utente.nome, contacto: utente.contacto } }); // <-- corrigido
  } catch (error) {
    console.error('Erro no loginUtente:', error);
    res.status(500).json({ error: "Qualquer coisa..." });
  }
}

//Funcao para o Usuario listar os dados dos utentes
async function listarUtentes(req, res) {
  try {
    const utentes = await utenteRepository.findAll();
    res.json(utentes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar utentes' });
  }
}

//Funcao para o Utente listar o seu proprio perfil
async function listarPerfil(req, res) {
  try {
    const utente = await utenteRepository.findById(req.usuario.id);

    if (!utente) {
      return res.status(404).json({ error: 'Utente não encontrado' });
    }

    res.json({
      id: utente.id,
      nome: utente.nome,
      dataNascimento: utente.dataNascimento,
      sexo: utente.sexo,
      contacto: utente.contacto,
      localizacao: utente.localizacao,
      idLocal: utente.idLocal,
      zona: utente.zona,
    });
  } catch (error) {
    console.error('Erro ao buscar perfil do utente:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil do utente' });
  }
}

// === BUSCAR POR ID ===
async function buscarUtente(req, res) {
  try {
    const { id } = req.params;
    const utente = await utenteRepository.findById(id);
    if (!utente) return res.status(404).json({ error: 'Utente não encontrado' });
    res.json(utente);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar utente' });
  }
}

// === ATUALIZAR ===
async function atualizarUtente(req, res) {
  try {
    const { id } = req.params;
    const dados = req.body;
    dados.id = id;

    const utente = await atualizarUtenteUseCase.execute(dados, req.usuario.id);
    res.json(utente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// === EXCLUIR ===
async function excluirUtente(req, res) {
  try {
    const { id } = req.params;
    await excluirUtenteUseCase.execute(id, req.usuario.id);
    res.json({ message: 'Utente excluído com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { 
  criarUtente, loginUtente, listarUtentes, listarPerfil,
  buscarUtente, atualizarUtente, excluirUtente 
};

