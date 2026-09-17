---
name: Auditoria do vertical slice
description: Regra para revisar requisitos quando o repositório não contém uma implementação executável.
---

Uma auditoria de aderência deve separar evidência ausente de comportamento incorreto: use “não observado/bloqueado” quando não houver código, runtime ou teste; reserve “falhou” para um comportamento executado que diverge do critério.

**Why:** sem essa distinção, um repositório vazio pode ser aprovado por falta de evidência ou reportado como um bug reproduzido, confundindo a próxima etapa de implementação.

**How to apply:** antes de preencher uma matriz de aceite, confirme arquivos rastreados, ponto de entrada, workflow e testes. Registre a fonte consultada e a evidência necessária para reabrir a validação.