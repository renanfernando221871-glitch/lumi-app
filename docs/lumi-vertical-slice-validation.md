# Validação do vertical slice — Lumi

**Data:** 14 de setembro de 2026  
**Referência de requisitos:** [`lumi-prd.md`](./lumi-prd.md)  
**Status geral:** **BLOQUEADO — não há implementação para executar**

## 1. Escopo e evidência consultada

A revisão foi feita no checkout atual e verificou:

- arquivos rastreados pelo Git;
- branches e commits locais;
- referências remotas configuradas;
- arquivos de configuração do projeto;
- presença de código, testes, dependências e workflow.

Resultado: o repositório contém apenas `.replit` como arquivo de projeto. A branch `main`, a branch `replit-agent` e o histórico local não contêm código do Lumi. O remoto configurado não retornou branches. Não foi possível iniciar um servidor, abrir preview, inspecionar rotas, executar testes ou mapear componentes.

### Convenção usada nesta auditoria

- **Passou:** comportamento executado e sustentado por código ou teste.
- **Falhou:** comportamento executado e divergente do critério.
- **Não observado:** não existe implementação/evidência disponível para executar.
- **Bloqueado:** o critério não pode ser classificado como passou ou falhou por falta de um pré-requisito.

Ausência de código não é tratada como aprovação nem como bug comportamental reproduzido.

## 2. Matriz de rastreabilidade

| Fluxo | Critérios | Código esperado | Comportamento observável | Status | Impacto | Risco | Esforço para desbloquear |
|---|---|---|---|---|---|---|---|
| F-01. Abrir e entender o Lumi | CA-01 | Rota inicial, tela e estados de boot | Nenhuma aplicação/workflow disponível | Bloqueado | Crítico | Alto | M |
| F-02. Preencher e validar entrada | CA-02, CA-03 | Campo, validação e handler de envio | Nenhum componente ou teste encontrado | Bloqueado | Crítico | Alto | M |
| F-03. Processar e mostrar resultado | CA-02, CA-04 | Serviço/endpoint, loading e render de resultado | Não há runtime para executar | Bloqueado | Crítico | Alto | M/L |
| F-04. Recuperar de falha | CA-05 | Tratamento de erro e retry | Nenhuma implementação observável | Bloqueado | Alto | Alto | M |
| F-05. Persistir e reabrir estado | CA-06 | Persistência e fronteira de sessão/usuário | Nenhum banco, storage ou contrato de sessão encontrado | Bloqueado | Alto | Alto | M/L |
| F-06. Usar com teclado/assistive tech | CA-07 | Semântica, foco e nomes acessíveis | Nenhuma UI disponível para inspeção | Bloqueado | Médio | Médio | S/M |

**Resultado:** 0 fluxos passaram, 0 falharam por comportamento reproduzido e 6 estão bloqueados por ausência do produto.

## 3. Lacunas priorizadas

| ID | Lacuna | Impacto | Risco | Esforço | Prioridade | Próxima ação |
|---|---|---:|---:|---:|---|---|
| G-01 | Não existe código executável nem workflow do Lumi no checkout. | Crítico | Alto | M | P0 | Criar/recuperar a aplicação e configurar uma entrada executável no preview. |
| G-02 | O domínio da entrada, processamento e resultado não foi definido em fonte versionada. | Crítico | Alto | S | P0 | Confirmar as sete questões abertas do PRD antes de fixar nomes e contratos. |
| G-03 | Não há contrato técnico demonstrável entre ação primária, processamento e resultado. | Crítico | Alto | M | P0 | Implementar o caminho feliz e os estados de loading, sucesso e erro. |
| G-04 | Não há evidência de persistência nem de isolamento de sessão/usuário. | Alto | Alto | M/L | P1 | Escolher a estratégia de persistência e testar recarga, sessão anônima e usuário autenticado, se aplicável. |
| G-05 | Não há testes ou roteiro de execução versionado. | Alto | Médio | M | P1 | Adicionar testes do fluxo principal e um roteiro manual do preview. |
| G-06 | Não há evidência de acessibilidade, responsividade ou ausência de erros no console. | Médio | Médio | S/M | P1 | Validar o slice em teclado, viewport estreito e console limpo. |

### Classificação

- **Impacto:** efeito sobre a capacidade de demonstrar o primeiro valor do produto.
- **Risco:** probabilidade de construir contra uma premissa errada ou entregar uma regressão não detectada.
- **Esforço:** estimativa relativa para produzir e validar a evidência, não uma estimativa de prazo.

## 4. Decisão da validação

O vertical slice **não pode ser aprovado** neste estado. Não há base para afirmar aderência ao PRD porque o artefato a ser validado não está no checkout. A entrega desta tarefa é, portanto:

1. disponibilizar o PRD e os critérios de aceite;
2. tornar explícita a matriz de evidências;
3. registrar os bloqueios e sua prioridade;
4. fornecer um prompt de correção que possa ser usado quando o código estiver disponível.

Para reabrir a validação, é necessário disponibilizar código do Lumi em uma branch acessível, junto com um comando de execução e, idealmente, um roteiro ou referência visual do fluxo pretendido.

## 5. Evidência mínima para a próxima rodada

Uma nova auditoria deve guardar, para cada fluxo:

- caminho do arquivo ou rota que implementa o fluxo;
- passos executados no preview;
- resultado observado;
- teste automatizado correspondente, quando existir;
- captura ou log apenas quando necessário para demonstrar o estado;
- critério de aceite marcado como passou, falhou ou ainda não observado.
