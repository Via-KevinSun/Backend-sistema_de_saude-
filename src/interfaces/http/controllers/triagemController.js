// src/interfaces/http/controllers/triagemController.js
const { prisma } = require('../../../config/database');
const ProcessarTriagem = require('../../../domain/use-cases/processarTriagem');
const TriagemRepository = require('../../../infrastructure/repositories/triagemRepository');
const AuditoriaRepository = require('../../../infrastructure/repositories/auditoriaRepository');

// Instâncias
const auditoriaRepository = new AuditoriaRepository();
const triagemRepository = new TriagemRepository(); // <-- Use apenas UMA vez
const processarTriagemUseCase = new ProcessarTriagem({ triagemRepository, auditoriaRepository });

// Função principal de triagem
async function processarTriagem(req, res) {
  try {
    const { utenteId, respostasJson, resultado, recomendacao } = req.body;
    const triagem = await processarTriagemUseCase.execute(
      { utenteId, respostasJson, resultado, recomendacao },
      req.usuario ? req.usuario.id : null
    );
    res.status(201).json(triagem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Dashboard: Triagens de hoje
async function listarTriagensHoje(req, res) {
  try {
    const hoje = new Date().toISOString().split('T')[0];
    const triagens = await triagemRepository.findByDate(hoje);

    // BUSCA UTENTE DENTRO DE CADA TRIAGEM
    const triagensComUtente = await Promise.all(
      triagens.map(async (t) => {
        const utente = await prisma.utente.findUnique({
          where: { id: t.utenteId },
          select: { nome: true, contacto: true }
        });
        return { ...t, utente };
      })
    );

    res.json(triagensComUtente); // ← AGORA DEVOLVE A LISTA COMPLETA!
  } catch (error) {
    console.error("Erro em listarTriagensHoje:", error);
    res.status(500).json({ error: 'Erro ao buscar triagens de hoje' });
  }
}

// Dashboard: Triagens por zona
async function triagensPorZona(req, res) {
  try {
    const triagens = await triagemRepository.findAll();
    const porZona = triagens.reduce((acc, t) => {
      const zona = t.utente?.zona || 'Desconhecida';
      acc[zona] = (acc[zona] || 0) + 1;
      return acc;
    }, {});
    res.json(Object.entries(porZona).map(([zona, total]) => ({ zona, total })));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao agrupar triagens' });
  }
}

module.exports = { processarTriagem, listarTriagensHoje, triagensPorZona };