import { useState, useEffect } from 'react';

const PROTOCOLO_VERSION = 'v2';
const STORAGE_KEY = `protocolo-7d-${PROTOCOLO_VERSION}`;
const ACCESS_CODE = 'livre7d';
const ACCESS_CODE_PLUS = 'livre7d-plus';

const COLORS = {
  terracota: '#C66B47',
  terracotaLight: '#F5E1D4',
  terracotaDeep: '#A1543A',
  salva: '#8B9D83',
  salvaLight: '#E5EBE2',
  salvaDeep: '#6F7E68',
  ocre: '#C9A66B',
  ocreLight: '#EBDBC0',
  ocreDeep: '#A88A4F',
  areia: '#E8DDD0',
  areiaSoft: '#F2EBE0',
  areiaDeep: '#D4C5B2',
  carvao: '#2B2A28',
  carvaoSoft: '#4A4845',
  carvaoMuted: '#6B6864',
  creme: '#FAF6F1',
  cremePuro: '#FFFFFF',
};

// =============================================================
// DADOS — ESTRUTURA DOS 7 DIAS
// =============================================================
const DAYS_STRUCTURE = {
  0: { label: 'Avaliação inicial', title: 'Seu ponto de partida', relogio: null },
  1: {
    label: 'Dia 1', title: 'Reset Metabólico Matinal', relogio: 'corpo', color: 'terracota',
    checklists: [
      { id: 'agua', text: 'Beba 1 copo grande de água (300–500 ml)', detail: 'Antes do café. Antes do celular.' },
      { id: 'luz', text: 'Receba luz natural por pelo menos 5 min', detail: 'Janela aberta, varanda, ou um passo na rua.' },
      { id: 'proteina', text: 'Coma 20 g de proteína no café da manhã', detail: 'A proteína vem primeiro — sempre.' },
      { id: 'cafe', text: 'Tome café somente depois de comer', detail: 'Nunca em estômago vazio.' },
      { id: 'celular', text: 'Adie o celular pelos primeiros 30 minutos', detail: 'Sem redes, e-mail ou notícias.' },
    ],
    scoreFields: [
      { id: 'energia_acordar', label: 'Energia ao acordar' },
      { id: 'energia_meio_dia', label: 'Energia ao meio-dia' },
      { id: 'fome_real', label: 'Fome real antes do almoço' },
      { id: 'clareza', label: 'Clareza mental' },
      { id: 'humor', label: 'Estabilidade de humor' },
    ],
  },
  2: {
    label: 'Dia 2', title: 'Reforço do Reset Matinal', relogio: 'corpo', color: 'terracota',
    checklists: [
      { id: 'agua', text: 'Beba 1 copo grande de água (300–500 ml)' },
      { id: 'luz', text: 'Receba luz natural por pelo menos 5 min' },
      { id: 'proteina', text: 'Coma 20 g de proteína no café da manhã' },
      { id: 'cafe', text: 'Tome café somente depois de comer' },
      { id: 'celular', text: 'Adie o celular pelos primeiros 30 minutos' },
    ],
    scoreFields: [
      { id: 'energia_acordar', label: 'Energia ao acordar' },
      { id: 'energia_meio_dia', label: 'Energia ao meio-dia' },
      { id: 'fome_real', label: 'Fome real antes do almoço' },
      { id: 'clareza', label: 'Clareza mental' },
      { id: 'humor', label: 'Estabilidade de humor' },
    ],
  },
  3: {
    label: 'Dia 3', title: 'Estratégia Anti-Queda 15h', relogio: 'metabolismo', color: 'salva',
    checklists: [
      { id: 'manha', text: 'Manter o Reset Matinal de ontem', detail: 'Os ajustes são cumulativos.' },
      { id: 'proteina_almoco', text: 'Proteína primeiro no almoço (25–30 g)', detail: 'Ordem importa: proteína, fibra, carboidrato.' },
      { id: 'fibras', text: 'Vegetais ou folhas no almoço', detail: 'Metade do prato.' },
      { id: 'lanche', text: 'Lanche estratégico entre 14h–16h', detail: 'Proteína + gordura boa, pouco açúcar.' },
      { id: 'cafe_limite', text: 'Máximo 2 cafés, último até 14h', detail: 'Preserva o sono profundo da noite.' },
    ],
    scoreFields: [
      { id: 'energia_acordar', label: 'Energia ao acordar' },
      { id: 'energia_tarde', label: 'Energia à tarde (15h–17h)' },
      { id: 'compulsao', label: 'Compulsão por doce' },
      { id: 'foco_tarde', label: 'Foco no fim da tarde' },
      { id: 'humor', label: 'Estabilidade de humor' },
    ],
  },
  4: {
    label: 'Dia 4', title: 'Reforço da Estabilidade', relogio: 'metabolismo', color: 'salva',
    checklists: [
      { id: 'manha', text: 'Manter o Reset Matinal' },
      { id: 'proteina_almoco', text: 'Proteína primeiro no almoço (25–30 g)' },
      { id: 'fibras', text: 'Vegetais ou folhas no almoço' },
      { id: 'lanche', text: 'Lanche estratégico entre 14h–16h' },
      { id: 'cafe_limite', text: 'Máximo 2 cafés, último até 14h' },
    ],
    scoreFields: [
      { id: 'energia_acordar', label: 'Energia ao acordar' },
      { id: 'energia_tarde', label: 'Energia à tarde' },
      { id: 'compulsao', label: 'Compulsão por doce' },
      { id: 'foco_tarde', label: 'Foco no fim da tarde' },
      { id: 'humor', label: 'Estabilidade de humor' },
    ],
  },
  5: {
    label: 'Dia 5', title: 'Protocolo 3 Prioridades', relogio: 'mente', color: 'ocre',
    checklists: [
      { id: 'manha', text: 'Manter o Reset Matinal' },
      { id: 'tarde', text: 'Manter a Estratégia Anti-Queda' },
      { id: 'prioridades', text: 'Definir 3 prioridades reais para amanhã', detail: 'Não 5. Não 7. Três.' },
      { id: 'micro_decisoes', text: 'Eliminar 3 micro-decisões da manhã', detail: 'Roupa, café e agenda decididos hoje à noite.' },
      { id: 'celular_quarto', text: 'Celular fora do quarto', detail: 'Compre um despertador se precisar.' },
    ],
    scoreFields: [
      { id: 'energia_mental', label: 'Energia mental ao acordar' },
      { id: 'foco', label: 'Foco durante o dia' },
      { id: 'fim_produtivo', label: 'Sensação de fim de dia produtivo' },
      { id: 'sobrecarga', label: 'Ansiedade ou sobrecarga (10 = nenhuma)' },
    ],
  },
  6: { label: 'Dia 6', title: 'Ajuste fino — calibragem', relogio: null, isCalibration: true },
  7: { label: 'Dia 7', title: 'Reavaliação e integração', relogio: null, isFinal: true },
};

const SCORE_FIELDS_INITIAL = [
  { id: 'energia_acordar', label: 'Energia ao acordar' },
  { id: 'energia_manha', label: 'Energia no meio da manhã' },
  { id: 'energia_tarde', label: 'Energia à tarde (15h–17h)' },
  { id: 'energia_noite', label: 'Energia à noite' },
  { id: 'clareza', label: 'Clareza mental e foco' },
  { id: 'sono', label: 'Qualidade do sono' },
  { id: 'humor', label: 'Estabilidade de humor' },
  { id: 'compulsao', label: 'Vontade de doce / compulsão' },
];

