// Configuração institucional. Ajuste aqui horários, ambientes e rodízio sem tocar no código.
window.PRIME = window.PRIME || { months: {} };

PRIME.config = {
  escola: 'Prime Enfant Bilingual School',
  ano: 2027,

  temaAno: {
    titulo: 'Raízes e Mundo',
    subtitulo: 'De Pernambuco para o mundo',
    status: 'Proposta para a Expo Prime 2027 (a confirmar pela direção)',
    // shortcut: tema proposto; trocar quando a direção definir o tema oficial da Expo Prime 2027.
    descricao: 'O primeiro ano do programa bilíngue convida as crianças a conhecer bem as próprias raízes (quem sou, minha família, minha escola, minha cidade, Pernambuco) para depois se abrir ao mundo, em português e em inglês. Cada mês aprofunda um anel desse caminho, e as produções do ano formam a Expo Prime de novembro.',
    meses: [
      ['Fevereiro', 'Chegada e vínculos'], ['Março', 'Eu, minha escola, minha cidade'], ['Abril', 'Natureza e planeta'],
      ['Maio', 'Famílias e comunidade'], ['Junho', 'Pernambuco em festa'], ['Agosto', 'Histórias e folclore'],
      ['Setembro', 'Corpo, movimento e jogos'], ['Outubro', 'Infâncias do mundo'], ['Novembro', 'Expo Prime: Raízes e Mundo'],
      ['Dezembro', 'Celebrações e despedidas'],
    ],
  },

  pilares: [
    { id: 'bncc', titulo: 'Plano de aula alinhado à BNCC', texto: 'Todas as aulas citam os objetivos de aprendizagem e desenvolvimento da BNCC. O painel BNCC mostra quais objetivos já foram trabalhados para garantir que todos sejam contemplados ao longo do ano.' },
    { id: 'tema', titulo: 'Tema do ano', texto: 'O tema da Expo Prime costura os meses: cada semana tem um tema que conversa com ele, nas duas línguas.' },
    { id: 'calendario', titulo: 'Calendário de eventos', texto: 'Eventos internos e datas relevantes do calendário internacional aparecem no mês e em cada dia, com sugestão de como entram na rotina.' },
    { id: 'maker', titulo: 'Projeto maker mensal', texto: 'Um projeto por mês, mais elaborado, de baixo custo, feito em etapas ao longo das semanas, com lista objetiva de materiais.' },
  ],

  // Rodízio do LK3: ambiente de cada dia da semana (1 = segunda ... 5 = sexta).
  // shortcut: rodízio fixo por dia da semana; trocar por mapa por data quando a grade real da coordenação existir.
  rodizio: { LK3: { 1: 'story', 2: 'lab', 3: 'numbers', 4: 'movement', 5: 'atelier' } },

  // Horários do LK3 conforme a Matriz Curricular 2027 (15h PT + 15h EN).
  horarios: {
    LK3: {
      manhaEN: { ini: '07:30', fim: '08:30', lingua: 'en', reg: 'Professora de inglês' },
      manhaPT: { ini: '08:30', fim: '11:30', lingua: 'pt', reg: 'Pedagoga' },
      tardeEN: { ini: '13:00', fim: '15:30', lingua: 'en', reg: 'Professora de inglês', dias: [1, 2, 3, 4] },
    },
  },

  // Roteiro de cada bloco. O plano do dia preenche os momentos com chave (convite, roda, principal, segunda, fechamento).
  // As propostas principal e segunda ocupam o intervalo até o momento seguinte e são divididas em fases curtas.
  roteiros: {
    manhaEN: [['07:30', 'Morning invitation', 'convite'], ['07:50', 'Hello circle', 'roda'], ['08:00', 'principal', 'principal'], ['08:25', 'Transition', 'Despedida da professora de inglês e passagem para a pedagoga: “See you later!”']],
    manhaPT: [['08:30', 'Chamada e roda', 'roda'], ['08:45', 'principal', 'principal'], ['09:35', 'Lanche e higiene', 'Autonomia: servir-se, conversar à mesa, lavar as mãos.'], ['10:00', 'Parque', 'Brincadeira livre com observação e registro da professora.'], ['10:30', 'segunda', 'segunda'], ['11:15', 'Roda de encerramento', 'fechamento']],
    tardeEN: [['13:00', 'Circle time', 'roda'], ['13:15', 'principal', 'principal'], ['14:05', 'Snack and hygiene', 'Lanche com linguagem de rotina: “Would you like some more?”, “Wash your hands.”'], ['14:25', 'segunda', 'segunda'], ['15:10', 'Story and goodbye', 'fechamento']],
  },

  // Referência de atenção para planejar as fases (crianças de 3 anos).
  atencao: 'Crianças de 3 anos sustentam de 5 a 10 minutos de atenção dirigida em uma mesma tarefa. Por isso cada proposta longa é dividida em fases que alternam escutar, mover o corpo, fazer com as mãos e compartilhar. A professora observa a turma e encurta ou estende cada fase conforme o envolvimento.',

  ambientes: {
    story: { nome: 'Story Room', cor: '#5553A1', icone: 'book', recursos: ['Livros infantis [E]', 'Cartões de apoio [E]', 'Almofadas [E]', 'Mesas e cadeiras [E]', 'Fantoches de mão (6) [A]', 'Dedoches (16) [A]', 'Microfone [A]', 'Caixa misteriosa [C]'] },
    lab: { nome: 'Discovery Lab', cor: '#2E86C1', icone: 'flask', recursos: ['Pinças [A]', 'Béqueres graduados [A]', 'Pipetas [A]', 'Funis [A]', 'Tigelas grandes e pequenas [A]', 'Balança de dois pratos [A]', 'Lanternas LED (20) [A]', 'Ímãs (8) [A]'] },
    numbers: { nome: 'Numbers Room', cor: '#349B64', icone: 'hash', recursos: ['Mural numérico 0–10 [A]', 'Blocos [A]', 'Dados (2) [A]', 'Number Path [A]', 'Dominó gigante [A]', 'Quebra-cabeças [A]', 'Jogo de encaixe [A]', 'Fitas métricas (2) [A]', 'Réguas (5) [A]', 'Balança [A]', 'Jogo de contar [A]'] },
    movement: { nome: 'Movement Studio', cor: '#F29325', icone: 'run', recursos: ['Cones [E]', 'Bambolês [E]', 'Argolas e jogo de argolas [A]', 'Boliche infantil [A]', 'Tapetes para dinâmicas [A]', 'Bolas de ventosa [A]'] },
    atelier: { nome: 'Creative Atelier', cor: '#D9A72E', icone: 'palette', recursos: ['Tintas, pincéis, rolinhos, esponjas [E]', 'Papéis diversos e cartolinas [E]', 'Tesouras [E]', 'Materiais de papelaria [E]', 'Portfólios [E]', 'Carimbos [A]'] },
  },

  legendaMateriais: { E: 'Existente na escola', A: 'Aquisição prevista: confirmar compra', C: 'Confecção própria ou reaproveitado' },
  turmas: [
    { id: 'LK3', nome: 'LK3', idade: '3 anos', ativo: true },
    { id: 'LK1', nome: 'LK1', idade: '1 ano', ativo: false },
    { id: 'LK2', nome: 'LK2', idade: '2 anos', ativo: false },
    { id: 'K4', nome: 'K4', idade: '4 anos', ativo: false },
    { id: 'K5', nome: 'K5', idade: '5 anos', ativo: false },
  ],
};
