# Lumi

Primeiro vertical slice do Lumi, um companheiro de aprendizagem acolhedor para crianças.

## Rodar no Replit

O preview web usa Expo e inicia na porta 5000:

```bash
npm run web
```

O mesmo projeto pode ser aberto no Expo Go para Android/iOS quando executado com `npm start`.

## Fluxo atual

Splash → apresentação do Lumi → personalização → mapa dos mundos → Casa do Lumi → três atividades → primeira conquista.

O progresso e o nome da criança são salvos localmente. As atividades são definidas em `src/data/activities.ts` e renderizadas pelo mesmo motor em `src/screens/ActivityScreen.tsx`.