// =============================================================
// DADOS — 12 PROTOCOLOS SOS (PLUS)
// =============================================================
const PROTOCOLOS_SOS = [
  {
    id: 1, relogio: 'metabolismo', titulo: 'A queda das 15h',
    sintomas_busca: 'Bateu sono e vontade de doce depois do almoço',
    o_que_acontece: 'Depois do almoço, sua glicemia subiu rápido e desceu rápido demais. Seu cérebro lê essa queda como emergência energética e pede açúcar imediato.',
    sinais: ['Sonolência forte entre 14h e 16h', 'Vontade súbita de doce ou café com açúcar', 'Irritação que aparece "do nada"', 'Vontade de deitar mesmo tendo dormido bem'],
    etapas: [
      { tempo: 180, label: '0–3 min', verbo: 'Hidratar', acao: '1 copo grande de água (300–500 ml)' },
      { tempo: 120, label: '3–5 min', verbo: 'Comer', acao: '10–15 amêndoas, castanhas ou nozes' },
      { tempo: 300, label: '5–10 min', verbo: 'Mover', acao: '5 minutos de luz natural ou caminhada leve' },
    ],
    por_que: [
      { titulo: 'Estabiliza glicose', texto: 'A gordura boa das oleaginosas frena a montanha-russa.' },
      { titulo: 'Reativa o cérebro', texto: 'A hidratação restaura funções neurais que caem com desidratação leve.' },
      { titulo: 'Bloqueia o sono', texto: 'A luz natural avisa o cérebro: "ainda é dia".' },
    ],
    voce_sabia: 'A "queda das 15h" não acontece com quem come proteína suficiente no almoço. Esse protocolo é resgate — a estrutura preventiva está no Manual.',
  },
  {
    id: 2, relogio: 'corpo', titulo: 'Acordar exausta',
    sintomas_busca: 'Acordei sem energia, mesmo dormindo bem',
    o_que_acontece: 'Seu cortisol da manhã não fez a curva certa. O corpo despertou no horário, mas o sinal químico de "é dia" chegou fraco — geralmente por sono fragmentado, escuridão prolongada ou estresse acumulado.',
    sinais: ['Sensação de "ressaca" mesmo sem ter bebido', 'Demora 1–2 horas pra "engatar" o dia', 'Acordou várias vezes durante a noite', 'Mesmo dormindo 8 horas, não se sente descansada'],
    etapas: [
      { tempo: 300, label: '0–5 min', verbo: 'Iluminar', acao: '5 min de luz natural — janela aberta ou um passo na rua' },
      { tempo: 120, label: '5–7 min', verbo: 'Hidratar', acao: '1 copo grande de água em temperatura ambiente' },
      { tempo: 180, label: '7–10 min', verbo: 'Respirar', acao: '3 ciclos de 4-7-8 (inspira 4, segura 7, solta 8)' },
    ],
    por_que: [
      { titulo: 'Ancora o ritmo', texto: 'A luz natural é o sinal mais forte que regula cortisol e energia.' },
      { titulo: 'Sai do jejum', texto: 'A hidratação reativa o metabolismo após 7-8h sem beber.' },
      { titulo: 'Acalma o sistema', texto: 'A respiração 4-7-8 tira o corpo do alerta noturno residual.' },
    ],
    voce_sabia: 'A luz natural recebida nos primeiros minutos do dia tem efeito mais profundo sobre o seu sono dessa noite do que qualquer chá relaxante.',
  },
  {
    id: 3, relogio: 'metabolismo', titulo: 'TPM e exaustão',
    sintomas_busca: 'Estou em fase de TPM e exausta',
    o_que_acontece: 'Na fase pré-menstrual, a queda da progesterona aumenta a inflamação leve no corpo e a demanda energética. Você não está exagerando — sua biologia está em alta demanda.',
    sinais: ['Cansaço que não cede com café', 'Vontade incontrolável de chocolate ou comida calórica', 'Irritação fora do comum', 'Sono pesado mas não restaurador'],
    etapas: [
      { tempo: 300, label: '0–5 min', verbo: 'Nutrir', acao: 'Lanche com proteína + gordura (ovo + abacate, ou iogurte com castanhas)' },
      { tempo: 180, label: '5–8 min', verbo: 'Acalmar', acao: '1 chá morno de camomila, erva-cidreira ou melissa' },
      { tempo: 120, label: '8–10 min', verbo: 'Respirar', acao: '2 minutos parada, sem celular, só respirando' },
    ],
    por_que: [
      { titulo: 'Estabiliza humor', texto: 'Proteína + gordura equilibram glicose e neurotransmissores juntos.' },
      { titulo: 'Reduz cortisol', texto: 'O chá morno e quente ativa o sistema parassimpático rapidamente.' },
      { titulo: 'Quebra o ciclo', texto: 'A pausa interrompe o "preciso resolver tudo agora" que aumenta cortisol.' },
    ],
    voce_sabia: 'Alimentos ricos em magnésio — amêndoas, espinafre, abóbora, banana, cacau — são especialmente úteis nessa fase.',
  },
  {
    id: 4, relogio: 'mente', titulo: 'Estresse agudo',
    sintomas_busca: 'Algo me estressou agora e eu travei',
    o_que_acontece: 'O pico de adrenalina e cortisol coloca seu corpo em modo "ataque ou fuga". Pensar fica impossível porque o corpo está se defendendo. Não é fraqueza — é fisiologia básica.',
    sinais: ['Coração acelerado ou respiração curta', 'Mãos geladas ou suando', 'Sensação de "branco" mental', 'Vontade de chorar ou de gritar'],
    etapas: [
      { tempo: 240, label: '0–4 min', verbo: 'Respirar', acao: '4 ciclos de 4-7-8 (sentada, ombros relaxados)' },
      { tempo: 60, label: '4–5 min', verbo: 'Resfriar', acao: 'Água gelada no rosto ou pulsos por 30 segundos' },
      { tempo: 300, label: '5–10 min', verbo: 'Caminhar', acao: '3 minutos em silêncio, mesmo dentro de casa' },
    ],
    por_que: [
      { titulo: 'Ativa o nervo vago', texto: 'A expiração longa desliga o modo de defesa do sistema nervoso.' },
      { titulo: 'Reflexo de mergulho', texto: 'O frio reduz frequência cardíaca em segundos.' },
      { titulo: 'Dissipa adrenalina', texto: 'O movimento metaboliza adrenalina parada que vira ansiedade.' },
    ],
    voce_sabia: 'O nervo vago responde mais rápido a expirações longas do que a inspirações profundas. Solte o ar devagar.',
  },
  {
    id: 5, relogio: 'corpo', titulo: 'Não consigo dormir',
    sintomas_busca: 'Não consigo dormir, mente acelerada',
    o_que_acontece: 'Sua melatonina não está sendo liberada. As causas mais comuns: luz de tela próxima da hora de dormir, jantar tardio, ou cortisol elevado por estresse acumulado.',
    sinais: ['Corpo cansado mas mente acelerada', 'Pensamentos circulares que não param', 'Acordou de madrugada e não consegue voltar', 'Coração ainda batendo "rápido" mesmo deitada'],
    etapas: [
      { tempo: 60, label: '0–1 min', verbo: 'Apagar', acao: 'Todas as luzes fortes — só luz quente e baixa' },
      { tempo: 240, label: '1–5 min', verbo: 'Beber', acao: '1 chá morno de camomila, melissa ou passiflora' },
      { tempo: 300, label: '5–10 min', verbo: 'Alongar', acao: '5 min no chão — pescoço, ombros e quadril' },
    ],
    por_que: [
      { titulo: 'Libera melatonina', texto: 'A escuridão real é o sinal mais potente para o hormônio do sono.' },
      { titulo: 'Acalma a mente', texto: 'Plantas calmantes têm efeito ansiolítico suave bem documentado.' },
      { titulo: 'Solta o corpo', texto: 'Músculo tenso mantém mente acelerada — um afrouxa o outro.' },
    ],
    voce_sabia: 'Uma hora antes de dormir sem telas faz mais pelo seu sono do que qualquer suplemento.',
  },
  {
    id: 6, relogio: 'mente', titulo: 'Fome emocional',
    sintomas_busca: 'Estou comendo por ansiedade, não por fome',
    o_que_acontece: 'Seu cérebro está confundindo estresse, ansiedade ou tédio com fome real. Sob pressão, ele busca dopamina rápida — açúcar ou ultraprocessado.',
    sinais: ['Vontade súbita de algo específico (geralmente doce)', 'Comeu há menos de 2h e já quer comer de novo', 'A "fome" surgiu logo após algo emocional', 'Vontade aumenta quando você se distrai com tela'],
    etapas: [
      { tempo: 120, label: '0–2 min', verbo: 'Beber', acao: '1 copo grande de água + 5 respirações profundas' },
      { tempo: 180, label: '2–5 min', verbo: 'Pausar', acao: '3 minutos sem celular, sem distração' },
      { tempo: 300, label: '5–10 min', verbo: 'Avaliar', acao: 'Se persistir: lanche real com proteína e fibra' },
    ],
    por_que: [
      { titulo: 'Tira a falsa fome', texto: 'Boa parte do que se confunde com fome é, na verdade, sede leve.' },
      { titulo: 'Quebra o automático', texto: 'A pausa interrompe o ciclo antes que ele se complete.' },
      { titulo: 'Saciedade real', texto: 'Proteína sacia por horas; açúcar gera nova fome em uma hora.' },
    ],
    voce_sabia: 'Fome real cresce gradualmente. Fome emocional aparece de uma hora pra outra, geralmente com nome ("quero chocolate").',
  },
  {
    id: 7, relogio: 'mente', titulo: 'Névoa mental',
    sintomas_busca: 'Minha cabeça está num nevoeiro, não consigo focar',
    o_que_acontece: 'Inflamação leve, desidratação ou má qualidade de sono reduzem a oxigenação cerebral. Pensar fica lento. Não é preguiça mental — é falta de combustível.',
    sinais: ['Lentidão pra encontrar palavras simples', 'Releitura constante do mesmo parágrafo', 'Esquecimento de coisas que você sabe', 'Sensação de cabeça "pesada" ou "borrada"'],
    etapas: [
      { tempo: 120, label: '0–2 min', verbo: 'Hidratar', acao: '2 copos de água com uma pitada de sal de qualidade' },
      { tempo: 300, label: '2–7 min', verbo: 'Respirar', acao: '5 minutos de respiração nasal profunda' },
      { tempo: 180, label: '7–10 min', verbo: 'Mover', acao: 'Caminhada curta ao ar livre — mesmo 3 minutos' },
    ],
    por_que: [
      { titulo: 'Reativa neurônios', texto: 'Eletrólitos (sal + água) restauram a função neural rapidamente.' },
      { titulo: 'Oxigena o cérebro', texto: 'A respiração nasal aumenta óxido nítrico e fluxo cerebral.' },
      { titulo: 'Libera endorfina', texto: 'O movimento ao ar livre eleva oxigenação e clareia em minutos.' },
    ],
    voce_sabia: 'Apenas 2% de desidratação já reduz o desempenho cognitivo. Antes de pensar que é falta de café, beba água.',
  },
  {
    id: 8, relogio: 'mente', titulo: 'Ansiedade noturna',
    sintomas_busca: 'Ansiedade no fim do dia me impede de desligar',
    o_que_acontece: 'À noite, o cérebro processa o dia. Quando o cortisol está elevado e a mente acelerada, esse processamento natural vira ruminação.',
    sinais: ['Pensamentos repetitivos sobre o que precisa fazer', 'Volta a problemas do trabalho ou família', 'Antecipa cenários ruins do dia seguinte', 'Sente o coração acelerado deitada'],
    etapas: [
      { tempo: 240, label: '0–4 min', verbo: 'Despejar', acao: 'Escreva 3 preocupações que estão na sua cabeça' },
      { tempo: 120, label: '4–6 min', verbo: 'Decidir', acao: 'Para cada uma, uma única ação que fará amanhã' },
      { tempo: 240, label: '6–10 min', verbo: 'Desacelerar', acao: '4 ciclos de 4-7-8 + chá de melissa' },
    ],
    por_que: [
      { titulo: 'Externaliza loops', texto: 'Pensamentos param de "girar" quando o papel está segurando.' },
      { titulo: 'Desativa ruminação', texto: 'Definir uma ação dá ao cérebro permissão de soltar.' },
      { titulo: 'Prepara o sono', texto: 'A respiração com expiração longa ativa o parassimpático.' },
    ],
    voce_sabia: 'Anotar preocupações antes de dormir é uma das intervenções de sono mais bem documentadas.',
  },
  {
    id: 9, relogio: 'corpo', titulo: 'Viagem ou rotina quebrada',
    sintomas_busca: 'Estou em viagem, minha rotina foi pro espaço',
    o_que_acontece: 'Mudança de fuso, mudança de horários de comida, dias com filho doente, finais de semana caóticos — tudo isso desorganiza seu relógio biológico.',
    sinais: ['Fome em horários estranhos', 'Sono que vem cedo demais ou tarde demais', 'Energia oscilando do nada', 'Sensação de "estar fora de eixo"'],
    etapas: [
      { tempo: 300, label: '0–5 min', verbo: 'Iluminar', acao: 'Luz natural ao acordar no horário do destino' },
      { tempo: 180, label: '5–8 min', verbo: 'Ancorar', acao: 'Defina horários fixos para as 3 refeições' },
      { tempo: 120, label: '8–10 min', verbo: 'Hidratar', acao: '500 ml extras nas primeiras 2 horas do dia' },
    ],
    por_que: [
      { titulo: 'Reorganiza o relógio', texto: 'Luz é o sinal mais forte que o relógio biológico reconhece.' },
      { titulo: 'Reancora o fígado', texto: 'Comer em horários fixos sincroniza o segundo relógio do corpo.' },
      { titulo: 'Compensa o estresse', texto: 'A hidratação extra ajuda o corpo a processar a mudança.' },
    ],
    voce_sabia: 'Seu fígado tem um relógio próprio — e ele responde a comida, não a despertador.',
  },
  {
    id: 10, relogio: 'mente', titulo: 'Dia caótico',
    sintomas_busca: 'Tenho mil coisas pra fazer e travei na cadeira',
    o_que_acontece: 'Excesso de tarefas chegou na sua mente como uma única massa de "tudo pra fazer". Você está em colapso de decisão. Não é falta de capacidade — é sobrecarga cognitiva.',
    sinais: ['Sente que tem mil coisas mas não sabe por onde começar', 'Abriu 5 abas no navegador e ficou olhando todas', 'Fez 3 tarefas pequenas pra fugir da urgente', 'Está tensa, irritada, sem motivo claro'],
    etapas: [
      { tempo: 180, label: '0–3 min', verbo: 'Despejar', acao: 'Escreva tudo que está na sua cabeça sem editar' },
      { tempo: 120, label: '3–5 min', verbo: 'Escolher', acao: 'Circule 3 itens — os que dariam sentido ao dia' },
      { tempo: 300, label: '5–10 min', verbo: 'Executar', acao: 'Bloqueie distrações. Uma tarefa por vez.' },
    ],
    por_que: [
      { titulo: 'Reduz carga', texto: 'Tirar tudo da cabeça pro papel libera a memória de trabalho.' },
      { titulo: 'Devolve foco', texto: 'Escolher 3 prioridades é o oposto da paralisia da escolha.' },
      { titulo: 'Cria momentum', texto: 'Cada tarefa concluída libera dopamina — combustível pra próxima.' },
    ],
    voce_sabia: 'Multitarefa não existe — o cérebro alterna entre tarefas, e cada alternância custa energia.',
  },
  {
    id: 11, relogio: 'corpo', titulo: 'Cheguei sem nada pra dar',
    sintomas_busca: 'Cheguei em casa exausta, mas as crianças precisam de mim',
    o_que_acontece: 'Você passou o dia sendo exigida por todos os lados. Seu corpo está em débito energético real. Não é frescura — é gasto fisiológico cumulativo que ninguém vê.',
    sinais: ['Sensação de "tanque vazio" mesmo tendo comido', 'Irritação fácil com coisas pequenas', 'Vontade de chorar sem motivo claro', 'Corpo pesado, ombros doendo'],
    etapas: [
      { tempo: 240, label: '0–4 min', verbo: 'Repor', acao: '1 copo de água + lanche com proteína (ovo, queijo, iogurte)' },
      { tempo: 180, label: '4–7 min', verbo: 'Resetar', acao: 'Lave o rosto com água fria — sinaliza "novo turno"' },
      { tempo: 180, label: '7–10 min', verbo: 'Pausar', acao: '3 min sentada em silêncio antes do segundo turno' },
    ],
    por_que: [
      { titulo: 'Repõe o tanque', texto: 'Água + proteína estabilizam glicemia e tiram do "vazio".' },
      { titulo: 'Ativa novo modo', texto: 'A água fria aciona o sistema simpático — funciona como um reset.' },
      { titulo: 'Cria fronteira', texto: '3 minutos de silêncio separam os turnos — sem isso, tudo borra.' },
    ],
    voce_sabia: 'Reabastecer 10 minutos não é egoísmo — é manutenção mínima.',
  },
  {
    id: 12, relogio: 'tres', titulo: 'Hoje deu tudo errado',
    sintomas_busca: 'Hoje deu tudo errado e eu não sei nem por onde começar',
    o_que_acontece: 'Tem dias em que tudo parece dar errado — não porque tudo deu errado de fato, mas porque seus três relógios estão dessincronizados ao mesmo tempo. Você não está num dia ruim. Você está num dia desregulado.',
    sinais: ['Tudo parece pesado, do café da manhã até a reunião', 'Você esquece coisas, derruba coisas, irrita-se com coisas', 'Não tem motivo claro — só uma sensação de "errado"', 'Já tomou café duas vezes e não fez diferença'],
    etapas: [
      { tempo: 300, label: 'Corpo · 0–5 min', verbo: 'Iluminar', acao: '5 min de luz natural + 1 copo de água', cor: 'corpo' },
      { tempo: 120, label: 'Metabolismo · 5–7 min', verbo: 'Lanche real', acao: 'Proteína + gordura boa', cor: 'metabolismo' },
      { tempo: 180, label: 'Mente · 7–10 min', verbo: '3 prioridades', acao: 'Escreva 3 itens pro resto do dia. Apenas 3.', cor: 'mente' },
    ],
    por_que: [
      { titulo: 'Sinal triplo', texto: 'Quando você não sabe qual relógio está desregulado, ative os três.' },
      { titulo: 'Reset sistêmico', texto: 'Os 3 sinais juntos reorganizam o sistema mais que qualquer um sozinho.' },
      { titulo: 'O salvador', texto: 'Esse é o protocolo que mais usar quando o dia já começou errado.' },
    ],
    voce_sabia: 'A maioria dos "dias ruins" não eram ruins — eram dias mal sustentados. Quando você reorganiza os 3 Relógios em 10 minutos, o mesmo dia frequentemente vira "razoável".',
  },
];

