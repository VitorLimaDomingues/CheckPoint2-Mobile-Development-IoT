/**
 * Q3 — GET /sessoes
 *
 * A primeira questao com um tipo SEU: antes da funcao, escreva a
 * interface SessaoResumo no src/tipos.ts (o TODO dela esta la).
 *
 * A funcao inteira e com voce:
 *
 *   - o nome precisa ser exatamente listarSessoes, exportada;
 *   - COMO ela e chamada esta em tests/listarSessoes.test.ts, e a rota
 *     GET /sessoes em src/api/rotas.ts mostra o que ela espera receber
 *     de volta;
 *   - as regras (ordem, titulo, vendidos, status) estao no ENUNCIADO.pdf.
 */

// Esta linha so existe para o arquivo ja contar como modulo TypeScript.
// Quando voce exportar a sua funcao, pode apagar.
import { SessaoResumo, Sessao, StatusSessao, Venda } from '../tipos'
 
// TODO: export function listarSessoes(...) { ... }
export function listarSessoes(sessoes: Sessao[], vendas: Venda[]): SessaoResumo[] {
    
    return sessoes.map((sessao: Sessao): SessaoResumo => {
        const vendasDaSessao: Venda[] = vendas.filter(
            (venda: Venda): boolean => venda.sessaoId === sessao.id
        )

        const vendidos: number = vendasDaSessao.length;

        let status: StatusSessao = "ABERTA";

        if (sessao.cancelada === true) {
            status = "ENCERRADA";
        } else if (vendidos >= sessao.capacidade) {
            status = "ESGOTADA";
        } else {
         status = "ABERTA";   
        }

        const resumo: SessaoResumo = {
            id: sessao.id,
            titulo: sessao.filme.titulo,
            horario: sessao.horario,
            sala: sessao.sala,
            formato: sessao.formato,
            vendidos: vendidos,
            capacidade: sessao.capacidade,
            status: status
        }

        return resumo

    });
}