# Caju e a Biblioteca

Jogo de cuidados em português do Brasil, inspirado no Pou e no bibliotecário Carlos Henrique Juvêncio. O retrato ilustrado do Caju foi criado a partir das fotos de Carlos fornecidas no pedido. Feito com HTML, CSS e JavaScript nativos, sem backend, pacotes de execução, rastreamento ou contas.

## Rodar e instalar

```sh
npm start
# ou: python3 -m http.server 3000 --bind 0.0.0.0
```

Abra pelo servidor HTTP na porta 3000. Não abra o projeto modular via `file://`. Python 3 é suficiente para executar; Node 18+ é usado somente pelos testes e pelo atalho `npm start`.

No site HTTPS (GitHub Pages), use **Opções → Instalar / adicionar à tela**. No Android/Chrome, o menu do navegador também oferece Adicionar à tela inicial; no iPhone/Safari, use Compartilhar → Adicionar à Tela de Início. O oferecimento da instalação depende do navegador. `manifest.webmanifest` define nome, ícones e início.

O service worker `sw.js` guarda todo o aplicativo, retrato e imagens dos pets. Depois de um carregamento online completo, o jogo pode ser reaberto offline. Espere o primeiro cache terminar antes de desconectar. Ao publicar alterações, incremente `VERSION` em `sw.js`: o novo worker substitui o cache do aplicativo. Reabra/recarregue o jogo para usar a versão atualizada. Gravação de voz exige HTTPS ou localhost e depende do suporte do aparelho.

## Cuidados e vida na biblioteca

- Cinco barras: saciedade (rotulada Fome), higiene, energia, diversão e saúde.
- Café, pão de queijo, polvilho, maçã, bolo de rolo, Cookie Decimal e chá gratuito que recupera a saúde. Comida tem mastigação e partículas; bebidas têm animação de gole.
- Banho: arraste o sabão sobre o Caju com mouse/dedo ou use **Esfregar sabão** por teclado. Somente completar a barra recupera a higiene e conta o ritual.
- Dormir fecha os olhos, anima a respiração e recupera energia. A tela escurece. Acordar reverte o estado.
- Luz de manhã, tarde e noite acompanha o horário **local do aparelho**. O Caju lembra a hora do lanche e do descanso. Não forçamos seu sono.
- Ausência reduz necessidades por no máximo quatro horas; o Caju não morre. Bagunça usa até sete dias de ausência. Pilhas e anotações podem aparecer com o tempo.
- **Arrumar biblioteca** organiza pilhas gratuitamente. A borracha da loja apaga as anotações. Os traços grisalhos surgem ao longo de semanas; cuidados suavizam o envelhecimento, e o elixir reverte quatro semanas visuais. Não há morte por idade.
- Tutorial inicial, modo escuro, letras maiores, vibração quando suportada, transições e preferência por movimento reduzido.

## Voz local, sons e música

Em **Voz do Caju**, toque **Gravar minha voz**. Só esse gesto solicita permissão de microfone. O indicador vermelho fica visível na gravação, que dura até oito segundos. **Parar e repetir** encerra a captura e reproduz uma versão aguda, com boca animada na prévia. A Web Audio API usa `playbackRate = 1.45`: isso sobe o tom e também acelera a fala, sem processamento por servidor.

**Apagar gravação** remove a última gravação da memória. **Desligar microfone totalmente** interrompe captura e reprodução e desativa o recurso; para reativar, marque Voz ativada. Fechar o diálogo, mudar de aplicativo ou sair da página também encerra as tracks do microfone. Permissões já concedidas pelo navegador podem ser revogadas nas configurações do próprio navegador.

A gravação fica **apenas na memória do aparelho**, não é enviada, não vai para o localStorage nem para o backup e desaparece ao recarregar. Não usamos SpeechRecognition, pois alguns navegadores dependem de serviços remotos. Se MediaRecorder/getUserMedia/decodificação não funcionarem, aparece uma mensagem e o restante do jogo continua.

**Opções** tem volume ajustável e controles independentes para sons, música ambiente sintetizada e voz. O botão ♪ controla os sons de cuidados/jogos. Música e áudio dependem de interação para iniciar, conforme a política de autoplay. Música para quando a aba fica oculta. Silenciar os efeitos interrompe os efeitos em andamento.

## Pets e loja

