/**
 * repositorio.ts — o banco do Cine FIAP. SQLite de verdade.
 *
 * JA VEM PRONTO. Voce nao precisa mexer aqui, e nao deve. Mas LEIA:
 * cada funcao roda uma consulta SQL real, e este e o mesmo desenho que
 * voce vai encontrar em qualquer backend profissional.
 *
 * O banco vive no arquivo cinefiap.db, criado e populado na primeira
 * subida do servidor. Venda gravada fica gravada: derrube o servidor,
 * suba de novo, e as poltronas continuam ocupadas. Para zerar tudo,
 * rode `npm run db:resetar` (so apaga o arquivo).
 *
 * Usamos o sql.js, que e o SQLite compilado para WebAssembly: banco
 * real, sem depender de nada instalado na sua maquina.
 *
 * Seus servicos NAO falam com o banco. Eles recebem os dados por
 * parametro e devolvem o resultado; quem consulta e grava sao as rotas,
 * atraves daqui. E por isso que da para testar tudo com Jest.
 */
import * as fs from 'fs';
import * as path from 'path';
import initSqlJs, { Database } from 'sql.js';

import { Classificacao, Formato, Sala, Sessao, Venda, Filme, TipoIngresso } from '../tipos';

const ARQUIVO_DO_BANCO: string = path.join(__dirname, '..', '..', 'cinefiap.db');

let banco: Database | null = null;

const ESQUEMA: string = `
  CREATE TABLE filmes (
    id            TEXT PRIMARY KEY,
    titulo        TEXT NOT NULL,
    duracao_min   INTEGER NOT NULL,
    classificacao TEXT NOT NULL,
    generos       TEXT NOT NULL
  );

  CREATE TABLE sessoes (
    id         TEXT PRIMARY KEY,
    filme_id   TEXT NOT NULL REFERENCES filmes(id),
    sala       TEXT NOT NULL,
    formato    TEXT NOT NULL,
    horario    TEXT NOT NULL,
    capacidade INTEGER NOT NULL,
    cancelada  INTEGER NOT NULL
  );

  CREATE TABLE vendas (
    sessao_id TEXT NOT NULL REFERENCES sessoes(id),
    poltrona  TEXT NOT NULL,
    preco     REAL NOT NULL,
    tipo      TEXT NOT NULL,
    PRIMARY KEY (sessao_id, poltrona)
  );
`;

const CARGA_INICIAL: string = `
  INSERT INTO filmes VALUES
    ('1', 'Duna', 155, 'QUATORZE', 'Ficção,Aventura'),
    ('2', 'Coringa', 122, 'DEZOITO', 'Drama,Suspense'),
    ('3', 'Meu Malvado Favorito', 95, 'LIVRE', 'Animação,Comédia'),
    ('4', 'Matrix', 136, 'QUATORZE', 'Ficção,Ação');

  INSERT INTO sessoes VALUES
    ('1', '1', 'IMAX',   'LEGENDADO', '14:00', 60, 0),
    ('2', '3', 'PADRAO', 'DUBLADO',   '15:30', 40, 0),
    ('3', '2', 'VIP',    'LEGENDADO', '19:30', 20, 0),
    ('4', '4', 'IMAX',   'ORIGINAL',  '21:00', 60, 0),
    ('5', '1', 'PADRAO', 'DUBLADO',   '22:30', 40, 1);
`;

/**
 * Abre o banco. Se o arquivo cinefiap.db nao existir, cria as tabelas e
 * poe a carga inicial. Chamada uma unica vez, pelo servidor, antes de
 * comecar a escutar a porta.
 */
export async function iniciarBanco(): Promise<void> {
  const SQL = await initSqlJs();

  switch (fs.existsSync(ARQUIVO_DO_BANCO)) {
    case true:
      banco = new SQL.Database(fs.readFileSync(ARQUIVO_DO_BANCO));
      break;
    default:
      banco = new SQL.Database();
      banco.run(ESQUEMA);
      banco.run(CARGA_INICIAL);
      gravarNoDisco();
      break;
  }
}

/** O sql.js trabalha em memoria: cada escrita salva o arquivo de novo. */
function gravarNoDisco(): void {
  if (banco === null) {
    return;
  }

  fs.writeFileSync(ARQUIVO_DO_BANCO, Buffer.from(banco.export()));
}

function exigirBanco(): Database {
  if (banco === null) {
    throw new Error('o banco ainda nao foi iniciado: iniciarBanco() roda no servidor.ts');
  }

  return banco;
}

/** Todas as sessoes do dia, na ordem do horario, com o filme junto (JOIN). */
export function listarSessoes(): Sessao[] {
  const db = exigirBanco();
  const consulta = db.prepare(`
    SELECT s.id, s.sala, s.formato, s.horario, s.capacidade, s.cancelada,
           f.id AS filme_id, f.titulo, f.duracao_min, f.classificacao, f.generos
      FROM sessoes s
      JOIN filmes f ON f.id = s.filme_id
     ORDER BY s.horario
  `);

  const sessoes: Sessao[] = [];

  while (consulta.step()) {
    const linha = consulta.getAsObject();
    const filme: Filme = {
      id: String(linha.filme_id),
      titulo: String(linha.titulo),
      duracaoMin: Number(linha.duracao_min),
      classificacao: String(linha.classificacao) as Classificacao,
      generos: String(linha.generos).split(','),
    };

    sessoes.push({
      id: String(linha.id),
      filme: filme,
      sala: String(linha.sala) as Sala,
      formato: String(linha.formato) as Formato,
      horario: String(linha.horario),
      capacidade: Number(linha.capacidade),
      cancelada: Number(linha.cancelada) === 1,
    });
  }

  consulta.free();
  return sessoes;
}

/** Uma sessao pelo id, ou undefined se nao existir. */
export function buscarSessao(id: string): Sessao | undefined {
  return listarSessoes().find((sessao) => sessao.id === id);
}

/** Todas as vendas ja registradas. */
export function listarVendas(): Venda[] {
  const db = exigirBanco();
  const consulta = db.prepare('SELECT sessao_id, poltrona, preco, tipo FROM vendas');
  const vendas: Venda[] = [];

  while (consulta.step()) {
    const linha = consulta.getAsObject();
    vendas.push({
      sessaoId: String(linha.sessao_id),
      poltrona: String(linha.poltrona),
      preco: Number(linha.preco),
      tipo: String(linha.tipo) as TipoIngresso,
    });
  }

  consulta.free();
  return vendas;
}

/** Grava uma venda (INSERT) e salva o arquivo. */
export function salvarVenda(venda: Venda): void {
  const db = exigirBanco();
  db.run('INSERT INTO vendas (sessao_id, poltrona, preco, tipo) VALUES (?, ?, ?, ?)', [
    venda.sessaoId,
    venda.poltrona,
    venda.preco,
    venda.tipo,
  ]);
  gravarNoDisco();
}

/**
 * Apaga uma venda (DELETE) e salva o arquivo.
 * A poltrona chega da URL, entao e limpa antes de comparar.
 */
export function removerVenda(sessaoId: string, poltrona: string): boolean {
  const db = exigirBanco();
  const procurada: string = poltrona.trim().toUpperCase();

  db.run('DELETE FROM vendas WHERE sessao_id = ? AND poltrona = ?', [sessaoId, procurada]);
  const apagadas: number = db.getRowsModified();
  gravarNoDisco();

  return apagadas > 0;
}