// HELPER — cor de cada relógio
const colorOfRelogio = (rel) => {
  if (rel === 'corpo') return COLORS.terracota;
  if (rel === 'metabolismo') return COLORS.salva;
  if (rel === 'mente') return COLORS.ocre;
  return COLORS.terracota;
};

const colorLightOfRelogio = (rel) => {
  if (rel === 'corpo') return COLORS.terracotaLight;
  if (rel === 'metabolismo') return COLORS.salvaLight;
  if (rel === 'mente') return COLORS.ocreLight;
  return COLORS.terracotaLight;
};

const colorDeepOfRelogio = (rel) => {
  if (rel === 'corpo') return COLORS.terracotaDeep;
  if (rel === 'metabolismo') return COLORS.salvaDeep;
  if (rel === 'mente') return COLORS.ocreDeep;
  return COLORS.terracotaDeep;
};

const labelOfRelogio = (rel) => {
  if (rel === 'corpo') return 'Relógio do Corpo';
  if (rel === 'metabolismo') return 'Relógio do Metabolismo';
  if (rel === 'mente') return 'Relógio da Mente';
  if (rel === 'tres') return 'Os 3 Relógios';
  return '';
};

// =============================================================
// PERSISTÊNCIA
// =============================================================
function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Erro ao salvar:', e);
  }
}

// Helper de tempo
function fmtTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
// =============================================================
// COMPONENTE — ACCESS GATE (com suporte a Plus)
// =============================================================
function AccessGate({ onUnlock }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    const c = code.trim().toLowerCase();
    if (c === ACCESS_CODE) {
      onUnlock(false); // não Plus
    } else if (c === ACCESS_CODE_PLUS) {
      onUnlock(true); // Plus
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: COLORS.creme,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `1.5px solid ${COLORS.terracota}`, background: COLORS.terracotaLight }} />
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `1.5px solid ${COLORS.salva}`, background: COLORS.salvaLight }} />
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `1.5px solid ${COLORS.ocre}`, background: COLORS.ocreLight }} />
        </div>

        <p style={{
          fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase',
          color: COLORS.terracota, fontWeight: 500, marginBottom: '12px',
        }}>
          Protocolo Livre do Cansaço · 7 Dias
        </p>

        <h1 style={{
          fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '38px',
          fontWeight: 400, lineHeight: 1.05, color: COLORS.carvao,
          marginBottom: '14px', letterSpacing: '-0.5px',
        }}>
          Os 3 <em style={{ color: COLORS.terracota, fontWeight: 300 }}>Relógios</em><br />
          da Energia Estável
        </h1>

        <p style={{
          fontFamily: 'Georgia, serif', fontStyle: 'italic',
          fontSize: '15px', color: COLORS.carvaoSoft,
          marginBottom: '40px', lineHeight: 1.5,
        }}>
          Digite o código de acesso<br />que você recebeu na compra.
        </p>

        <input
          type="text" value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Código de acesso" autoFocus
          style={{
            width: '100%', padding: '14px 16px', fontSize: '16px',
            fontFamily: 'inherit',
            border: `1px solid ${error ? '#D54343' : COLORS.areiaDeep}`,
            background: COLORS.cremePuro, borderRadius: '6px',
            color: COLORS.carvao, outline: 'none',
            textAlign: 'center', letterSpacing: '1px', marginBottom: '16px',
            boxSizing: 'border-box',
          }}
        />

        {error && (
          <p style={{ color: '#D54343', fontSize: '13px', marginBottom: '16px' }}>
            Código incorreto. Tente novamente.
          </p>
        )}

        <button
          onClick={handleSubmit}
          style={{
            width: '100%', padding: '14px',
            background: COLORS.terracota, color: COLORS.cremePuro,
            border: 'none', borderRadius: '6px',
            fontSize: '15px', fontWeight: 500, letterSpacing: '0.5px',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Entrar no protocolo
        </button>

        <p style={{
          fontSize: '12px', color: COLORS.carvaoMuted,
          marginTop: '32px', fontStyle: 'italic',
          fontFamily: 'Georgia, serif',
        }}>
          © Ailin Orioni · Protocolo Livre do Cansaço 7D™
        </p>
      </div>
    </div>
  );
}

// =============================================================
// COMPONENTE — BOTÃO FLUTUANTE SOS (só Plus)
// =============================================================
function SOSFloatingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 100,
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: COLORS.terracota,
        color: COLORS.cremePuro,
        border: 'none',
        boxShadow: '0 4px 16px rgba(198, 107, 71, 0.35)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Georgia, serif',
        fontSize: '15px',
        fontStyle: 'italic',
        fontWeight: 500,
        letterSpacing: '0.5px',
      }}
      aria-label="Abrir Farmácia SOS"
    >
      SOS
    </button>
  );
}

// =============================================================
// COMPONENTE — GRADE DE SINTOMAS (tela inicial do SOS)
// =============================================================
function SOSScreen({ onSelectProtocolo, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: COLORS.creme,
      zIndex: 200,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px' }}>
        {/* Header com close */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingTop: '8px',
        }}>
          <div>
            <p style={{
              fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase',
              color: COLORS.terracota, margin: 0, fontWeight: 500,
            }}>
              Farmácia Rápida
            </p>
            <p style={{
              fontFamily: 'Georgia, serif', fontStyle: 'italic',
              fontSize: '13px', color: COLORS.carvaoSoft,
              margin: '2px 0 0',
            }}>
              SOS Cansaço · Plus
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: `1px solid ${COLORS.areiaDeep}`,
              borderRadius: '6px',
              padding: '8px 14px',
              fontSize: '13px',
              color: COLORS.carvaoSoft,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Fechar
          </button>
        </div>

        {/* Título */}
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '28px',
          fontWeight: 400,
          lineHeight: 1.1,
          color: COLORS.carvao,
          marginBottom: '8px',
          letterSpacing: '-0.3px',
        }}>
          Como você está se sentindo <em style={{ color: COLORS.terracota, fontWeight: 300 }}>agora</em>?
        </h1>

        <p style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontSize: '14px',
          color: COLORS.carvaoSoft,
          marginBottom: '24px',
          lineHeight: 1.5,
        }}>
          Toque no que mais se aproxima do que você sente.
        </p>

        {/* Grade de sintomas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '10px',
        }}>
          {PROTOCOLOS_SOS.map(p => {
            const cor = colorOfRelogio(p.relogio === 'tres' ? 'corpo' : p.relogio);
            const corLight = colorLightOfRelogio(p.relogio === 'tres' ? 'corpo' : p.relogio);
            const corDeep = colorDeepOfRelogio(p.relogio === 'tres' ? 'corpo' : p.relogio);

            return (
              <button
                key={p.id}
                onClick={() => onSelectProtocolo(p)}
                style={{
                  background: COLORS.cremePuro,
                  border: `1px solid ${COLORS.areiaDeep}`,
                  borderLeft: `4px solid ${cor}`,
                  borderRadius: '6px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  transition: 'all 0.15s',
                }}
              >
                <p style={{
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: '14px',
                  color: COLORS.carvao,
                  margin: 0,
                  lineHeight: 1.35,
                }}>
                  "{p.sintomas_busca}"
                </p>
                <p style={{
                  fontSize: '10px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: corDeep,
                  margin: 0,
                  fontWeight: 600,
                }}>
                  {p.relogio === 'tres' ? 'Reset dos 3 Relógios' : labelOfRelogio(p.relogio)}
                </p>
              </button>
            );
          })}
        </div>

        {/* Legenda */}
        <p style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontSize: '12px',
          color: COLORS.carvaoMuted,
          textAlign: 'center',
          margin: '24px 0 12px',
        }}>
          <span style={{ color: COLORS.terracota }}>●</span> Corpo &nbsp;·&nbsp;
          <span style={{ color: COLORS.salvaDeep }}>●</span> Metabolismo &nbsp;·&nbsp;
          <span style={{ color: COLORS.ocreDeep }}>●</span> Mente
        </p>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          fontSize: '10px',
          color: COLORS.carvaoMuted,
          letterSpacing: '0.5px',
          marginTop: '20px',
          paddingBottom: '20px',
        }}>
          © Ailin Orioni · Protocolo Livre 7D™ · Plus
        </p>
      </div>
    </div>
  );
}