- **Aurora, a coruja** fica na estante. Um petisco quando a saciedade está abaixo de 85 dá 12 moedas. O bônus não pode ser repetido continuamente com a barriga cheia.
- **Dewey, o gato** descansa nos livros; diversão baixa aumenta a bagunça e anima suas travessuras.
- **Traça das margens** come papel velho; com fome, aumenta as margens bagunçadas.
- Cada pet tem saciedade, diversão e energia, carinho e duas roupinhas próprias (laço/boina). Adoção usa moedas; petiscos e papel são comprados em **Loja → Suprimentos**.
- Roupas e acessórios vetoriais, penteados, cores de cabelo, óculos redondos/azuis, gorro e fantasias de pirata, astronauta, detetive e época vitoriana.
- Sazonais seguem as estações do hemisfério sul: verão dez–fev, outono mar–mai, inverno jun–ago, primavera set–nov.
- Uma de três peças raras rotaciona a cada semana, na segunda-feira local. Compras já feitas continuam utilizáveis após a oferta acabar.
- O guarda-roupa salva até oito combinações favoritas, com prévia, nome, botão Vestir e exclusão.

## Missões, diário e coleção

Três missões diárias: ler três resumos, alimentar duas vezes e vencer uma partida. Cada recompensa precisa ser recebida na tela de Missões e dá 30 moedas + 1 marcador. Os rituais de alimentação/banho/jogo continuam rendendo seu marcador diário.

Medalhas novas: **Primeiro empréstimo** (primeiro acerto literário), **Cem páginas lidas** (100 respostas certas, incluindo releituras) e **Anotação perfeita** (quatro palavras corretas no jogo da margem). Cada medalha rende um marcador, uma única vez.

Três temas alternam no calendário mensal: Semana do Livro (jan/abr/jul/out), Noite de Biblioteca (fev/mai/ago/nov) e Festival da Classificação Decimal (mar/jun/set/dez). Completar os rituais do dia permite receber uma decoração e dois marcadores, uma vez por mês. As luzinhas da Noite de Biblioteca iluminam as estantes quando equipadas.

O diário guarda as últimas **30 entradas**, com data, e mostra a nota mais recente na sala. Na **Minha estante**, acertos revelam capa tipográfica, palavra e data; livros desconhecidos ficam bloqueados. Selos acompanham os grupos literários e ficam completos quando todas as obras do grupo forem descobertas.

## Nove minigames

Cada um tem instruções, pontuação, resultado, reação do Caju e recompensas:

1. **Um livro. Uma palavra.**: 30 livros; cinco por rodada; justificativas e sequência de acertos. Rodadas finais usam alternativas mais próximas em algumas obras.
2. **Organize a estante**: oito livros, arrastar ou tocar nas classes 000, 100 e 200.
3. **Anotação na margem**: quatro palavras, 20 segundos, erros reduzem o tempo.
4. **Memória de capas**: seis pares; poucas tentativas rendem marcador.
5. **Labirinto da biblioteca**: teclado ou botões; passos e colisões contam.
6. **Corrida do carrinho**: três corredores, livros e obstáculos, 20 segundos; teclado ou botões.
7. **Pesca de letras**: seis rodadas de quatro segundos no lago de tinta.
8. **Páginas rasgadas**: seis fragmentos para reordenar por troca de pares, em até 60 segundos.
9. **Ritmo do carimbo**: oito batidas, janela de 220 ms; botão ou espaço. Pista visual funciona com som desligado.

Fechar uma partida cancela timers, animações e listeners, sem conceder a recompensa final.

## Jogadores e saves separados

Na primeira abertura de uma aba, escolha um jogador ou crie um perfil com nome/apelido. O botão com o nome no cabeçalho permite trocar de jogador e renomear o perfil atual. É possível guardar até dez perfis neste navegador.

Cada perfil tem moedas, roupas, pets, diário, coleção, missões, preferências e progresso próprios. Ao trocar, o jogo salva o jogador anterior, encerra minigames/cuidados e apaga a gravação temporária de voz, antes de carregar o novo. Cada aba mantém sua própria escolha em `sessionStorage`; abrir outro jogador em outra aba não redireciona os autosaves.

O save anterior é preservado como **Meu Caju**, sem apagar ou mover sua chave original. São perfis **locais, sem senha**: não são contas com autenticação e não há sincronização entre dispositivos. Qualquer pessoa com acesso a este navegador pode selecionar os perfis disponíveis. Para transferir seu progresso, exporte o backup do jogador escolhido e importe-o no perfil desejado do outro aparelho. Importar altera somente o jogador atual.

## Salvamento, exportação e importação

O perfil Meu Caju conserva a chave `caju-biblioteca-v1`. Novos jogadores usam `caju-biblioteca-v1:player:<id>`, e a lista de perfis usa `caju-biblioteca-v1:profiles`. Valores padrão são adicionados aos saves antigos para recursos novos. Tudo é guardado em `localStorage`, exceto gravações e processos de áudio. Sem sincronização automática: cada navegador/origem tem seu progresso.

