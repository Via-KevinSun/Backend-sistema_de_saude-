// src/domain/use-cases/excluirUtente.js
class ExcluirUtente {
  constructor({ utenteRepository, auditoriaRepository }) {
    this.utenteRepository = utenteRepository;
    this.auditoriaRepository = auditoriaRepository;
  }

  async execute(id, userId) {
    const utente = await this.utenteRepository.findById(id);
    if (!utente) throw new Error('Utente não encontrado');

    await this.utenteRepository.delete(id);

    await this.auditoriaRepository.create({
      entidade: 'utente',
      entidadeId: id,
      acao: 'excluir',
      userId,
      detalhe: `Excluído: ${utente.nome}`
    });

    return { message: 'Utente excluído com sucesso' };
  }
}

module.exports = ExcluirUtente;