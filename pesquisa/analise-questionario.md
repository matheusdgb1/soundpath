# Análise do questionário: caminhadas a pé

Esta é a análise das respostas ao formulário "SoundPath: pesquisa sobre caminhadas a pé", coletadas entre 06/11/2026 e 14/11/2026.

> **Privacidade:** este arquivo traz só números agregados. A planilha bruta **não** é versionada, porque o repositório é público. As respostas foram anônimas, e os comentários citados abaixo estão sem identificação.

---

## 1. Quem respondeu

| | Respostas |
|---|---|
| Total recebido | 23 |
| Sem resposta ao termo de consentimento (descartadas) | 2 |
| **Válidas** | **21** |
| Com menos de 60 anos | 12 |
| **Público-alvo (60 anos ou mais)** | **9**: 5 de 60 a 69, 3 de 70 a 79 e 1 de 80 ou mais |

**Cuidado na leitura:** mais da metade das respostas válidas (12 de 21) vem de pessoas **fora do público-alvo**. Por isso, as conclusões abaixo usam **só as 9 pessoas com 60 anos ou mais**. O total aparece só como comparação. Com 9 pessoas, os números indicam tendências e não têm valor estatístico.

**Problemas no formulário, para corrigir numa próxima rodada:**
- As perguntas "pode marcar mais de uma" chegaram com uma só resposta por pessoa. Pode ser a exportação ou a configuração do campo.
- Uma resposta veio com o título "Seção 4 – Ler, ouvir e sentir o celular na rua" colado no texto da opção.
- O formulário aceitou envio sem responder ao consentimento. Essa pergunta deveria ser obrigatória.

---

## 2. Resultados (pessoas de 60 anos ou mais, n = 9)

### Rotina e orientação

| Pergunta | Resultado |
|---|---|
| Sai a pé | 8 de 9 saem **todos os dias** ou **algumas vezes por semana** |
| Já ficou perdido(a) na rua | **9 de 9** (3 "muitas vezes") |
| Já deixou de ir a um lugar por não saber o caminho | **6 de 9** |
| Como descobre o caminho | 6 de 9 **perguntam a outra pessoa**, na rua ou antes de sair. Só 1 usa app de mapa |
| Maior preocupação na rua | **Atravessar a rua (4)** e **ser assaltado(a) (4)**. Depois, tropeçar (1) |

### Celular

| Pergunta | Resultado |
|---|---|
| Tem smartphone | 8 de 9. Os aparelhos são Android (8) ou "não sei" (1) |
| Como usa | 7 de 9 usam **sozinhos, mas com alguma dificuldade** |
| Onde leva o celular | bolso (4), bolsa (2), **não leva (3)** |
| Já usou app de mapa a pé | **nunca (4)**, com ajuda (4), sozinho (1) |
| Maior dificuldade com o mapa | **olhar a tela e a rua ao mesmo tempo (3)** e **entender o desenho do mapa (3)** |

### Ver, ouvir e sentir

| Pergunta | Resultado |
|---|---|
| Consegue ler a tela na rua | 5 com dificuldade, 1 não consegue e 2 sem dificuldade |
| Consegue ouvir o celular na rua | **4 com dificuldade e 2 não conseguem**, ou seja, 6 de 9 têm algum problema |
| Usa fone | **não usa (5)**, só em casa (3), na rua (1) |
| Percebe a vibração | sempre (3), às vezes (3), não sabe (2), quase nunca (1) |
| Usa aparelho auditivo | 2 de 9 |

### Sobre o SoundPath

| Pergunta | Resultado |
|---|---|
| Usaria um app assim | sim (3), **talvez (4)**, não sei (1), não (1) |
| Como prefere os avisos | **voz e vibração juntas (4)**, só voz (3), mapa na tela (1), não sei (1) |
| Como a voz deve explicar | **pontos de referência: 8 de 9.** Nome da rua: 1. Só a direção: 0 |
| Aviso mais importante | **quando virar (5)**, travessia (3), quanto falta (1) |
| O que atrapalharia | **barulho da rua (2)**, **não confiar nas orientações (2)**, **achar difícil aprender (2)**, bateria e internet (1), confundir avisos (1) |

