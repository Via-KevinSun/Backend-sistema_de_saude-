const INotificacaoRepository = require('../../interfaces/repositories/iNotificacaoRepository');
const { prisma } = require('../../config/database');

class NotificacaoRepository extends INotificacaoRepository {
  async create(notificacao) {
    return await prisma.notificacao.create({
      data: {
        id: notificacao.id,
        utenteId: notificacao.utenteId,
        tipo: notificacao.tipo,
        mensagem: notificacao.mensagem,
        enviadoEm: notificacao.enviadoEm,
        status: notificacao.status
      }
    });
  }
}

module.exports = NotificacaoRepository;