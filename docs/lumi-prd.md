# PRD atual — Lumi

**Status:** baseline de validação  
**Data da revisão:** 14 de setembro de 2026  
**Versão:** 0.1  
**Fonte disponível:** o checkout contém apenas `.replit`; não há implementação, especificação anterior ou workflow para confrontar este documento.

> Este é o contrato mínimo para o vertical slice, não uma afirmação sobre funcionalidades de negócio que não foram fornecidas. Os pontos marcados como hipótese precisam ser confirmados pelo responsável pelo produto antes de ampliar o escopo.

## 1. Objetivo

Permitir que uma pessoa entre no Lumi, execute a ação principal do produto com uma entrada válida e veja um resultado útil, sem perder o estado ao recarregar a página. O slice deve tornar o primeiro valor do produto demonstrável de ponta a ponta.

O domínio específico da entrada e do resultado ainda não está documentado. Por isso, o slice usa os termos neutros **entrada**, **processamento** e **resultado** até que o produto confirme seus nomes e regras.

## 2. Usuário e problema

- **Usuário primário:** uma pessoa que acessa o Lumi pela primeira vez.
- **Problema:** ainda não há um caminho comprovável entre abrir o produto e obter seu primeiro resultado.
- **Resultado esperado:** o usuário entende o que fazer, fornece uma entrada, recebe feedback de processamento e consegue recuperar o resultado.

## 3. Escopo do vertical slice

### Incluído

1. Inicialização e carregamento da tela de entrada.
2. Ação principal claramente identificada.
3. Coleta de uma entrada mínima.
4. Validação da entrada antes do processamento.
5. Estado de carregamento e prevenção de submissão duplicada.
6. Apresentação de resultado de sucesso.
7. Persistência mínima do resultado ou estado necessário para recuperá-lo.
8. Estados de erro, vazio e indisponibilidade.
9. Navegação por teclado e rótulos acessíveis nos controles principais.

### Fora do escopo desta versão

- Login, equipes, permissões e administração.
- Pagamentos, planos e limites comerciais.
- Integrações externas não necessárias para o primeiro resultado.
- Notificações, colaboração em tempo real e compartilhamento.
- Analytics de negócio e otimização de conversão.
- Refinamento visual além do necessário para compreensão e uso do fluxo.

## 4. Requisitos funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF-01 | O app deve abrir em uma tela de entrada sem erro bloqueante. | P0 |
| RF-02 | A tela deve comunicar o que o Lumi faz e qual é a próxima ação. | P0 |
| RF-03 | O usuário deve conseguir preencher a entrada principal e enviar uma vez. | P0 |
| RF-04 | Entradas vazias ou inválidas devem ser rejeitadas com mensagem próxima ao campo. | P0 |
| RF-05 | Durante o processamento, o usuário deve ver estado de carregamento e não criar submissões duplicadas. | P0 |
| RF-06 | Uma execução válida deve produzir um resultado identificável, com opção de iniciar novamente. | P0 |
| RF-07 | O resultado deve sobreviver a um recarregamento ou a uma reabertura do estado suportado pelo slice. | P1 |
| RF-08 | Falhas de processamento devem ser comunicadas e permitir tentar novamente sem estado corrompido. | P0 |
| RF-09 | Os controles essenciais devem ser utilizáveis por teclado e ter nome acessível. | P1 |

## 5. Critérios de aceite

Os critérios abaixo são a referência da validação. “Evidência” significa comportamento reproduzível no preview ou teste automatizado e o caminho do código que o sustenta.

### CA-01 — Entrada e orientação

**Dado** que uma pessoa acessa a rota inicial  
**Quando** a tela termina de carregar  
**Então** ela vê uma descrição do Lumi, o campo de entrada principal e uma ação primária com nome compreensível  
**E** não há erro de runtime no console.

### CA-02 — Entrada válida

**Dado** que o campo contém uma entrada válida  
**Quando** a pessoa aciona a ação primária  
**Então** a ação é aceita uma única vez  
**E** o processamento fica visível  
**E** a interface não permite submissões concorrentes do mesmo pedido.

### CA-03 — Validação local

**Dado** que o campo está vazio ou contém formato inválido  
**Quando** a pessoa tenta continuar  
**Então** o processamento não é iniciado  
**E** aparece uma mensagem acionável associada ao campo  
**E** a pessoa consegue corrigir o valor sem recarregar a página.

### CA-04 — Resultado

**Dado** que o processamento termina com sucesso  
**Quando** o resultado é entregue  
**Então** ele aparece em uma área identificável  
**E** a pessoa consegue distinguir o resultado da entrada original  
**E** existe uma ação para executar o fluxo novamente.

### CA-05 — Falha recuperável

**Dado** que o processamento falha ou fica indisponível  
**Quando** a falha é detectada  
**Então** a interface informa que não concluiu a operação sem expor detalhes sensíveis  
**E** oferece nova tentativa  
**E** não apresenta um resultado parcial como se fosse sucesso.

### CA-06 — Recuperação

**Dado** que existe um resultado concluído  
**Quando** a pessoa recarrega a página ou reabre o estado persistido suportado  
**Então** o resultado continua disponível ou a interface explica claramente que a sessão não foi persistida  
**E** nenhum dado de outro usuário é exibido.

### CA-07 — Acessibilidade mínima

**Dado** que a pessoa usa apenas teclado ou tecnologia assistiva  
**Quando** percorre e executa o fluxo principal  
**Então** consegue identificar foco, preencher o campo, enviar, ler estados e alcançar o resultado  
**E** os controles têm nome acessível.

## 6. Contrato observável para a implementação

Para que uma futura auditoria seja objetiva, cada requisito deve apontar para pelo menos uma evidência:

- rota ou ponto de entrada da tela;
- componente que renderiza cada estado;
- handler ou endpoint que executa o processamento;
- mecanismo de persistência e sua fronteira de usuário;
- teste automatizado ou roteiro manual reproduzível;
- comportamento esperado para sucesso, validação e falha.

Não é suficiente existir um botão estático ou um mock visual: o critério exige a transição de estado correspondente.

## 7. Requisitos não funcionais

- Erros de usuário devem ser recuperáveis sem recarregar a página.
- A aplicação não deve expor segredo, stack trace ou dados de sessão na interface.
- Estados de carregamento não devem deixar o usuário sem indicação do que fazer.
- O fluxo deve funcionar no viewport de preview do Replit e em tela estreita.
- A persistência deve ser isolada por usuário quando autenticação existir; enquanto não houver autenticação, o produto deve declarar se o estado é apenas local e temporário.

## 8. Questões de produto em aberto

Estas respostas são necessárias antes de considerar o PRD fechado:

1. Qual é o domínio real da entrada e do resultado do Lumi?
2. Qual é o nome da rota inicial e da ação primária?
3. O processamento é local, por API própria ou por uma integração?
4. O resultado deve ser persistido entre sessões? Por quanto tempo?
5. O Lumi terá autenticação no primeiro slice?
6. Qual mensagem e qual comportamento são esperados quando o serviço estiver indisponível?
7. Existe conteúdo de marca, tom de voz ou referência visual aprovada?

## 9. Definição de pronto do slice

O vertical slice só pode ser considerado pronto quando CA-01 a CA-07 tiverem evidência no código e no comportamento, sem marcar como “passou” um critério que não pôde ser executado.