Comentários abertos (anônimos):
- Participante de 70 a 79 anos: *"uma vez eu saí do mercado e não achava o caminho de volta para casa. Fiquei parado na esquina, com medo de atravessar e de me perder ainda mais. Se o aplicativo falar devagar e avisar antes de cada rua, com ponto de referência, já ajuda muito."*
- Dois comentários elogiaram a ideia ("Bela ideia…", "Que ideia legal!").

### Comparação com quem tem menos de 60 anos

O grupo de menos de 60 anos usa mais o Google Maps (8 de 12 já usaram sozinhos) e mais respondeu "usaria o app" (10 de 12). Entre as pessoas de 60 anos ou mais, só 3 de 9 disseram "sim". O público-alvo é **mais desconfiado e menos experiente**. Se a análise misturasse os dois grupos, o resultado pareceria mais otimista do que é.

---

## 3. O que a pesquisa confirma no protótipo

| Achado | Decisão que ele sustenta |
|---|---|
| 9 de 9 já se perderam e 6 de 9 deixaram de ir a algum lugar | O problema da Entrega 3 é real |
| Dificuldade de olhar a tela e a rua ao mesmo tempo, e de entender o desenho do mapa | A tela é secundária e não há mapa desenhado (RNF05) |
| 5 de 9 não usam fone | A voz sai pelo alto-falante e o fone não é obrigatório (RNF04) |
| Voz e vibração juntas é o canal preferido, depois só voz | O padrão é "os dois", com a opção de só voz (RF09) |
| O aviso mais importante é virar, depois a travessia | Direita, esquerda e travessia têm vibração própria (RNF02) |
| "Confundir um aviso com outro" aparece como barreira | O limite é de 4 padrões, e "saiu do caminho" usa só a voz |
| 7 de 9 usam o celular com dificuldade e 4 nunca usaram mapa | Linguagem simples (RNF01) e treino dos sinais antes de sair |

## 4. Problemas encontrados e o que mudou

| # | Problema | Evidência (60+) | Mudança no app |
|---|---|---|---|
| P1 | **A voz não usava pontos de referência.** Só dizia a direção e, às vezes, o nome da rua | 8 de 9 preferem referência. 6 de 9 aprendem o caminho perguntando a pessoas, que explicam assim | Viradas e travessias citam um lugar: *"Vire à direita agora, na esquina da padaria. É a Rua Ipê."* (`mobile/src/data/routes.ts`) |
| P2 | **Fala rápida demais para quem ouve mal na rua** | 6 de 9 têm dificuldade para ouvir, 2 usam aparelho auditivo, e o comentário pede "falar devagar" | A velocidade padrão da voz passa a ser **Devagar**. Quem quiser muda em Ajustes (`mobile/src/lib/store.tsx`) |
| P3 | **Falta de confiança nas orientações** | 2 de 9 citam "não confiar". Só 3 de 9 disseram que usariam o app | Os marcos de distância confirmam *"Você está no caminho certo"*. A rota da farmácia, que não tinha marco, ganhou um |
| P4 | Barulho da rua encobre a voz | 2 de 9 | Já tratado: voz e vibração juntas por padrão, toque para repetir. Sem mudança, mas vale observar no teste |
| P5 | Achar difícil aprender | 2 de 9, e 4 de 9 nunca usaram mapa | Já tratado: o treino dos 4 sinais aparece na tela inicial. Sem mudança |

### O que fica fora, e por quê

- **Avisos de assalto.** É a preocupação nº 1, empatada com a travessia (4 de 9), mas continua **fora do escopo** (Won't da Entrega 3). Não há dados confiáveis sobre isso, e o aviso poderia estigmatizar bairros. A apresentação deve mostrar que a equipe **viu** esse dado e decidiu de forma consciente.
- **Bateria e internet.** Não dá para avaliar num protótipo simulado. Fica como hipótese para um produto real (rota baixada antes de sair).
- **Quem não leva o celular** (3 de 9). Está fora do alcance de um app. É um limite do projeto.

## 5. Sugestões para o teste de usabilidade

- Perguntar se a pessoa entendeu melhor a frase **com** ponto de referência ou **sem**. A v1 (`index.html`) e a versão de antes desta mudança servem de comparação.
- Medir se a voz **devagar** incomoda quem ouve bem. Se incomodar, voltar o padrão para Normal e oferecer Devagar no primeiro uso.
- Observar se "Você está no caminho certo" aumenta a sensação de segurança ou se vira ruído.