// =============================================================
// COMPONENTE — TIMER DE PROTOCOLO ATIVO
// =============================================================
function TimerProtocolo({ protocolo, onComplete, onCancel }) {
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [segundosRestantes, setSegundosRestantes] = useState(protocolo.etapas[0].tempo);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado) return;
    if (segundosRestantes <= 0) {
      // próxima etapa ou terminar
      if (etapaAtual < protocolo.etapas.length - 1) {
        setEtapaAtual(etapaAtual + 1);
        setSegundosRestantes(protocolo.etapas[etapaAtual + 1].tempo);
      } else {
        // protocolo completo
        onComplete();
      }
      return;
    }

    const t = setTimeout(() => setSegundosRestantes(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [segundosRestantes, etapaAtual, pausado]);

  const etapa = protocolo.etapas[etapaAtual];
  const cor = etapa.cor
    ? colorOfRelogio(etapa.cor)
    : colorOfRelogio(protocolo.relogio === 'tres' ? 'corpo' : protocolo.relogio);
  const corLight = etapa.cor
    ? colorLightOfRelogio(etapa.cor)
    : colorLightOfRelogio(protocolo.relogio === 'tres' ? 'corpo' : protocolo.relogio);
  const corDeep = etapa.cor
    ? colorDeepOfRelogio(etapa.cor)
    : colorDeepOfRelogio(protocolo.relogio === 'tres' ? 'corpo' : protocolo.relogio);

  const progressoEtapa = ((etapa.tempo - segundosRestantes) / etapa.tempo) * 100;
  const totalTempo = protocolo.etapas.reduce((acc, e) => acc + e.tempo, 0);
  const tempoDecorrido = protocolo.etapas
    .slice(0, etapaAtual)
    .reduce((acc, e) => acc + e.tempo, 0) + (etapa.tempo - segundosRestantes);
  const progressoTotal = (tempoDecorrido / totalTempo) * 100;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: COLORS.creme,
      zIndex: 300,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{ maxWidth: '420px', width: '100%' }}>
        {/* Etapa indicator */}
        <p style={{
          textAlign: 'center',
          fontSize: '11px',
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          color: corDeep,
          fontWeight: 600,
          marginBottom: '12px',
        }}>
          Etapa {etapaAtual + 1} de {protocolo.etapas.length} · {etapa.label}
        </p>

        {/* Progresso total */}
        <div style={{
          height: '3px',
          background: COLORS.areia,
          borderRadius: '2px',
          marginBottom: '32px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${progressoTotal}%`,
            height: '100%',
            background: cor,
            transition: 'width 0.5s',
          }} />
        </div>

        {/* Verbo grande */}
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '52px',
          fontWeight: 400,
          fontStyle: 'italic',
          color: cor,
          margin: '0 0 16px',
          textAlign: 'center',
          lineHeight: 1,
        }}>
          {etapa.verbo}
        </h1>

        {/* Ação */}
        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: '17px',
          color: COLORS.carvao,
          textAlign: 'center',
          margin: '0 0 40px',
          lineHeight: 1.45,
          padding: '0 8px',
        }}>
          {etapa.acao}
        </p>

        {/* Timer circular grande */}
        <div style={{
          background: corLight,
          padding: '30px',
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '24px',
        }}>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '64px',
            fontWeight: 300,
            color: corDeep,
            margin: 0,
            lineHeight: 1,
            letterSpacing: '-2px',
          }}>
            {fmtTime(segundosRestantes)}
          </p>
          <p style={{
            fontSize: '11px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: corDeep,
            marginTop: '8px',
            opacity: 0.7,
          }}>
            {pausado ? 'Pausado' : 'Restam'}
          </p>

          {/* Progresso da etapa */}
          <div style={{
            height: '4px',
            background: 'rgba(0,0,0,0.08)',
            borderRadius: '2px',
            marginTop: '20px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progressoEtapa}%`,
              height: '100%',
              background: cor,
              transition: 'width 1s linear',
            }} />
          </div>
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '14px',
              background: 'transparent',
              border: `1px solid ${COLORS.areiaDeep}`,
              borderRadius: '6px',
              color: COLORS.carvaoSoft,
              fontSize: '14px',
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={() => setPausado(!pausado)}
            style={{
              flex: 1,
              padding: '14px',
              background: pausado ? cor : 'transparent',
              border: `1px solid ${cor}`,
              borderRadius: '6px',
              color: pausado ? COLORS.cremePuro : cor,
              fontSize: '14px',
              fontFamily: 'inherit',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {pausado ? 'Retomar' : 'Pausar'}
          </button>
          <button
            onClick={() => {
              if (etapaAtual < protocolo.etapas.length - 1) {
                setEtapaAtual(etapaAtual + 1);
                setSegundosRestantes(protocolo.etapas[etapaAtual + 1].tempo);
              } else {
                onComplete();
              }
            }}
            style={{
              flex: 1,
              padding: '14px',
              background: cor,
              border: 'none',
              borderRadius: '6px',
              color: COLORS.cremePuro,
              fontSize: '14px',
              fontFamily: 'inherit',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {etapaAtual === protocolo.etapas.length - 1 ? 'Concluir' : 'Próxima'}
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// COMPONENTE — VISUALIZAÇÃO DO PROTOCOLO INDIVIDUAL
// =============================================================
function ProtocoloDetalhe({ protocolo, onIniciarTimer, onVoltar }) {
  const cor = colorOfRelogio(protocolo.relogio === 'tres' ? 'corpo' : protocolo.relogio);
  const corLight = colorLightOfRelogio(protocolo.relogio === 'tres' ? 'corpo' : protocolo.relogio);
  const corDeep = colorDeepOfRelogio(protocolo.relogio === 'tres' ? 'corpo' : protocolo.relogio);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: COLORS.creme,
      zIndex: 250,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px 20px 100px' }}>
        {/* Voltar */}
        <button
          onClick={onVoltar}
          style={{
            background: 'transparent',
            border: 'none',
            color: corDeep,
            fontSize: '14px',
            fontFamily: 'inherit',
            cursor: 'pointer',
            padding: '8px 0',
            marginBottom: '12px',
          }}
        >
          ← Voltar
        </button>

        {/* Tag do relógio */}
        <div style={{
          display: 'inline-block',
          background: corLight,
          color: corDeep,
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '10px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontWeight: 600,
          marginBottom: '8px',
        }}>
          {protocolo.relogio === 'tres' ? 'Reset dos 3 Relógios' : labelOfRelogio(protocolo.relogio)}
        </div>

        {/* Título */}
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '30px',
          fontWeight: 400,
          color: COLORS.carvao,
          margin: '0 0 20px',
          lineHeight: 1.1,
          letterSpacing: '-0.3px',
        }}>
          {protocolo.titulo}
        </h1>

        {/* O que está acontecendo */}
        <p style={{
          fontSize: '11px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: corDeep,
          fontWeight: 600,
          marginBottom: '6px',
        }}>
          O que está acontecendo
        </p>
        <p style={{
          fontSize: '14px',
          color: COLORS.carvaoSoft,
          lineHeight: 1.55,
          marginBottom: '20px',
        }}>
          {protocolo.o_que_acontece}
        </p>

        {/* Sinais */}
        <p style={{
          fontSize: '11px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: corDeep,
          fontWeight: 600,
          marginBottom: '8px',
        }}>
          Sinais de que é isso
        </p>
        <div style={{ marginBottom: '24px' }}>
          {protocolo.sinais.map((sinal, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
              padding: '6px 0',
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: cor,
                marginTop: '7px',
                flexShrink: 0,
              }} />
              <p style={{
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                fontSize: '14px',
                color: COLORS.carvao,
                margin: 0,
                lineHeight: 1.4,
              }}>
                {sinal}
              </p>
            </div>
          ))}
        </div>

        {/* Por que funciona */}
        <p style={{
          fontSize: '11px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: corDeep,
          fontWeight: 600,
          marginBottom: '8px',
        }}>
          Por que funciona
        </p>
        <div style={{ marginBottom: '24px' }}>
          {protocolo.por_que.map((item, i) => (
            <div key={i} style={{
              background: corLight,
              padding: '12px 14px',
              borderRadius: '6px',
              marginBottom: '8px',
            }}>
              <p style={{
                fontFamily: 'Georgia, serif',
                fontSize: '14px',
                fontWeight: 600,
                color: corDeep,
                margin: '0 0 4px',
              }}>
                {item.titulo}
              </p>
              <p style={{
                fontSize: '12.5px',
                color: COLORS.carvaoSoft,
                margin: 0,
                lineHeight: 1.5,
              }}>
                {item.texto}
              </p>
            </div>
          ))}
        </div>

        {/* Você sabia */}
        <div style={{
          background: COLORS.ocreLight,
          borderLeft: `4px solid ${COLORS.ocre}`,
          padding: '12px 14px',
          borderRadius: '4px',
          marginBottom: '32px',
        }}>
          <p style={{
            fontSize: '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: COLORS.ocreDeep,
            fontWeight: 600,
            marginBottom: '4px',
          }}>
            Você sabia?
          </p>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: '13px',
            color: COLORS.carvao,
            margin: 0,
            lineHeight: 1.5,
          }}>
            {protocolo.voce_sabia}
          </p>
        </div>

        {/* Botão iniciar timer */}
        <button
          onClick={onIniciarTimer}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            right: '20px',
            maxWidth: '440px',
            margin: '0 auto',
            padding: '16px',
            background: cor,
            color: COLORS.cremePuro,
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 600,
            letterSpacing: '0.3px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          }}
        >
          ⏱ Iniciar protocolo guiado · 10 minutos
        </button>
      </div>
    </div>
  );
}

// =============================================================
// COMPONENTE — TELA DE PROTOCOLO COMPLETO (após timer terminar)
// =============================================================
function ProtocoloCompleto({ protocolo, onFechar }) {
  const cor = colorOfRelogio(protocolo.relogio === 'tres' ? 'corpo' : protocolo.relogio);
  const corLight = colorLightOfRelogio(protocolo.relogio === 'tres' ? 'corpo' : protocolo.relogio);
  const corDeep = colorDeepOfRelogio(protocolo.relogio === 'tres' ? 'corpo' : protocolo.relogio);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: COLORS.creme,
      zIndex: 350,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS.terracota }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS.salva }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS.ocre }} />
        </div>

        <p style={{
          fontSize: '11px',
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          color: corDeep,
          fontWeight: 600,
          marginBottom: '12px',
        }}>
          Protocolo concluído
        </p>

        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '32px',
          fontWeight: 400,
          fontStyle: 'italic',
          color: COLORS.carvao,
          margin: '0 0 16px',
          lineHeight: 1.15,
        }}>
          Você cuidou<br />de você por <em style={{ color: cor }}>10 minutos</em>.
        </h1>

        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: '14px',
          fontStyle: 'italic',
          color: COLORS.carvaoSoft,
          marginBottom: '32px',
          lineHeight: 1.5,
        }}>
          Esse protocolo foi salvo na sua jornada. Em alguns dias, você vai ver os padrões.
        </p>

        <div style={{
          background: corLight,
          padding: '14px 16px',
          borderRadius: '6px',
          marginBottom: '24px',
        }}>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: '13px',
            color: corDeep,
            margin: 0,
            lineHeight: 1.45,
          }}>
            "{protocolo.voce_sabia}"
          </p>
        </div>

        <button
          onClick={onFechar}
          style={{
            width: '100%',
            padding: '14px',
            background: cor,
            color: COLORS.cremePuro,
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

// =============================================================
// COMPONENTE — BOTÃO FLUTUANTE JORNADA
// =============================================================
function JornadaFloatingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 100,
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: COLORS.cremePuro,
        color: COLORS.terracota,
        border: `2px solid ${COLORS.terracota}`,
        boxShadow: '0 4px 16px rgba(43, 42, 40, 0.12)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Georgia, serif',
        fontSize: '13px',
        fontStyle: 'italic',
        fontWeight: 500,
        letterSpacing: '0.3px',
      }}
      aria-label="Ver minha jornada"
    >
      Jornada
    </button>
  );
}

