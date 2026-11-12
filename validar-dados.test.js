// Valida os dados do planejamento. Rodar com: npm test
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const ctx = { window: {} };
vm.createContext(ctx);
const MESES = ['2027-02', '2027-03'];
for (const f of ['data/config.js', 'data/bncc-ei02.js', 'data/calendario-2027.js', ...MESES.map((m) => `data/lk3/${m}.js`)]) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8').replace(/^window\.PRIME/m, 'var PRIME = window.PRIME'), ctx);
}
const { config, bncc, calendario, months } = ctx.PRIME;
const meses = MESES.map((m) => months['LK3-' + m]);
const todosDias = meses.flatMap((m) => m.dias);
const semAula = new Set(calendario.filter((e) => e.tipo === 'semaula' || e.tipo === 'feriado').map((e) => e.data));
const iso = (d) => d.toISOString().slice(0, 10);
const min = (h) => { const [a, b] = h.split(':').map(Number); return a * 60 + b; };

for (const mes of meses) test(`todo dia letivo de ${mes.mes} tem plano, e só dia letivo`, () => {
  const esperados = [];
  const m0 = Number(mes.mes.slice(5)) - 1;
  // o ano letivo começa em 01/02
  for (let d = new Date(mes.mes + '-01T12:00:00Z'); d.getUTCMonth() === m0; d.setUTCDate(d.getUTCDate() + 1)) {
    const wd = d.getUTCDay();
    if (wd >= 1 && wd <= 5 && !semAula.has(iso(d))) esperados.push(iso(d));
  }
  assert.deepStrictEqual([...mes.dias.map((d) => d.data)], esperados);
});

test('feriados de fevereiro e março marcados como feriado', () => {
  const fer = calendario.filter((e) => e.tipo === 'feriado').map((e) => e.data);
  for (const d of ['2027-02-08', '2027-02-09', '2027-02-10', '2027-03-26']) assert.ok(fer.includes(d), d);
});

test('fases ocupam o tempo disponível de cada proposta', () => {
  const dur = {};
  for (const [b, passos] of Object.entries(config.roteiros)) {
    const fim = min(config.horarios.LK3[b].fim);
    passos.forEach(([h, , k], i) => { if (k === 'principal' || k === 'segunda') dur[b + k] = (passos[i + 1] ? min(passos[i + 1][0]) : fim) - min(h); });
  }
  for (const dia of todosDias) for (const b of ['manhaEN', 'manhaPT', 'tardeEN']) {
    const s = dia[b]; if (!s) continue;
    if (b === 'manhaEN') assert.ok(s.convite, `${dia.data} sem convite`);
    for (const k of ['principal', 'segunda']) {
      if (!s[k]) continue;
      const total = s[k].fases.reduce((a, f) => a + f[0], 0);
      const disp = dur[b + k];
      assert.ok(total <= disp && total >= disp - 10, `${dia.data} ${b}.${k}: ${total} de ${disp} min`);
    }
  }
});

test('blocos certos por dia e horários de PT e EN sem sobreposição', () => {
  const h = config.horarios.LK3;
  for (const dia of todosDias) {
    const wd = new Date(dia.data + 'T12:00:00Z').getUTCDay();
    const blocos = ['manhaEN', 'manhaPT'].concat(h.tardeEN.dias.includes(wd) ? ['tardeEN'] : []);
    assert.deepStrictEqual(Object.keys(dia).filter((k) => h[k]), blocos, dia.data);
    const faixas = blocos.map((b) => [min(h[b].ini), min(h[b].fim)]).sort((a, b) => a[0] - b[0]);
    for (let i = 1; i < faixas.length; i++) assert.ok(faixas[i][0] >= faixas[i - 1][1], dia.data + ' sobreposição');
  }
});

test('códigos BNCC existem e todo bloco tem conteúdo mínimo', () => {
  for (const dia of todosDias) for (const b of ['manhaEN', 'manhaPT', 'tardeEN']) {
    const s = dia[b]; if (!s) continue;
    assert.ok(s.titulo && s.principal && s.principal.d && s.bncc.length, `${dia.data} ${b}`);
    if (b !== 'manhaEN') assert.ok(s.segunda && s.segunda.d, `${dia.data} ${b} sem segunda proposta`);
    for (const c of s.bncc) assert.ok(bncc.objetivos[c], `${dia.data} código inválido ${c}`);
  }
});

test('nenhum momento de soneca ou descanso', () => {
  const texto = MESES.map((m) => fs.readFileSync(path.join(root, `data/lk3/${m}.js`), 'utf8')).join('') + JSON.stringify(config.roteiros);
  assert.doesNotMatch(texto, /soneca|descanso|dormir|quiet time|\bnap\b|\brest\b/i);
});

for (const mes of meses) test(`cobertura BNCC de ${mes.mes}`, () => {
  const usados = new Set(mes.dias.flatMap((d) => ['manhaEN', 'manhaPT', 'tardeEN'].flatMap((b) => (d[b] ? d[b].bncc : []))));
  const faltam = Object.keys(bncc.objetivos).filter((c) => !usados.has(c));
  console.log(`Cobertura EI02 em ${mes.mes}: ${usados.size}/${Object.keys(bncc.objetivos).length}` + (faltam.length ? ` | faltam: ${faltam.join(', ')}` : ''));
  if (mes.mes === '2027-03') assert.deepStrictEqual(faltam, []);
});
