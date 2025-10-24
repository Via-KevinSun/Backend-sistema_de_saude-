const IUsuarioRepository = require('../../interfaces/repositories/iUsuarioRepository');
const { prisma } = require('../../config/database');


class UsuarioRepository extends IUsuarioRepository {
  async create(usuario) {
    // Encriptar a senha antes de salvar
    // const senhaEncriptada = await bcrypt.hash(usuario.senha, 10);
    return await prisma.usuario.create({
      data: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        papel: usuario.papel,
        mfaSecret: usuario.mfaSecret,
        criadoEm: usuario.criadoEm
      }
    });
  }

  async findByEmail(email) {
    return await prisma.usuario.findUnique({ where: { email } });
  }

  async findById(id) {
    return await prisma.usuario.findUnique({ where: { id } });
  }
}

module.exports = UsuarioRepository;