Em **Opções → Exportar progresso**, baixe `caju-NOME-progresso.txt`. **Importar progresso** valida formato e tamanho (até 2 MB), pede confirmação e substitui o estado. Faça um backup antes de limpar dados do navegador ou transferir de aparelho. Arquivos inválidos não substituem o save. Erros de armazenamento são informados; o jogo ainda pode continuar na memória. O relógio local pode alterar eventos e progressão: não há validação por servidor nem proteção competitiva contra edição de saves.

## Organização dos arquivos

- `index.html`, `style.css`: interface responsiva, sala CSS, tutorial, acessibilidade e temas.
- `js/app.js`: integração e eventos principais.
- `js/character.js`, `js/wardrobe.js`, `js/care.js`: personagem, roupas vetoriais, expressões e cuidados.
- `js/attributes.js`, `js/save.js`: passagem do tempo, limites, normalização e backup.
- `js/profiles.js`: cadastro, seleção e renomeação de jogadores, isolamento por chave e seleção por aba.
- `js/shop.js`, `js/catalog.js`: catálogo básico, suprimentos e disponibilidade por calendário.
- `js/pets.js`: regras de adoção, alimentação e roupas dos pets.
- `js/progression.js`: missões, medalhas, eventos, diário, coleção e idade.
- `js/features.js`: telas dos recursos novos e decoração dinâmica da sala.
- `js/minigames.js`, `js/extra-games.js`, `js/books.js`: nove jogos e base literária.
- `js/voice.js`: gravação local e reprodução aguda, com encerramento seguro do microfone.
- `js/sound.js`, `js/music.js`: efeitos e música Web Audio.
- `manifest.webmanifest`, `sw.js`, `assets/icon*`: instalação e cache offline.

## Trocar imagens e adicionar itens/livros

**Caju:** substitua `assets/carlos.png`. O objeto `characterImages` em `js/character.js` aceita imagens diferentes por estado; `null` reaproveita a base. As roupas e expressões usam coordenadas de uma imagem quadrada de **1254 × 1254**. Se mudar o enquadramento, ajuste `outfitArt()` e `expressionArt()` em `js/wardrobe.js`.

**Pets:** substitua `assets/pets/owl.svg`, `cat.svg`, `moth.svg`, ou altere `image` em `petCatalog` no arquivo `js/pets.js`. São placeholders vetoriais independentes, sem arquivos externos.

**Itens:** catálogo em `js/shop.js` e `js/catalog.js`; o campo `emoji` é o ícone de prévia. As peças vestidas usam `outfitArt()`; adicione o desenho para a nova peça. Decorações usam emojis sobre a sala. Regras `months` e `rotation` controlam ofertas por calendário. Atualize a lista `FILES` de `sw.js` para novos arquivos que precisem funcionar offline.

**Livros:** acrescente uma tupla em `js/books.js`:

```js
['Título', 'Autor', 'Sinopse original curta.', 'Palavra certa',
 ['Alternativa 1', 'Alternativa 2', 'Alternativa 3'],
 'Justificativa da interpretação.']
```

Use quatro opções únicas. `genreFor()` em `js/progression.js` define os grupos dos selos. As palavras são interpretações propostas, não leituras únicas. Sinopses são originais e capas tipográficas, sem reproduzir textos ou capas comerciais.

## Validação

```sh
npm test
# Com o servidor ativo, Python Playwright e Chromium disponíveis:
python3 tests/browser_smoke.py
python3 tests/care_browser.py
python3 tests/expansion_browser.py
python3 tests/compat_browser.py
python3 tests/profiles_browser.py
```

Os testes de navegador usam `/usr/bin/chromium`. A expansão verifica os quatro jogos novos, pets, favoritos, coleção, missões, importação/exportação, áudio real com dispositivo simulado e reabertura offline. Não precisa instalar Playwright para jogar.

## Simplificações

Pets são placeholders vetoriais; roupas são camadas SVG e decorações são símbolos. Envelhecimento é visual e reversível, não um sistema biológico. As novas corridas e pesca usam mecânica 2D simples, e páginas são reconstruídas por troca de fragmentos. Eventos são uma rotação mensal local, sem servidor. Voz aguda também acelera a fala; não há reconhecimento de palavras nem envio de áudio. Perfis locais não fornecem privacidade por senha ou saves na nuvem. A instalação PWA e recursos de áudio variam por navegador. A torre de livros com física não foi implementada; há nove outros minigames.
