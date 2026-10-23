# Caju e a Biblioteca

Jogo de cuidados em português do Brasil, inspirado no Pou e no bibliotecário Carlos Henrique Juvêncio. O personagem usa uma ilustração criada a partir das fotos de Carlos fornecidas no pedido. Não há backend, instalação de pacotes ou etapa de build.

## Rodar

É necessário Python 3. Na pasta do projeto:

```sh
npm start
# ou: python3 -m http.server 3000 --bind 0.0.0.0
```

Abra a porta 3000 no navegador pelo acesso oferecido pelo seu ambiente de desenvolvimento. Use um servidor HTTP; módulos JavaScript não funcionam corretamente abrindo o HTML via `file://`. Node 18+ é necessário apenas para `npm test`. O jogo em si usa HTML, CSS e JavaScript nativos. As fontes Google são opcionais e têm alternativas locais.

## Jogar

- As cinco barras mostram saciedade, higiene, energia, diversão e saúde.
- Alimentação inclui café, pão de queijo, polvilho, maçã, bolo de rolo, Cookie Decimal e chá gratuito que recupera toda a saúde.
- Alimentar fecha o menu para mostrar a boca abrindo e mastigando; bebidas têm animação de gole.
- No banho, arraste o sabão sobre o Caju com mouse ou toque. O botão Esfregar sabão também funciona por teclado. A higiene só é recuperada ao completar a barra; cancelar não concede a recompensa.
- Dormir fecha os olhos, escurece a sala e adiciona respiração suave, recuperando energia ao longo do tempo. O botão Dormir vira Acordar.
- O botão ♪ ativa sons diferentes para mastigar, beber, esfregar, enxaguar, dormir, acordar e fazer carinho. A preferência fica salva, e silenciar interrompe os sons em andamento.
- Cinco minigames: resumo literário (30 obras), classificação decimal, anotação cronometrada, memória de capas e labirinto com teclado/botões.
- Moedas vêm das partidas e de intervalos de dois minutos; marcadores vêm de resultados difíceis, conquistas e rituais diários. A primeira partida rende uma conquista.
- Compre itens na loja e equipe ou retire roupas, acessórios e decorações no guarda-roupa. Peças de um mesmo tipo substituem a anterior.
- Progresso salvo em `localStorage`, chave `caju-biblioteca-v1`. Ausência tem limite de quatro horas; o Caju não morre. O progresso pertence ao navegador e à origem usados, sem sincronização de contas. O jogo informa quando o salvamento não está disponível.

## Arquivos

- `index.html`, `style.css`: interface responsiva, sala ilustrada em CSS, acessibilidade e animações.
- `js/app.js`: eventos, interface e integração.
- `js/character.js`: imagens do Carlos, falas e estados visuais.
- `js/wardrobe.js`: roupas, acessórios e expressões em SVG, nas coordenadas do retrato original (1254 × 1254).
- `js/care.js`: alimentação animada e banho com Pointer Events (mouse e toque), com alternativa por teclado.
- `js/sound.js`: efeitos de áudio sintetizados com Web Audio, sem arquivos ou serviços externos.
- `js/attributes.js`: passagem do tempo, sono e rituais.
- `js/save.js`: normalização, persistência e recuperação de saves.
- `js/shop.js`: catálogo, efeitos e compras.
- `js/minigames.js`: instruções, partidas, resultados, recompensas e limpeza de timers.
- `js/books.js`: 30 livros, sinopses originais, alternativas e justificativas.
- `assets/carlos.png`: retrato ilustrado do Carlos baseado nas fotografias enviadas.
- `tests/`: testes da lógica; o teste de navegador usa Playwright/Python quando disponível.

## Trocar as imagens

Substitua `assets/carlos.png` por uma fotografia ou arte autorizada. Em `js/character.js`, o objeto `characterImages` permite definir uma imagem para cada estado; `null` reutiliza a imagem base com efeitos. O retrato usa uma máscara suave em CSS. Fotos originais enviadas no chat serviram de referência para a ilustração; não foram incorporadas como arquivos separados.

Itens usam o campo `emoji` em `js/shop.js` somente como ícone dos cartões. As peças vestidas são desenhadas por `outfitArt()` em `js/wardrobe.js`, no mesmo sistema de coordenadas da imagem. Ao substituir o retrato, ajuste também as coordenadas das peças e das expressões em `expressionArt()`. O palco permanece quadrado em todos os tamanhos de tela para evitar deslocamentos.

## Adicionar livros

Em `js/books.js`, acrescente uma tupla:

```js
['Título', 'Autor', 'Sinopse original curta.', 'Palavra certa',
 ['Alternativa 1', 'Alternativa 2', 'Alternativa 3'],
 'Justificativa da interpretação.']
```

Use quatro opções únicas. O jogo sorteia cinco obras por rodada e dá bônus por sequência. Nas rodadas finais, algumas obras têm alternativas semanticamente mais próximas no mapa `closeWords` em `minigames.js`. As palavras são uma interpretação proposta, não a única leitura possível da obra. A seleção inclui obras modernas; não se reproduzem seus textos ou capas comerciais.

## Validação

```sh
npm test
# Com o servidor ativo e Playwright Python instalado:
python3 tests/browser_smoke.py
python3 tests/care_browser.py
```

## Simplificações

Roupas e acessórios são desenhos vetoriais sobre o retrato; decorações e ícones dos cartões usam emojis. Expressões e mastigação são camadas vetoriais animadas, não reconstrução facial 3D. Estados usam a ilustração base, filtros, efeitos e balões. As capas são tipográficas e a física de torre não foi incluída: os cinco jogos entregues são os listados acima. Não há login, compras reais ou serviço remoto. Sons suaves são sintetizados localmente após ativação. Não há service worker: o progresso persiste fechado, mas o carregamento offline não é garantido.
