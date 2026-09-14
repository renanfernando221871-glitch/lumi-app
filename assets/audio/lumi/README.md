# Áudios locais da voz do Lumi

Insira nesta pasta os MP3s finais, gravados ou gerados previamente com uma voz
feminina adulta jovem, natural, gentil e expressiva em português do Brasil.

Arquivos preparados:

| Arquivo | Fala |
| --- | --- |
| `activity-01-find-bed.mp3` | “Onde está a cama?” |
| `activity-02-red-object.mp3` | “Qual objeto é vermelho?” |
| `activity-03-store-teddy.mp3` | “Vamos guardar o ursinho?” |
| `reward-you-did-it.mp3` | “Muito bem! Você conseguiu!” |

Depois de adicionar os arquivos, habilite as quatro chamadas `require()` em
`src/audio/lumiAudioAssets.ts`. O Metro incluirá os MP3s no app para reprodução
offline. Enquanto um arquivo estiver ausente ou desabilitado, o serviço usa o
TTS atual como fallback.

Recomendação de entrega: MP3 mono, 44.1 kHz, 128–192 kbps, sem música, ruído ou
silêncio longo no início e no fim.