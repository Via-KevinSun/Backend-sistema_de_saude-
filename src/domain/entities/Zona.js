class Zona {
  constructor({ id, nome, coordenadas }) {
    if (!id) throw new Error('ID da zona é obrigatório');
    if (!nome) throw new Error('Nome da zona é obrigatório');

    this.id = id;
    this.nome = nome;
    this.coordenadas = coordenadas || null;
  }
}

module.exports = Zona;