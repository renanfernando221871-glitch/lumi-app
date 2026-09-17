# Prompt de correção para o Replit Agent — Lumi

Use o texto abaixo como instrução da próxima implementação. Ele foi escrito para fechar as lacunas identificadas na validação, sem transformar uma UI estática em falsa evidência de produto pronto.

---

Você é responsável por implementar e validar o vertical slice do Lumi neste repositório.

## Contexto obrigatório

Leia primeiro:

- `docs/lumi-prd.md`
- `docs/lumi-vertical-slice-validation.md`

O PRD define o contrato mínimo. O relatório atual informa que não havia código executável no momento da auditoria. Antes de declarar qualquer critério como concluído, inspecione o estado real do checkout e preserve as decisões existentes. Se houver uma implementação parcial recuperada, adapte-a; não substitua arquitetura existente sem necessidade.

## Resultado esperado

Entregar uma aplicação executável no preview do Replit com este caminho completo:

1. abrir a tela inicial;
2. explicar o que o Lumi faz e mostrar a ação principal;
3. aceitar uma entrada válida;
4. rejeitar entrada vazia ou inválida sem iniciar processamento;
5. mostrar carregamento e impedir envio duplicado;
6. processar a entrada por uma fronteira explícita;
7. renderizar um resultado identificável;
8. permitir nova tentativa em caso de erro;
9. recuperar o resultado conforme a política de persistência escolhida;
10. funcionar por teclado e não gerar erros de runtime no fluxo.

## Regras de implementação

- Não use conteúdo falso ou um botão sem comportamento para marcar um critério como pronto.
- Se o domínio real da entrada e do resultado continuar desconhecido, mantenha os termos neutros do PRD e registre a decisão; não invente uma promessa de produto.
- Use chamadas relativas para APIs do mesmo projeto e não hardcode localhost no código da aplicação.
- Trate loading, sucesso, vazio e erro como estados explícitos.
- Desabilite ou torne idempotente a ação enquanto o mesmo processamento estiver em andamento.
- Não mostre stack trace, segredo ou detalhes internos ao usuário.
- Se houver persistência, documente se ela é local, por sessão ou por usuário; não misture dados entre usuários.
- Dê nome acessível aos controles, mantenha foco visível e associe mensagens de erro aos campos.
- Adicione testes que exercitem o caminho feliz, validação, falha recuperável e recuperação após recarga, conforme a estratégia escolhida.

## Entregáveis

1. Código executável e organizado para o vertical slice.
2. Workflow do Replit que inicia o app e expõe o preview.
3. Testes automatizados do contrato principal ou, se a stack não permitir, um roteiro manual reproduzível versionado.
4. Atualização da matriz em `docs/lumi-vertical-slice-validation.md` com:
   - arquivos/rotas relevantes;
   - passos observados;
   - status de cada CA-01 a CA-07;
   - lacunas que permanecerem.
5. Lista curta das decisões tomadas para as questões abertas do PRD.

## Validação obrigatória antes de finalizar

Execute os comandos de instalação, typecheck/lint e testes que existirem no projeto. Inicie o workflow, abra o preview e percorra os seis fluxos F-01 a F-06. Verifique também:

- envio com campo vazio;
- clique duplo durante loading;
- erro do processamento e retry;
- recarga após sucesso;
- navegação apenas por teclado;
- console sem erro bloqueante.

Só marque “passou” quando houver comportamento observável e evidência no código ou teste. Se alguma questão de produto impedir uma decisão correta, pare antes de inventar requisitos e reporte a pergunta exata.
