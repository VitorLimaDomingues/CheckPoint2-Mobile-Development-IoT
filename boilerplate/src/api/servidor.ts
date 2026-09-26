/**
 * servidor.ts — sobe a API e o Swagger UI.
 *
 * JA VEM PRONTO. Voce nao precisa mudar nada aqui.
 *
 *   npm run dev
 *   abra http://localhost:3001/docs
 *
 * O servidor sobe mesmo com os servicos ainda vazios. Ele vai responder
 * erro nas rotas, e tudo bem: e assim que voce ve seu progresso. Cada
 * servico que voce termina acende uma rota no Swagger.
 */
import express, { Application, Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';

import { rotas } from './rotas';
import { openapi } from './openapi';
import { iniciarBanco } from '../dados/repositorio';

const PORTA: number = 3001;

const app: Application = express();

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi, { customSiteTitle: 'Cine FIAP' }));
app.use('/', rotas);

app.get('/', (_req: Request, res: Response) => {
  res.redirect('/docs');
});

/**
 * Rede de seguranca. Enquanto um servico seu ainda esta vazio, ele
 * devolve undefined e a rota quebra ao tentar usar o resultado. Sem
 * isto o processo inteiro cairia; com isto voce ganha uma mensagem
 * dizendo qual servico ainda falta.
 */
app.use((erro: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const mensagem: string = erro instanceof Error ? erro.message : 'erro desconhecido';

  res.status(500).json({
    erro: 'algum servico ainda nao esta pronto ou devolveu algo inesperado',
    detalhe: mensagem,
  });
});

/**
 * O banco abre ANTES de a porta escutar: nenhum pedido chega sem o
 * SQLite pronto. Repare no padrao async na subida do servidor.
 */
async function subir(): Promise<void> {
  await iniciarBanco();

  app.listen(PORTA, () => {
    console.log('');
    console.log('  Cine FIAP no ar');
    console.log('  Swagger UI:  http://localhost:' + PORTA + '/docs');
    console.log('  Banco:       cinefiap.db (SQLite, criado na primeira subida)');
    console.log('');
  });
}

subir();