// =============================================================
// COMPONENTE — TELA DE JORNADA / HISTÓRICO
// (Disponível para todas — Plus tem insights extras)
// =============================================================
function JornadaScreen({ data, isPlus, onClose }) {
  const days = data.days || {};
  const completedDays = Object.keys(days)
    .map(Number)
    .filter(d => days[d].completed && d >= 1 && d <= 7)
    .sort((a, b) => a - b);

  // Cálculos para resumo
  const totalDiasCompletos = completedDays.length;
  const totalAdesao = completedDays.reduce((acc, d) => acc + (days[d].adesao?.cumpridos || 0), 0);
  const totalPossivel = completedDays.reduce((acc, d) => acc + (days[d].adesao?.total || 0), 0);
  const aderenciaPct = totalPossivel > 0 ? Math.round((totalAdesao / totalPossivel) * 100) : 0;

  // Análise SOS (só Plus)
  const sosUsage = data.sosUsage || [];
  const totalSOS = sosUsage.length;

  // Distribuição por relógio (Plus)
  const distrRelogios = { corpo: 0, metabolismo: 0, mente: 0, tres: 0 };
  sosUsage.forEach(uso => {
    if (distrRelogios[uso.relogio] !== undefined) {
      distrRelogios[uso.relogio]++;
    }
  });
  const totalParaPct = Math.max(totalSOS, 1);

  // Insights (Plus)
  const insights = [];
  if (totalSOS >= 3) {
    // Relógio mais ativo
    const entries = Object.entries(distrRelogios).filter(([k]) => k !== 'tres');
    entries.sort((a, b) => b[1] - a[1]);
    const [topRel, topCount] = entries[0];
    if (topCount > 0) {
      const pct = Math.round((topCount / totalSOS) * 100);
      const label = labelOfRelogio(topRel);
      insights.push({
        tipo: 'relogio',
        titulo: 'Seu relógio mais sensível',
        texto: `${label} é o que mais te desregula — ${pct}% dos seus protocolos foram pra essa área.`,
        relogio: topRel,
      });
    }
  }
  if (totalSOS >= 5) {
    // Padrão de hora do dia
    const horas = sosUsage.map(u => new Date(u.timestamp).getHours());
    const horaMedia = Math.round(horas.reduce((a, b) => a + b, 0) / horas.length);
    let periodo;
    if (horaMedia < 12) periodo = 'manhã';
    else if (horaMedia < 18) periodo = 'tarde';
    else periodo = 'noite';
    insights.push({
      tipo: 'horario',
      titulo: 'Seu pico de cansaço',
      texto: `Você usa SOS principalmente durante a ${periodo}. Vale prestar atenção nesse horário no seu protocolo.`,
      relogio: 'mente',
    });
  }
  if (totalSOS >= 7) {
    // Frequência semanal
    const ultimaSem = sosUsage.filter(u => {
      const d = new Date(u.timestamp);
      const agora = new Date();
      return (agora - d) < 7 * 24 * 60 * 60 * 1000;
    });
    if (ultimaSem.length >= 3) {
      insights.push({
        tipo: 'frequencia',
        titulo: 'Sua semana foi intensa',
        texto: `Você usou ${ultimaSem.length} protocolos nos últimos 7 dias. Esse pode ser um sinal de que precisa revisar a rotina de fundo.`,
        relogio: 'corpo',
      });
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: COLORS.creme,
      zIndex: 200,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingTop: '8px',
        }}>
          <div>
            <p style={{
              fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase',
              color: COLORS.terracota, margin: 0, fontWeight: 500,
            }}>
              Sua Jornada
            </p>
            <p style={{
              fontFamily: 'Georgia, serif', fontStyle: 'italic',
              fontSize: '13px', color: COLORS.carvaoSoft,
              margin: '2px 0 0',
            }}>
              {isPlus ? 'Histórico e insights pessoais' : 'Seu progresso nos 7 dias'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: `1px solid ${COLORS.areiaDeep}`,
              borderRadius: '6px',
              padding: '8px 14px',
              fontSize: '13px',
              color: COLORS.carvaoSoft,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Fechar
          </button>
        </div>

        {/* Título principal */}
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '28px',
          fontWeight: 400,
          lineHeight: 1.1,
          color: COLORS.carvao,
          marginBottom: '20px',
          letterSpacing: '-0.3px',
        }}>
          {totalDiasCompletos === 0
            ? <>Sua <em style={{ color: COLORS.terracota, fontWeight: 300 }}>jornada</em> começa aqui.</>
            : <>O que você <em style={{ color: COLORS.terracota, fontWeight: 300 }}>construiu</em> até aqui.</>}
        </h1>

        {/* RESUMO PROTOCOLO 7D — todas */}
        {totalDiasCompletos > 0 && (
          <>
            <p style={{
              fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
              color: COLORS.terracotaDeep, fontWeight: 600, marginBottom: '12px',
            }}>
              Protocolo dos 7 dias
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <div style={{
                background: COLORS.terracotaLight,
                padding: '14px',
                borderRadius: '8px',
                textAlign: 'center',
              }}>
                <p style={{
                  fontFamily: 'Georgia, serif', fontSize: '32px',
                  fontWeight: 400, color: COLORS.terracotaDeep,
                  margin: 0, lineHeight: 1,
                }}>
                  {totalDiasCompletos}<span style={{ fontSize: '18px', opacity: 0.5 }}>/7</span>
                </p>
                <p style={{
                  fontSize: '11px', color: COLORS.terracotaDeep,
                  margin: '4px 0 0', letterSpacing: '0.5px',
                }}>
                  Dias completos
                </p>
              </div>
              <div style={{
                background: COLORS.salvaLight,
                padding: '14px',
                borderRadius: '8px',
                textAlign: 'center',
              }}>
                <p style={{
                  fontFamily: 'Georgia, serif', fontSize: '32px',
                  fontWeight: 400, color: COLORS.salvaDeep,
                  margin: 0, lineHeight: 1,
                }}>
                  {aderenciaPct}<span style={{ fontSize: '18px', opacity: 0.5 }}>%</span>
                </p>
                <p style={{
                  fontSize: '11px', color: COLORS.salvaDeep,
                  margin: '4px 0 0', letterSpacing: '0.5px',
                }}>
                  Aderência média
                </p>
              </div>
            </div>

            {/* Lista de dias */}
            <div style={{ marginBottom: '32px' }}>
              {completedDays.map(d => {
                const day = DAYS_STRUCTURE[d];
                const dayCor = day.color === 'salva' ? COLORS.salva : day.color === 'ocre' ? COLORS.ocre : COLORS.terracota;
                const dayCorLight = day.color === 'salva' ? COLORS.salvaLight : day.color === 'ocre' ? COLORS.ocreLight : COLORS.terracotaLight;
                const dayCorDeep = day.color === 'salva' ? COLORS.salvaDeep : day.color === 'ocre' ? COLORS.ocreDeep : COLORS.terracotaDeep;
                const adesao = days[d].adesao;

                return (
                  <div key={d} style={{
                    background: COLORS.cremePuro,
                    borderLeft: `4px solid ${dayCor}`,
                    border: `1px solid ${COLORS.areiaDeep}`,
                    borderLeftWidth: '4px',
                    padding: '12px 14px',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: dayCorLight,
                      color: dayCorDeep,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Georgia, serif',
                      fontSize: '15px',
                      fontWeight: 500,
                      flexShrink: 0,
                    }}>
                      {d}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '13px', fontWeight: 600,
                        color: COLORS.carvao, margin: 0, lineHeight: 1.3,
                      }}>
                        {day.title}
                      </p>
                      <p style={{
                        fontSize: '11px', color: COLORS.carvaoMuted,
                        margin: '2px 0 0', letterSpacing: '0.3px',
                      }}>
                        {adesao ? `${adesao.cumpridos}/${adesao.total} ações cumpridas` : 'Concluído'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {totalDiasCompletos === 0 && (
          <div style={{
            background: COLORS.areiaSoft,
            padding: '20px',
            borderRadius: '8px',
            border: `1px solid ${COLORS.areiaDeep}`,
            textAlign: 'center',
            marginBottom: '24px',
          }}>
            <p style={{
              fontFamily: 'Georgia, serif', fontStyle: 'italic',
              fontSize: '14px', color: COLORS.carvaoSoft,
              margin: 0, lineHeight: 1.5,
            }}>
              Você ainda não completou nenhum dia do protocolo. Vai aparecer aqui à medida que você avança.
            </p>
          </div>
        )}

        {/* SEÇÃO PLUS — só pra compradoras Plus */}
        {isPlus && (
          <>
            <p style={{
              fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
              color: COLORS.salvaDeep, fontWeight: 600, marginBottom: '12px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span>Farmácia SOS · Plus</span>
              <span style={{
                background: COLORS.salvaLight,
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '9px',
                letterSpacing: '1px',
              }}>
                {totalSOS} usos
              </span>
            </p>

            {totalSOS === 0 && (
              <div style={{
                background: COLORS.areiaSoft,
                padding: '20px',
                borderRadius: '8px',
                border: `1px solid ${COLORS.areiaDeep}`,
                textAlign: 'center',
                marginBottom: '24px',
              }}>
                <p style={{
                  fontFamily: 'Georgia, serif', fontStyle: 'italic',
                  fontSize: '14px', color: COLORS.carvaoSoft,
                  margin: 0, lineHeight: 1.5,
                }}>
                  Você ainda não usou a Farmácia SOS. Quando usar, seus padrões vão começar a aparecer aqui.
                </p>
              </div>
            )}

            {totalSOS > 0 && (
              <>
                {/* Distribuição por relógio */}
                <div style={{ marginBottom: '20px' }}>
                  <p style={{
                    fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase',
                    color: COLORS.carvaoMuted, fontWeight: 500, marginBottom: '8px',
                  }}>
                    Onde você mais precisou de socorro
                  </p>
                  {[
                    { key: 'corpo', label: 'Relógio do Corpo' },
                    { key: 'metabolismo', label: 'Relógio do Metabolismo' },
                    { key: 'mente', label: 'Relógio da Mente' },
                  ].map(rel => {
                    const count = distrRelogios[rel.key];
                    const pct = Math.round((count / totalParaPct) * 100);
                    const cor = colorOfRelogio(rel.key);
                    return (
                      <div key={rel.key} style={{ marginBottom: '8px' }}>
                        <div style={{
                          display: 'flex', justifyContent: 'space-between',
                          marginBottom: '3px',
                        }}>
                          <span style={{ fontSize: '12px', color: COLORS.carvaoSoft }}>
                            {rel.label}
                          </span>
                          <span style={{ fontSize: '12px', color: cor, fontWeight: 600 }}>
                            {count} {count === 1 ? 'uso' : 'usos'} · {pct}%
                          </span>
                        </div>
                        <div style={{
                          height: '6px', background: COLORS.areia,
                          borderRadius: '3px', overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${pct}%`, height: '100%', background: cor,
                            transition: 'width 0.4s',
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Insights automáticos */}
                {insights.length > 0 && (
                  <>
                    <p style={{
                      fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase',
                      color: COLORS.carvaoMuted, fontWeight: 500, marginBottom: '8px',
                      marginTop: '20px',
                    }}>
                      Padrões que você revelou
                    </p>
                    {insights.map((ins, i) => {
                      const cor = colorOfRelogio(ins.relogio);
                      const corLight = colorLightOfRelogio(ins.relogio);
                      const corDeep = colorDeepOfRelogio(ins.relogio);
                      return (
                        <div key={i} style={{
                          background: corLight,
                          padding: '12px 14px',
                          borderRadius: '6px',
                          marginBottom: '8px',
                          borderLeft: `3px solid ${cor}`,
                        }}>
                          <p style={{
                            fontFamily: 'Georgia, serif',
                            fontSize: '14px', fontWeight: 600,
                            color: corDeep, margin: '0 0 4px',
                          }}>
                            {ins.titulo}
                          </p>
                          <p style={{
                            fontSize: '12.5px', color: COLORS.carvaoSoft,
                            margin: 0, lineHeight: 1.5,
                          }}>
                            {ins.texto}
                          </p>
                        </div>
                      );
                    })}
                  </>
                )}

                {totalSOS > 0 && totalSOS < 3 && (
                  <div style={{
                    background: COLORS.ocreLight,
                    padding: '12px 14px',
                    borderRadius: '6px',
                    marginBottom: '20px',
                    borderLeft: `3px solid ${COLORS.ocre}`,
                  }}>
                    <p style={{
                      fontFamily: 'Georgia, serif', fontStyle: 'italic',
                      fontSize: '13px', color: COLORS.ocreDeep,
                      margin: 0, lineHeight: 1.5,
                    }}>
                      Conforme você usa mais a Farmácia, padrões pessoais começam a aparecer aqui.
                    </p>
                  </div>
                )}

                {/* Histórico recente */}
                <p style={{
                  fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase',
                  color: COLORS.carvaoMuted, fontWeight: 500, marginBottom: '8px',
                  marginTop: '20px',
                }}>
                  Últimos protocolos usados
                </p>
                <div style={{ marginBottom: '20px' }}>
                  {sosUsage.slice(-5).reverse().map((uso, i) => {
                    const cor = colorOfRelogio(uso.relogio === 'tres' ? 'corpo' : uso.relogio);
                    const data = new Date(uso.timestamp);
                    const dataStr = data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                    const horaStr = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 0',
                        borderBottom: i < Math.min(4, sosUsage.length - 1) ? `1px solid ${COLORS.areia}` : 'none',
                      }}>
                        <div style={{
                          width: '8px', height: '8px',
                          borderRadius: '50%', background: cor,
                          flexShrink: 0,
                        }} />
                        <div style={{ flex: 1 }}>
                          <p style={{
                            fontSize: '13px', color: COLORS.carvao,
                            margin: 0, fontWeight: 500,
                          }}>
                            {uso.titulo}
                          </p>
                          <p style={{
                            fontSize: '11px', color: COLORS.carvaoMuted,
                            margin: '2px 0 0',
                          }}>
                            {dataStr} · {horaStr}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* SEÇÃO V1 — convite ao Plus pra quem não é Plus */}
        {!isPlus && totalDiasCompletos > 0 && (
          <div style={{
            background: COLORS.cremePuro,
            border: `1px solid ${COLORS.terracota}`,
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            marginTop: '12px',
          }}>
            <p style={{
              fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
              color: COLORS.terracota, fontWeight: 600, marginBottom: '6px',
            }}>
              Disponível com Plus
            </p>
            <p style={{
              fontFamily: 'Georgia, serif', fontSize: '15px',
              color: COLORS.carvao, margin: '0 0 8px', lineHeight: 1.3,
            }}>
              Acesso à <em style={{ color: COLORS.terracota }}>Farmácia SOS interativa</em> e insights pessoais.
            </p>
            <p style={{
              fontSize: '12px', color: COLORS.carvaoSoft,
              margin: 0, lineHeight: 1.5,
            }}>
              Pra quem completou os 7 dias e quer continuar aplicando o método em situações pontuais. 12 protocolos guiados de 10 minutos + descobertas automáticas sobre seus padrões.
            </p>
          </div>
        )}

        {/* Footer */}
        <p style={{
          textAlign: 'center', fontSize: '10px',
          color: COLORS.carvaoMuted, letterSpacing: '0.5px',
          marginTop: '20px', paddingBottom: '20px',
        }}>
          © Ailin Orioni · Protocolo Livre 7D™ {isPlus && '· Plus'}
        </p>
      </div>
    </div>
  );
}

function ScoreSelector({ value, onChange, color = COLORS.terracota }) {
  return (
    <div style={{ display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
      {[...Array(11)].map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          style={{
            width: '26px', height: '26px', borderRadius: '50%',
            border: `1.5px solid ${color}`,
            background: value === i ? color : COLORS.cremePuro,
            color: value === i ? COLORS.cremePuro : color,
            cursor: 'pointer', fontSize: '11px', fontWeight: 500,
            padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s', fontFamily: 'inherit',
          }}
        >
          {i}
        </button>
      ))}
    </div>
  );
}

function Header({ data, currentDay }) {
  const completedDays = Object.keys(data.days || {}).filter(d => data.days[d].completed).length;
  const progress = Math.round((completedDays / 7) * 100);

  return (
    <div style={{
      background: COLORS.cremePuro, padding: '20px 20px 16px',
      borderBottom: `1px solid ${COLORS.areia}`,
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <p style={{
            fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
            color: COLORS.carvaoMuted, margin: 0, fontWeight: 500,
          }}>
            Protocolo Livre do Cansaço
          </p>
          <p style={{
            fontFamily: 'Georgia, serif', fontStyle: 'italic',
            fontSize: '13px', color: COLORS.terracota, margin: '2px 0 0',
          }}>
            Dia {currentDay} de 7
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: `1.2px solid ${COLORS.terracota}`, background: completedDays >= 2 ? COLORS.terracota : COLORS.terracotaLight }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: `1.2px solid ${COLORS.salva}`, background: completedDays >= 4 ? COLORS.salva : COLORS.salvaLight }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: `1.2px solid ${COLORS.ocre}`, background: completedDays >= 5 ? COLORS.ocre : COLORS.ocreLight }} />
        </div>
      </div>

      <div style={{ height: '4px', background: COLORS.areia, borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: COLORS.terracota, transition: 'width 0.4s' }} />
      </div>
    </div>
  );
}

function DayNav({ currentDay, setCurrentDay, data }) {
  return (
    <div style={{
      display: 'flex', gap: '6px', padding: '12px 16px',
      background: COLORS.creme, overflowX: 'auto',
      borderBottom: `1px solid ${COLORS.areia}`,
    }}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map(d => {
        const dayData = data.days?.[d];
        const isComplete = dayData?.completed;
        const isCurrent = d === currentDay;
        const day = DAYS_STRUCTURE[d];
        const dayColor = day.color === 'salva' ? COLORS.salva : day.color === 'ocre' ? COLORS.ocre : COLORS.terracota;

        return (
          <button
            key={d} onClick={() => setCurrentDay(d)}
            style={{
              minWidth: '42px', height: '42px', borderRadius: '50%',
              border: `1.5px solid ${isCurrent ? dayColor : COLORS.areiaDeep}`,
              background: isComplete ? dayColor : isCurrent ? COLORS.cremePuro : 'transparent',
              color: isComplete ? COLORS.cremePuro : isCurrent ? dayColor : COLORS.carvaoMuted,
              fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'Georgia, serif',
              flexShrink: 0, transition: 'all 0.2s',
            }}
          >
            {d === 0 ? '0' : d}
          </button>
        );
      })}
    </div>
  );
}

function DayInitial({ data, updateData, goToDay }) {
  const initial = data.initial || {};

  const updateInitial = (updates) => {
    updateData({ ...data, initial: { ...initial, ...updates } });
  };

  const updateScore = (field, value) => {
    updateInitial({ scores: { ...(initial.scores || {}), [field]: value } });
  };

  const allScored = SCORE_FIELDS_INITIAL.every(f => initial.scores?.[f.id] !== undefined);
  const total = SCORE_FIELDS_INITIAL.reduce((acc, f) => acc + (initial.scores?.[f.id] || 0), 0);

  return (
    <div style={{ padding: '24px 20px 80px' }}>
      <p style={{
        fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase',
        color: COLORS.terracota, margin: '0 0 8px', fontWeight: 500,
      }}>
        Antes de começar
      </p>

      <h1 style={{
        fontFamily: 'Georgia, serif', fontSize: '30px', fontWeight: 400,
        color: COLORS.carvao, margin: '0 0 4px',
        lineHeight: 1.1, letterSpacing: '-0.3px',
      }}>
        Seu <em style={{ color: COLORS.terracota, fontWeight: 300 }}>ponto de partida</em>.
      </h1>

      <p style={{
        fontFamily: 'Georgia, serif', fontStyle: 'italic',
        fontSize: '15px', color: COLORS.carvaoSoft,
        margin: '12px 0 24px', lineHeight: 1.5,
      }}>
        Antes de começar o protocolo, você precisa de uma fotografia de onde você está hoje. Esse é o número contra o qual você vai comparar tudo.
      </p>

      <div style={{
        background: COLORS.areiaSoft, padding: '16px 18px',
        borderRadius: '8px', marginBottom: '24px',
        border: `1px solid ${COLORS.areiaDeep}`,
      }}>
        <p style={{ fontSize: '14px', color: COLORS.carvaoSoft, margin: 0, lineHeight: 1.6 }}>
          Em uma escala de <strong>0 a 10</strong>, como você se sente hoje em cada item.<br />
          <em style={{ fontFamily: 'Georgia, serif' }}>Seja honesta. Ninguém vai ver isso além de você.</em>
        </p>
      </div>

      {SCORE_FIELDS_INITIAL.map(field => (
        <div key={field.id} style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: COLORS.carvao, margin: '0 0 8px', fontWeight: 500 }}>
            {field.label}
          </p>
          <ScoreSelector
            value={initial.scores?.[field.id]}
            onChange={(v) => updateScore(field.id, v)}
          />
        </div>
      ))}

      <div style={{ marginTop: '28px' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: COLORS.carvao, marginBottom: '8px' }}>
          Em qual momento do dia você sente mais queda?
        </p>
        <textarea
          value={initial.queda || ''}
          onChange={(e) => updateInitial({ queda: e.target.value })}
          rows={2} placeholder="Descreva o momento da queda…"
          style={{
            width: '100%', padding: '12px', fontSize: '14px',
            border: `1px solid ${COLORS.areiaDeep}`, background: COLORS.cremePuro,
            borderRadius: '6px', fontFamily: 'inherit', color: COLORS.carvao,
            outline: 'none', resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: COLORS.carvao, marginBottom: '8px' }}>
          O que você acredita hoje que mais te cansa?
        </p>
        <textarea
          value={initial.causa || ''}
          onChange={(e) => updateInitial({ causa: e.target.value })}
          rows={3} placeholder="O que mais te cansa…"
          style={{
            width: '100%', padding: '12px', fontSize: '14px',
            border: `1px solid ${COLORS.areiaDeep}`, background: COLORS.cremePuro,
            borderRadius: '6px', fontFamily: 'inherit', color: COLORS.carvao,
            outline: 'none', resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      </div>

      {allScored && (
        <div style={{
          marginTop: '32px', padding: '20px',
          background: COLORS.terracotaLight, borderRadius: '8px',
          borderLeft: `4px solid ${COLORS.terracota}`,
        }}>
          <p style={{
            fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
            color: COLORS.terracotaDeep, fontWeight: 500, margin: '0 0 6px',
          }}>
            Score inicial
          </p>
          <p style={{
            fontFamily: 'Georgia, serif', fontSize: '32px',
            color: COLORS.terracota, margin: 0, fontWeight: 400,
          }}>
            {total} <span style={{ fontSize: '18px', color: COLORS.carvaoMuted, fontStyle: 'italic' }}>/ 80</span>
          </p>
          <p style={{ fontSize: '13px', color: COLORS.carvaoSoft, marginTop: '8px', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
            Esse é o seu Dia 0. Volte aqui no Dia 7 para comparar.
          </p>
        </div>
      )}

      <button
        onClick={() => {
          updateInitial({ completed: true });
          goToDay(1);
        }}
        disabled={!allScored}
        style={{
          marginTop: '28px', width: '100%', padding: '14px',
          background: allScored ? COLORS.terracota : COLORS.areiaDeep,
          color: COLORS.cremePuro, border: 'none', borderRadius: '6px',
          fontSize: '15px', fontWeight: 500,
          cursor: allScored ? 'pointer' : 'not-allowed',
          fontFamily: 'inherit', letterSpacing: '0.3px',
        }}
      >
        Começar o Dia 1 →
      </button>
    </div>
  );
}

function DayPage({ dayNum, data, updateData, goToDay }) {
  const day = DAYS_STRUCTURE[dayNum];
  const dayData = data.days?.[dayNum] || {};
  const dayColor = day.color === 'salva' ? COLORS.salva : day.color === 'ocre' ? COLORS.ocre : COLORS.terracota;
  const dayColorLight = day.color === 'salva' ? COLORS.salvaLight : day.color === 'ocre' ? COLORS.ocreLight : COLORS.terracotaLight;
  const dayColorDeep = day.color === 'salva' ? COLORS.salvaDeep : day.color === 'ocre' ? COLORS.ocreDeep : COLORS.terracotaDeep;

  const updateDayData = (updates) => {
    const newDays = { ...(data.days || {}) };
    newDays[dayNum] = { ...dayData, ...updates };
    updateData({ ...data, days: newDays });
  };

  const toggleCheck = (id) => {
    const checks = { ...(dayData.checks || {}) };
    checks[id] = !checks[id];
    updateDayData({ checks });
  };

  const updateScore = (field, value) => {
    updateDayData({ scores: { ...(dayData.scores || {}), [field]: value } });
  };

  const totalChecks = day.checklists.length;
  const checksCumpridos = day.checklists.filter(c => dayData.checks?.[c.id]).length;
  const allScored = day.scoreFields.every(f => dayData.scores?.[f.id] !== undefined);
  // Checklist livre — exige apenas que tenha registrado os scores
  const canComplete = allScored;

  return (
    <div style={{ padding: '24px 20px 80px' }}>
      <p style={{
        fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase',
        color: dayColor, margin: '0 0 8px', fontWeight: 500,
      }}>
        {day.label} · Relógio {day.relogio === 'corpo' ? 'do Corpo' : day.relogio === 'metabolismo' ? 'do Metabolismo' : 'da Mente'}
      </p>

      <h1 style={{
        fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 400,
        color: COLORS.carvao, margin: '0 0 24px',
        lineHeight: 1.15, letterSpacing: '-0.3px',
      }}>
        {day.title}
      </h1>

      <div style={{
        background: dayColorLight, padding: '6px 14px',
        borderRadius: '4px', display: 'inline-block',
        fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
        color: dayColorDeep, fontWeight: 600, marginBottom: '14px',
      }}>
        Modo rápido · Checklist
      </div>

      <div style={{ marginBottom: '16px' }}>
        {day.checklists.map(item => {
          const checked = dayData.checks?.[item.id];
          return (
            <div
              key={item.id} onClick={() => toggleCheck(item.id)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                padding: '14px 0', borderBottom: `1px solid ${COLORS.areia}`,
                cursor: 'pointer',
              }}
            >
              <div style={{
                flexShrink: 0, width: '22px', height: '22px',
                borderRadius: '4px', border: `1.5px solid ${dayColor}`,
                background: checked ? dayColor : COLORS.cremePuro,
                marginTop: '2px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}>
                {checked && (
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <path d="M2 6 L5 9 L10 3" stroke={COLORS.cremePuro} strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '15px', fontWeight: 500,
                  color: COLORS.carvao, margin: 0, lineHeight: 1.4,
                  textDecoration: checked ? 'line-through' : 'none',
                  opacity: checked ? 0.55 : 1,
                }}>
                  {item.text}
                </p>
                {item.detail && (
                  <p style={{
                    fontFamily: 'Georgia, serif', fontStyle: 'italic',
                    fontSize: '13px', color: COLORS.carvaoMuted,
                    margin: '4px 0 0', lineHeight: 1.4,
                  }}>
                    {item.detail}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicador de adesão honesta */}
      <div style={{
        background: checksCumpridos === totalChecks ? dayColorLight : COLORS.areiaSoft,
        padding: '10px 14px', borderRadius: '6px',
        marginBottom: '32px',
        border: `1px solid ${checksCumpridos === totalChecks ? dayColor : COLORS.areiaDeep}`,
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'Georgia, serif', fontStyle: 'italic',
          fontSize: '13px', color: checksCumpridos === totalChecks ? dayColorDeep : COLORS.carvaoSoft,
          margin: 0, lineHeight: 1.4,
        }}>
          {checksCumpridos === 0
            ? 'Nenhuma ação cumprida ainda hoje. Sem julgamento — registre o que for verdadeiro.'
            : checksCumpridos === totalChecks
              ? `Todas as ${totalChecks} ações cumpridas. Excelente.`
              : `${checksCumpridos} de ${totalChecks} ações cumpridas hoje. O que importa é a constância, não a perfeição.`}
        </p>
      </div>

      <div style={{
        background: COLORS.ocreLight, padding: '6px 14px',
        borderRadius: '4px', display: 'inline-block',
        fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
        color: COLORS.ocreDeep, fontWeight: 600, marginBottom: '14px',
      }}>
        Registro · Como você se sentiu
      </div>

      {day.scoreFields.map(field => (
        <div key={field.id} style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: COLORS.carvao, margin: '0 0 8px', fontWeight: 500 }}>
            {field.label}
          </p>
          <ScoreSelector
            value={dayData.scores?.[field.id]}
            onChange={(v) => updateScore(field.id, v)}
            color={dayColor}
          />
        </div>
      ))}

      <div style={{ marginTop: '20px' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: COLORS.carvao, marginBottom: '8px' }}>
          O que percebi de diferente hoje:
        </p>
        <textarea
          value={dayData.notes || ''}
          onChange={(e) => updateDayData({ notes: e.target.value })}
          rows={4} placeholder="Escreva livremente…"
          style={{
            width: '100%', padding: '12px', fontSize: '14px',
            border: `1px solid ${COLORS.areiaDeep}`, background: COLORS.cremePuro,
            borderRadius: '6px', fontFamily: 'inherit', color: COLORS.carvao,
            outline: 'none', resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      </div>

      {dayData.completed ? (
        <div style={{
          marginTop: '28px', padding: '16px',
          background: dayColorLight, borderRadius: '8px',
          borderLeft: `4px solid ${dayColor}`, textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'Georgia, serif', fontStyle: 'italic',
            fontSize: '15px', color: dayColorDeep, margin: 0, lineHeight: 1.5,
          }}>
            Dia {dayNum} concluído. {dayNum < 7 ? 'Continue amanhã.' : 'Você fechou o ciclo.'}
          </p>
        </div>
      ) : (
        <button
          onClick={() => {
            // Salvar adesão (X de Y cumpridos) junto com o dia
            updateDayData({
              completed: true,
              adesao: { cumpridos: checksCumpridos, total: totalChecks },
            });
            if (dayNum < 7) {
              setTimeout(() => goToDay(dayNum + 1), 300);
            }
          }}
          disabled={!canComplete}
          style={{
            marginTop: '28px', width: '100%', padding: '14px',
            background: canComplete ? dayColor : COLORS.areiaDeep,
            color: COLORS.cremePuro, border: 'none', borderRadius: '6px',
            fontSize: '15px', fontWeight: 500,
            cursor: canComplete ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit', letterSpacing: '0.3px',
          }}
        >
          {canComplete
            ? `Finalizar Dia ${dayNum} · ${checksCumpridos}/${totalChecks} cumpridos`
            : 'Registre como você se sentiu para finalizar'}
        </button>
      )}
    </div>
  );
}

function DayCalibration({ data, updateData, goToDay }) {
  const dayData = data.days?.[6] || {};

  const updateField = (field, value) => {
    const newDays = { ...(data.days || {}) };
    newDays[6] = { ...dayData, [field]: value };
    updateData({ ...data, days: newDays });
  };

  const analyzeRelogios = () => {
    const days = data.days || {};
    const corpoScores = [1, 2].flatMap(d => Object.values(days[d]?.scores || {})).filter(v => v !== undefined);
    const metabolismoScores = [3, 4].flatMap(d => Object.values(days[d]?.scores || {})).filter(v => v !== undefined);
    const menteScores = Object.values(days[5]?.scores || {}).filter(v => v !== undefined);

    const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    return {
      corpo: avg(corpoScores),
      metabolismo: avg(metabolismoScores),
      mente: avg(menteScores),
    };
  };

  const analysis = analyzeRelogios();
  const weakest = Object.entries(analysis).sort(([, a], [, b]) => a - b)[0];

  const recomendacoes = {
    corpo: ['Aumentar proteína no café da manhã (chegar a 25–30 g)', 'Garantir os 5 minutos de luz natural', 'Dormir 30 minutos mais cedo essa noite'],
    metabolismo: ['Aumentar proteína no almoço', 'Antecipar o lanche estratégico', 'Reduzir um café do dia', 'Revisar excesso de carboidrato'],
    mente: ['Reduzir prioridades de 3 para 2', 'Eliminar mais micro-decisões da manhã', 'Cortar 1 fonte de notificação', 'Revisar consumo de redes sociais'],
  };

  const labels = { corpo: 'Relógio do Corpo', metabolismo: 'Relógio do Metabolismo', mente: 'Relógio da Mente' };
  const colorMap = { corpo: COLORS.terracota, metabolismo: COLORS.salva, mente: COLORS.ocre };
  const colorMapLight = { corpo: COLORS.terracotaLight, metabolismo: COLORS.salvaLight, mente: COLORS.ocreLight };

  return (
    <div style={{ padding: '24px 20px 80px' }}>
      <p style={{
        fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase',
        color: COLORS.terracota, margin: '0 0 8px', fontWeight: 500,
      }}>
        Dia 6 · Ajuste fino
      </p>

      <h1 style={{
        fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 400,
        color: COLORS.carvao, margin: '0 0 16px', lineHeight: 1.15,
      }}>
        Calibrando os <em style={{ color: COLORS.terracota, fontWeight: 300 }}>3 Relógios</em>.
      </h1>

      <p style={{
        fontFamily: 'Georgia, serif', fontStyle: 'italic',
        fontSize: '15px', color: COLORS.carvaoSoft,
        marginBottom: '24px', lineHeight: 1.5,
      }}>
        Você tem 5 dias de dados sobre você. Hoje vamos lê-los juntas.
      </p>

      <p style={{
        fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
        color: COLORS.carvaoMuted, fontWeight: 500, marginBottom: '12px',
      }}>
        Sua média por relógio
      </p>

      {Object.entries(analysis).map(([key, value]) => (
        <div key={key} style={{
          background: colorMapLight[key], padding: '14px 16px',
          borderRadius: '8px', marginBottom: '10px',
          borderLeft: `4px solid ${colorMap[key]}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <p style={{ fontSize: '14px', fontWeight: 500, color: COLORS.carvao, margin: 0 }}>
            {labels[key]}
          </p>
          <p style={{
            fontFamily: 'Georgia, serif', fontSize: '20px',
            color: colorMap[key], margin: 0, fontWeight: 500,
          }}>
            {value.toFixed(1)}
          </p>
        </div>
      ))}

      <div style={{
        marginTop: '24px', padding: '20px',
        background: COLORS.cremePuro, borderRadius: '8px',
        border: `1px solid ${COLORS.areiaDeep}`,
      }}>
        <p style={{
          fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
          color: colorMap[weakest[0]], fontWeight: 600, marginBottom: '8px',
        }}>
          Onde reforçar amanhã
        </p>
        <p style={{
          fontFamily: 'Georgia, serif', fontSize: '18px',
          color: COLORS.carvao, margin: '0 0 12px', fontWeight: 500,
        }}>
          {labels[weakest[0]]}
        </p>
        <p style={{ fontSize: '13px', color: COLORS.carvaoSoft, marginBottom: '12px', lineHeight: 1.5 }}>
          Esse é o relógio com média mais baixa nos últimos dias. Foque em reforçá-lo no Dia 7.
        </p>
        {recomendacoes[weakest[0]].map((rec, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '6px 0',
          }}>
            <span style={{ color: colorMap[weakest[0]], fontWeight: 600 }}>→</span>
            <p style={{ fontSize: '13px', color: COLORS.carvaoSoft, margin: 0, lineHeight: 1.5 }}>
              {rec}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '28px' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: COLORS.carvao, marginBottom: '8px' }}>
          Onde percebi a maior melhora?
        </p>
        <textarea
          value={dayData.melhora || ''}
          onChange={(e) => updateField('melhora', e.target.value)}
          rows={3}
          style={{
            width: '100%', padding: '12px', fontSize: '14px',
            border: `1px solid ${COLORS.areiaDeep}`, background: COLORS.cremePuro,
            borderRadius: '6px', fontFamily: 'inherit', color: COLORS.carvao,
            outline: 'none', resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: COLORS.carvao, marginBottom: '8px' }}>
          O que ainda está difícil de manter?
        </p>
        <textarea
          value={dayData.dificuldade || ''}
          onChange={(e) => updateField('dificuldade', e.target.value)}
          rows={3}
          style={{
            width: '100%', padding: '12px', fontSize: '14px',
            border: `1px solid ${COLORS.areiaDeep}`, background: COLORS.cremePuro,
            borderRadius: '6px', fontFamily: 'inherit', color: COLORS.carvao,
            outline: 'none', resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      </div>

      <button
        onClick={() => {
          updateField('completed', true);
          setTimeout(() => goToDay(7), 300);
        }}
        style={{
          marginTop: '28px', width: '100%', padding: '14px',
          background: COLORS.terracota, color: COLORS.cremePuro,
          border: 'none', borderRadius: '6px',
          fontSize: '15px', fontWeight: 500,
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        Ir para o Dia 7 →
      </button>
    </div>
  );
}

function DayFinal({ data, updateData }) {
  const dayData = data.days?.[7] || {};
  const initial = data.initial || {};

  const updateField = (field, value) => {
    const newDays = { ...(data.days || {}) };
    newDays[7] = { ...dayData, [field]: value };
    updateData({ ...data, days: newDays });
  };

  const updateFinalScore = (field, value) => {
    updateField('scores', { ...(dayData.scores || {}), [field]: value });
  };

  const totalInitial = SCORE_FIELDS_INITIAL.reduce((acc, f) => acc + (initial.scores?.[f.id] || 0), 0);
  const totalFinal = SCORE_FIELDS_INITIAL.reduce((acc, f) => acc + (dayData.scores?.[f.id] || 0), 0);
  const allFinalScored = SCORE_FIELDS_INITIAL.every(f => dayData.scores?.[f.id] !== undefined);
  const diff = totalFinal - totalInitial;
  const diffPct = totalInitial > 0 ? Math.round((diff / totalInitial) * 100) : 0;

  return (
    <div style={{ padding: '24px 20px 80px' }}>
      <p style={{
        fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase',
        color: COLORS.terracota, margin: '0 0 8px', fontWeight: 500,
      }}>
        Dia 7 · Reavaliação
      </p>

      <h1 style={{
        fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 400,
        color: COLORS.carvao, margin: '0 0 16px', lineHeight: 1.15,
      }}>
        Sete dias <em style={{ color: COLORS.terracota, fontWeight: 300 }}>depois</em>.
      </h1>

      <p style={{
        fontFamily: 'Georgia, serif', fontStyle: 'italic',
        fontSize: '15px', color: COLORS.carvaoSoft,
        marginBottom: '24px', lineHeight: 1.5,
      }}>
        Repita a mesma avaliação do início. Sem olhar a anterior. Como você se sente agora.
      </p>

      {SCORE_FIELDS_INITIAL.map(field => (
        <div key={field.id} style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: COLORS.carvao, margin: '0 0 8px', fontWeight: 500 }}>
            {field.label}
          </p>
          <ScoreSelector
            value={dayData.scores?.[field.id]}
            onChange={(v) => updateFinalScore(field.id, v)}
          />
        </div>
      ))}

      {allFinalScored && (
        <div style={{
          marginTop: '32px', padding: '24px 20px',
          background: COLORS.cremePuro, borderRadius: '12px',
          border: `1px solid ${COLORS.terracota}`,
        }}>
          <p style={{
            fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
            color: COLORS.terracotaDeep, fontWeight: 600,
            margin: '0 0 16px', textAlign: 'center',
          }}>
            Sua transformação
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '11px', color: COLORS.carvaoMuted, margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Dia 0
              </p>
              <p style={{
                fontFamily: 'Georgia, serif', fontSize: '36px',
                color: COLORS.carvaoSoft, margin: '4px 0 0', fontWeight: 400,
              }}>
                {totalInitial}
              </p>
            </div>

            <div style={{ fontSize: '24px', color: COLORS.terracota }}>→</div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '11px', color: COLORS.terracota, margin: 0, letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
                Dia 7
              </p>
              <p style={{
                fontFamily: 'Georgia, serif', fontSize: '36px',
                color: COLORS.terracota, margin: '4px 0 0', fontWeight: 500,
              }}>
                {totalFinal}
              </p>
            </div>
          </div>

          <div style={{
            background: COLORS.terracotaLight, padding: '14px',
            borderRadius: '8px', textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'Georgia, serif', fontStyle: 'italic',
              fontSize: '15px', color: COLORS.terracotaDeep,
              margin: 0, lineHeight: 1.5,
            }}>
              {diff > 0
                ? `+${diff} pontos · Sua energia subiu ${diffPct}% em sete dias.`
                : diff === 0
                ? 'Mesma pontuação. Olhe os scores individuais — o crescimento pode estar no detalhe.'
                : `${diff} pontos. Vale revisar com mais calma na próxima rodada do protocolo.`}
            </p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <p style={{
              fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase',
              color: COLORS.carvaoMuted, fontWeight: 500, marginBottom: '12px',
            }}>
              Detalhe por indicador
            </p>
            {SCORE_FIELDS_INITIAL.map(field => {
              const v0 = initial.scores?.[field.id] || 0;
              const v7 = dayData.scores?.[field.id] || 0;
              const d = v7 - v0;
              return (
                <div key={field.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderBottom: `1px solid ${COLORS.areia}`,
                }}>
                  <p style={{ fontSize: '13px', color: COLORS.carvaoSoft, margin: 0, flex: 1 }}>
                    {field.label}
                  </p>
                  <p style={{ fontSize: '13px', color: COLORS.carvaoMuted, margin: 0, marginRight: '12px' }}>
                    {v0} → {v7}
                  </p>
                  <p style={{
                    fontSize: '13px', fontWeight: 600,
                    color: d > 0 ? COLORS.salva : d < 0 ? COLORS.terracota : COLORS.carvaoMuted,
                    margin: 0, minWidth: '32px', textAlign: 'right',
                  }}>
                    {d > 0 ? `+${d}` : d}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ marginTop: '32px' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: COLORS.carvao, marginBottom: '8px' }}>
          Onde a mudança foi mais clara?
        </p>
        <textarea
          value={dayData.mudanca || ''}
          onChange={(e) => updateField('mudanca', e.target.value)}
          rows={3}
          style={{
            width: '100%', padding: '12px', fontSize: '14px',
            border: `1px solid ${COLORS.areiaDeep}`, background: COLORS.cremePuro,
            borderRadius: '6px', fontFamily: 'inherit', color: COLORS.carvao,
            outline: 'none', resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: COLORS.carvao, marginBottom: '8px' }}>
          O que vou manter de agora em diante?
        </p>
        <textarea
          value={dayData.manter || ''}
          onChange={(e) => updateField('manter', e.target.value)}
          rows={3}
          style={{
            width: '100%', padding: '12px', fontSize: '14px',
            border: `1px solid ${COLORS.areiaDeep}`, background: COLORS.cremePuro,
            borderRadius: '6px', fontFamily: 'inherit', color: COLORS.carvao,
            outline: 'none', resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      </div>

      {allFinalScored && (
        <div style={{ marginTop: '32px', padding: '24px 20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS.terracota }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS.salva }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS.ocre }} />
          </div>
          <p style={{
            fontFamily: 'Georgia, serif', fontStyle: 'italic',
            fontSize: '20px', color: COLORS.carvao,
            lineHeight: 1.4, margin: '0 0 12px',
          }}>
            Você nunca foi o problema —<br />
            era só o sistema que estava<br />
            <em style={{ color: COLORS.terracota, fontWeight: 500 }}>desregulado</em>.
          </p>
          <p style={{
            fontFamily: 'Georgia, serif', fontStyle: 'italic',
            fontSize: '14px', color: COLORS.terracota, margin: 0,
          }}>
            — Ailin
          </p>
        </div>
      )}
    </div>
  );
}

// ============ APP PRINCIPAL ============

// =============================================================
// APP PRINCIPAL — com integração Plus
// =============================================================
export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [isPlus, setIsPlus] = useState(false);
  const [data, setData] = useState({ initial: {}, days: {}, sosUsage: [] });
  const [currentDay, setCurrentDay] = useState(0);
  const [loading, setLoading] = useState(true);

  // Estado SOS
  const [sosOpen, setSosOpen] = useState(false);
  const [jornadaOpen, setJornadaOpen] = useState(false);
  const [protocoloSelecionado, setProtocoloSelecionado] = useState(null);
  const [timerAtivo, setTimerAtivo] = useState(false);
  const [protocoloCompleto, setProtocoloCompleto] = useState(null);

  useEffect(() => {
    const saved = loadData();
    if (saved) {
      setData(saved);
      const days = saved.days || {};
      const completedDays = Object.keys(days).map(Number).filter(d => days[d].completed);
      const lastDay = completedDays.length ? Math.max(...completedDays) : 0;
      setCurrentDay(saved.initial?.completed ? Math.min(lastDay + 1, 7) : 0);
      if (saved.unlocked) {
        setUnlocked(true);
        setIsPlus(saved.isPlus || false);
      }
    }
    setLoading(false);
  }, []);

  const updateData = (newData) => {
    setData(newData);
    saveData({ ...newData, unlocked: true, isPlus });
  };

  const handleUnlock = (plus) => {
    setUnlocked(true);
    setIsPlus(plus);
    saveData({ ...data, unlocked: true, isPlus: plus });
  };

  const handleSelectProtocolo = (protocolo) => {
    setProtocoloSelecionado(protocolo);
  };

  const handleIniciarTimer = () => {
    setTimerAtivo(true);
  };

  const handleTimerComplete = () => {
    // Salvar uso no histórico
    const usage = {
      protocoloId: protocoloSelecionado.id,
      titulo: protocoloSelecionado.titulo,
      relogio: protocoloSelecionado.relogio,
      timestamp: new Date().toISOString(),
    };
    const newSosUsage = [...(data.sosUsage || []), usage];
    const newData = { ...data, sosUsage: newSosUsage };
    updateData(newData);

    setTimerAtivo(false);
    setProtocoloCompleto(protocoloSelecionado);
  };

  const handleFecharCompleto = () => {
    setProtocoloCompleto(null);
    setProtocoloSelecionado(null);
    setSosOpen(false);
  };

  const handleCancelarTimer = () => {
    setTimerAtivo(false);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: COLORS.creme,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: COLORS.terracota }}>
          Carregando…
        </p>
      </div>
    );
  }

  if (!unlocked) {
    return <AccessGate onUnlock={handleUnlock} />;
  }

  return (
    <div style={{
      minHeight: '100vh', background: COLORS.creme,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      maxWidth: '480px', margin: '0 auto',
    }}>
      <Header data={data} currentDay={currentDay} />
      <DayNav currentDay={currentDay} setCurrentDay={setCurrentDay} data={data} />

      {currentDay === 0 && (
        <DayInitial data={data} updateData={updateData} goToDay={setCurrentDay} />
      )}

      {currentDay >= 1 && currentDay <= 5 && (
        <DayPage dayNum={currentDay} data={data} updateData={updateData} goToDay={setCurrentDay} />
      )}

      {currentDay === 6 && (
        <DayCalibration data={data} updateData={updateData} goToDay={setCurrentDay} />
      )}

      {currentDay === 7 && (
        <DayFinal data={data} updateData={updateData} />
      )}

      <div style={{
        textAlign: 'center', padding: '20px',
        fontSize: '11px', color: COLORS.carvaoMuted,
        letterSpacing: '0.5px',
      }}>
        © Ailin Orioni · Protocolo Livre do Cansaço 7D™
        {isPlus && <span style={{ color: COLORS.terracota, fontWeight: 600 }}> · Plus</span>}
      </div>

      {/* JORNADA: Botão flutuante (todas as compradoras) */}
      {!sosOpen && !jornadaOpen && !protocoloSelecionado && !timerAtivo && !protocoloCompleto && (
        <JornadaFloatingButton onClick={() => setJornadaOpen(true)} />
      )}

      {/* JORNADA: Tela de histórico/insights */}
      {jornadaOpen && (
        <JornadaScreen
          data={data}
          isPlus={isPlus}
          onClose={() => setJornadaOpen(false)}
        />
      )}

      {/* PLUS: Botão flutuante de SOS */}
      {isPlus && !sosOpen && !jornadaOpen && !protocoloSelecionado && !timerAtivo && !protocoloCompleto && (
        <SOSFloatingButton onClick={() => setSosOpen(true)} />
      )}

      {/* PLUS: Tela de SOS — grade de sintomas */}
      {isPlus && sosOpen && !protocoloSelecionado && (
        <SOSScreen
          onSelectProtocolo={handleSelectProtocolo}
          onClose={() => setSosOpen(false)}
        />
      )}

      {/* PLUS: Detalhe de protocolo (antes do timer) */}
      {isPlus && protocoloSelecionado && !timerAtivo && !protocoloCompleto && (
        <ProtocoloDetalhe
          protocolo={protocoloSelecionado}
          onIniciarTimer={handleIniciarTimer}
          onVoltar={() => setProtocoloSelecionado(null)}
        />
      )}

      {/* PLUS: Timer ativo */}
      {isPlus && timerAtivo && protocoloSelecionado && (
        <TimerProtocolo
          protocolo={protocoloSelecionado}
          onComplete={handleTimerComplete}
          onCancel={handleCancelarTimer}
        />
      )}

      {/* PLUS: Tela de protocolo completo */}
      {isPlus && protocoloCompleto && (
        <ProtocoloCompleto
          protocolo={protocoloCompleto}
          onFechar={handleFecharCompleto}
        />
      )}
    </div>
  );
}
