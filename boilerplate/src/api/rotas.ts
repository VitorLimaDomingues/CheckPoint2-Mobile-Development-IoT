/**
 * rotas.ts — as rotas da API.
 *
 * JA VEM PRONTO. Voce nao precisa mudar nada aqui.
 *
 * Leia com calma mesmo assim: repare que cada rota so faz tres coisas.
 * Pega o que chegou no pedido, chama um servico seu, devolve a resposta.
 * A regra de negocio nao mora aqui, mora em src/servicos/. E por isso que
 * da para testar tudo com Jest sem nunca subir o servidor.
 *
 * Repare tambem nos tipos entre < > depois de Request e Response. Eles
 * dizem ao TypeScript o que entra e o que sai de cada rota. Com eles no
 * lugar, o editor reclama antes de voce rodar, e nao depois.
 */
import { Router, Request, Response } from 'express';

import {
  listarSessoes as sessoesDoRepositorio,
  listarVendas,
  salvarVenda,
  removerVenda,
  buscarSessao,
} from '../dados/repositorio';

import { PedidoVenda, SessaoResumo, Venda, Fechamento } from '../tipos';

import { precoDoIngresso } from '../servicos/precoDoIngresso';
import { poltronaValida } from '../servicos/poltronaValida';
import { listarSessoes } from '../servicos/listarSessoes';
import { venderIngresso } from '../servicos/venderIngresso';
import { fechamentoDoDia } from '../servicos/fechamentoDoDia';

/** O corpo que a API devolve quando alguma regra recusa o pedido. */
interface RespostaErro {
  erro: string;
}

export const rotas = Router();

// ───────────────────────────────────────────────────────────────────
//  GET /sessoes
// ───────────────────────────────────────────────────────────────────
rotas.get('/sessoes', (_req: Request, res: Response<SessaoResumo[]>) => {
  const resumos: SessaoResumo[] = listarSessoes(sessoesDoRepositorio(), listarVendas());
  res.status(200).json(resumos);
});

// ───────────────────────────────────────────────────────────────────
//  GET /preco  (Q1)
// ───────────────────────────────────────────────────────────────────
interface RespostaPreco {
  preco: number;
}

rotas.get('/preco', (req: Request, res: Response<RespostaPreco | RespostaErro>) => {
  const precoBase: number = Number(req.query.precoBase);
  const meiaEntrada: boolean = String(req.query.meiaEntrada) === 'true';
  const horario: string = String(req.query.horario || '');

  switch (Number.isFinite(precoBase) && horario.length > 0) {
    case false:
      res.status(400).json({ erro: 'use ?precoBase=45&meiaEntrada=true&horario=21:00' });
      break;
    default:
      res.status(200).json({ preco: precoDoIngresso(precoBase, meiaEntrada, horario) });
      break;
  }
});

// ───────────────────────────────────────────────────────────────────
//  GET /poltrona-valida  (Q2)
// ───────────────────────────────────────────────────────────────────
interface RespostaPoltronaValida {
  valida: boolean;
}

rotas.get(
  '/poltrona-valida',
  (req: Request, res: Response<RespostaPoltronaValida | RespostaErro>) => {
    const poltrona: string = String(req.query.poltrona || '');
    const capacidade: number = Number(req.query.capacidade);

    switch (poltrona.length > 0 && Number.isFinite(capacidade)) {
      case false:
        res.status(400).json({ erro: 'use ?poltrona=B4&capacidade=60' });
        break;
      default:
        res.status(200).json({ valida: poltronaValida(poltrona, capacidade) });
        break;
    }
  }
);

interface ParamsSessao {
  id: string;
}

// ───────────────────────────────────────────────────────────────────
//  POST /vendas
// ───────────────────────────────────────────────────────────────────
rotas.post(
  '/vendas',
  (
    req: Request<{}, Venda | RespostaErro, PedidoVenda>,
    res: Response<Venda | RespostaErro>
  ) => {
    const resultado = venderIngresso(req.body, sessoesDoRepositorio(), listarVendas());

    switch (resultado.tipo) {
      case 'VENDIDO':
        salvarVenda(resultado.venda);
        res.status(201).json(resultado.venda);
        break;
      case 'RECUSADO':
        res.status(409).json({ erro: resultado.motivo });
        break;
      default:
        res.status(500).json({ erro: 'servico devolveu um resultado que a rota nao conhece' });
        break;
    }
  }
);

// ───────────────────────────────────────────────────────────────────
//  DELETE /vendas/:sessaoId/:poltrona
// ───────────────────────────────────────────────────────────────────
interface ParamsCancelamento {
  sessaoId: string;
  poltrona: string;
}

// Cancelamento nao tem questao: o repositorio resolve sozinho (e ja limpa
// a poltrona que chega suja da URL antes de comparar).
rotas.delete(
  '/vendas/:sessaoId/:poltrona',
  (req: Request<ParamsCancelamento>, res: Response<RespostaErro | undefined>) => {
    const apagou: boolean = removerVenda(req.params.sessaoId, req.params.poltrona);

    switch (apagou) {
      case true:
        res.status(204).send();
        break;
      default:
        res.status(404).json({ erro: 'nao havia venda nessa poltrona' });
        break;
    }
  }
);

// ───────────────────────────────────────────────────────────────────
//  GET /fechamento
// ───────────────────────────────────────────────────────────────────
rotas.get('/fechamento', (_req: Request, res: Response<Fechamento>) => {
  const relatorio: Fechamento = fechamentoDoDia(sessoesDoRepositorio(), listarVendas());
  res.status(200).json(relatorio);
});

// ───────────────────────────────────────────────────────────────────
//  Rota de apoio: mostra uma sessao crua, do jeito que o repositorio
//  guarda. Serve para voce comparar com o que o seu servico devolve.
// ───────────────────────────────────────────────────────────────────
rotas.get('/debug/sessoes/:id', (req: Request<ParamsSessao>, res: Response) => {
  const sessao = buscarSessao(req.params.id);

  switch (sessao) {
    case undefined:
      res.status(404).json({ erro: 'sessao nao encontrada' });
      break;
    default:
      res.status(200).json(sessao);
      break;
  }
});
