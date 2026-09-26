/**
 * openapi.ts — a descricao da API que o Swagger UI mostra na tela.
 *
 * JA VEM PRONTO. Repare que cada schema aqui embaixo descreve a mesma
 * coisa que uma interface do seu tipos.ts: sao dois jeitos de escrever
 * o mesmo contrato, um para a maquina e outro para quem usa a API.
 */
export const openapi = {
  openapi: '3.0.0',
  info: {
    title: 'Cine FIAP — API da bilheteria',
    version: '1.0.0',
    description:
      'Checkpoint 2 · FIAP Mobile & IoT Development. As rotas já estão prontas. ' +
      'O que você escreve são os serviços que elas chamam.',
  },
  tags: [
    { name: 'Sessões', description: 'Preço, poltrona e grade do dia' },
    { name: 'Vendas', description: 'Vender e cancelar ingresso' },
    { name: 'Relatórios', description: 'Fechamento do dia' },
  ],
  paths: {
    '/sessoes': {
      get: {
        tags: ['Sessões'],
        summary: 'Q3 · lista as sessões do dia',
        description: 'Chama o seu serviço `listarSessoes`.',
        responses: {
          200: {
            description: 'A grade do dia',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/SessaoResumo' } },
              },
            },
          },
        },
      },
    },
    '/preco': {
      get: {
        tags: ['Sessões'],
        summary: 'Q1 · preço de um ingresso',
        description: 'Chama o seu serviço `precoDoIngresso`. Três primitivos entram, um número sai.',
        parameters: [
          { name: 'precoBase', in: 'query', required: true, schema: { type: 'number' }, example: 45 },
          { name: 'meiaEntrada', in: 'query', required: true, schema: { type: 'boolean' }, example: true },
          { name: 'horario', in: 'query', required: true, schema: { type: 'string' }, example: '21:00' },
        ],
        responses: {
          200: {
            description: 'O preço calculado',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { preco: { type: 'number' } } },
                example: { preco: 24.75 },
              },
            },
          },
          400: { description: 'Parâmetros faltando' },
        },
      },
    },
    '/poltrona-valida': {
      get: {
        tags: ['Sessões'],
        summary: 'Q2 · a poltrona existe nesta sala?',
        description: 'Chama o seu serviço `poltronaValida`. Aceita a poltrona suja, tipo " b4 ".',
        parameters: [
          { name: 'poltrona', in: 'query', required: true, schema: { type: 'string' }, example: ' b4 ' },
          { name: 'capacidade', in: 'query', required: true, schema: { type: 'integer' }, example: 60 },
        ],
        responses: {
          200: {
            description: 'O veredito',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { valida: { type: 'boolean' } } },
                example: { valida: true },
              },
            },
          },
          400: { description: 'Parâmetros faltando' },
        },
      },
    },
    '/vendas': {
      post: {
        tags: ['Vendas'],
        summary: 'Q4 · vende um ingresso',
        description:
          'Chama o seu serviço `venderIngresso`. A resposta é 201 quando a venda ' +
          'acontece e 409 quando alguma regra recusa.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PedidoVenda' },
              example: { sessaoId: '1', poltrona: 'F10', idade: 15, tipo: 'INTEIRA' },
            },
          },
        },
        responses: {
          201: {
            description: 'Vendido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Venda' },
                example: { sessaoId: '1', poltrona: 'F10', preco: 45, tipo: 'INTEIRA' },
              },
            },
          },
          409: {
            description: 'Recusado por alguma regra',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { erro: { type: 'string' } } },
                example: { erro: 'poltrona ocupada' },
              },
            },
          },
        },
      },
    },
    '/vendas/{sessaoId}/{poltrona}': {
      delete: {
        tags: ['Vendas'],
        summary: 'Cancela um ingresso',
        description: 'Sem questão aqui: o repositório apaga a venda direto, com um DELETE no SQL.',
        parameters: [
          { name: 'sessaoId', in: 'path', required: true, schema: { type: 'string' }, example: '1' },
          { name: 'poltrona', in: 'path', required: true, schema: { type: 'string' }, example: 'F10' },
        ],
        responses: {
          204: { description: 'Cancelado' },
          404: { description: 'Não havia venda nessa poltrona' },
        },
      },
    },
    '/fechamento': {
      get: {
        tags: ['Relatórios'],
        summary: 'Q5 · fechamento do dia',
        description: 'Chama o seu serviço `fechamentoDoDia`.',
        responses: {
          200: {
            description: 'Totais do dia',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Fechamento' } },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      PedidoVenda: {
        type: 'object',
        required: ['sessaoId', 'poltrona', 'idade', 'tipo'],
        properties: {
          sessaoId: { type: 'string', example: '1' },
          poltrona: { type: 'string', example: 'F10' },
          idade: { type: 'integer', example: 15 },
          tipo: { type: 'string', enum: ['INTEIRA', 'ESTUDANTE', 'IDOSO', 'CRIANCA'] },
        },
      },
      Venda: {
        type: 'object',
        properties: {
          sessaoId: { type: 'string' },
          poltrona: { type: 'string' },
          preco: { type: 'number' },
          tipo: { type: 'string' },
        },
      },
      SessaoResumo: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          horario: { type: 'string' },
          titulo: { type: 'string' },
          sala: { type: 'string' },
          formato: { type: 'string' },
          vendidos: { type: 'integer' },
          capacidade: { type: 'integer' },
          status: { type: 'string', enum: ['ABERTA', 'ESGOTADA', 'ENCERRADA'] },
        },
      },
      Fechamento: {
        type: 'object',
        properties: {
          ingressos: { type: 'integer' },
          receita: { type: 'number' },
          ocupacaoPorSala: {
            type: 'object',
            additionalProperties: { type: 'integer' },
            example: { IMAX: 75, VIP: 100, PADRAO: 50 },
          },
          sessaoMaisCheia: { type: 'string', nullable: true, example: '3' },
        },
      },
    },
  },
};
