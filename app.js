// Planejamento Prime Enfant — renderização das telas a partir de window.PRIME (pasta data/).
(() => {
  const { config, bncc, calendario, months } = window.PRIME;
  const state = { turma: 'LK3', mes: '2027-02' };
  const nomes = ['Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const nums = ['02', '03', '04', '05', '06', '08', '09', '10', '11', '12'];
  const plan = () => months[`${state.turma}-${state.mes}`];
  // Todos os dias planejados da turma, em ordem, para navegar entre meses.
  const allDays = () => Object.values(months).filter((m) => m.turma === state.turma).flatMap((m) => m.dias).sort((a, b) => a.data.localeCompare(b.data));

  // ---------- utilitários ----------
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (id) => document.getElementById(id);
  const parse = (iso) => new Date(iso + 'T12:00:00');
  const WD = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const MES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const dm = (iso) => iso.slice(8, 10) + '/' + iso.slice(5, 7);
  const longDate = (iso) => { const d = parse(iso); return `${WD[d.getDay()]}, ${d.getDate()} de ${MES[d.getMonth()]}`; };
  const hhmm = (t) => t.replace(/^0/, '').replace(':', 'h');
  const room = (iso) => config.ambientes[config.rodizio[state.turma][parse(iso).getDay()]];
  const eventsOn = (iso) => calendario.filter((e) => e.data === iso);
  const BLOCOS = ['manhaEN', 'manhaPT', 'tardeEN'];
  // Material com marcador [E], [A], [C] ou [A/C] vira etiqueta colorida.
  const material = (m) => esc(m).replace(/\s*\[([EAC](?:\/[EAC])?)\]$/, (_, s) => s.split('/').map((k) => `<span class="st ${k}" title="${esc(config.legendaMateriais[k])}">${k}</span>`).join(''));

  const ICONS = {
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M8 7h8"/>',
    flask: '<path d="M9 3h6"/><path d="M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 14h9"/>',
    hash: '<path d="M5 9h14M5 15h14M10 3 8 21M16 3l-2 18"/>',
    run: '<circle cx="14" cy="4.5" r="1.8"/><path d="M8 21l3-6 3 2v5"/><path d="M6 12l3-4h5l3 4"/><path d="M11 15l1-7"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.6-1.6 0-1.4-1.2-1.6-1.2-2.8 0-1 .8-1.6 1.8-1.6H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    day: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><rect x="8" y="13" width="4" height="4" rx="1"/>',
    tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-.6-.6-2.6z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    left: '<path d="M15 18l-6-6 6-6"/>', right: '<path d="M9 18l6-6-6-6"/>',
    print: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  };
  const ic = (n) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
  const dots = '<div class="dots"><i style="background:var(--purple)"></i><i style="background:var(--green)"></i><i style="background:var(--yellow)"></i><i style="background:var(--orange)"></i><i style="background:var(--blue)"></i></div>';
  const roomTag = (r) => `<span class="tag room" style="background:${r.cor}">${ic(r.icone)}${esc(r.nome)}</span>`;
  const evTag = (e) => `<span class="tag ev ${e.tipo}" title="${esc(e.nota || '')}">${esc(e.titulo)}${e.confirmar ? ' (a confirmar)' : ''}</span>`;

  // ---------- telas ----------
  function viewMonth() {
    const p = plan();
    const [y, m] = state.mes.split('-').map(Number);
    const planned = new Map(p.dias.map((d) => [d.data, d]));
    const today = new Date().toISOString().slice(0, 10);
    const weeks = p.semanas.map((w) => {
      const cells = [];
      const start = parse(w.inicio); start.setDate(start.getDate() - (start.getDay() - 1));
      for (let i = 0; i < 5; i++) {
        const d = new Date(start); d.setDate(start.getDate() + i);
        const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const evs = eventsOn(iso);
        const head = `<div class="num">${d.getDate()}<small>${WD[d.getDay()].slice(0, 3)}</small></div>`;
        if (d.getMonth() + 1 !== m) { cells.push(`<div class="day off">${head}</div>`); continue; }
        const dia = planned.get(iso);
        if (!dia) {
          const off = evs.find((e) => e.tipo === 'feriado') ? 'Feriado' : evs.find((e) => e.tipo === 'semaula') ? 'Recesso' : '';
          cells.push(`<div class="day off${off ? ' holiday' : ''}">${head}${off ? `<span class="off-label">${off}</span>` : ''}${evs.map(evTag).join('')}</div>`); continue;
        }
        const r = room(iso);
        const slots = BLOCOS.filter((b) => dia[b]).map((b) => `<div class="slot"><span class="lang ${config.horarios[state.turma][b].lingua}">${config.horarios[state.turma][b].lingua.toUpperCase()}</span>${esc(dia[b].titulo)}</div>`).join('');
        cells.push(`<a class="day${iso === today ? ' today' : ''}" href="#dia-${iso}">${head}<div class="bar" style="background:${r.cor}"></div><span class="tag room" style="background:${r.cor};align-self:flex-start">${ic(r.icone)}${esc(r.nome)}</span>${slots}${evs.map(evTag).join('')}</a>`);
      }
      return `<section class="week"><div class="week-head"><span class="kicker">Semana ${w.n} · ${dm(w.inicio)} a ${dm(w.fim)}</span><h2>${esc(w.tema)}</h2><span class="en">${esc(w.temaEN)}</span><p>${esc(w.foco)}</p></div><div class="grid5">${cells.join('')}</div></section>`;
    }).join('');
    return `<div class="page-head"><div>${dots}<div class="kicker">${esc(state.turma)} · ${esc(config.temaAno.titulo)}</div><h1>${esc(p.titulo)} de ${y}</h1><p class="lead">${esc(p.eixo)}. Clique em um dia para ver o plano completo das aulas em português e em inglês.</p></div>
      <a class="btn" href="#maker">${ic('tool')}Projeto maker: ${esc(p.maker.titulo)}</a></div>
      <div class="legend">${Object.values(config.ambientes).map((r) => `<span><i class="sw" style="background:${r.cor}"></i>${esc(r.nome)}</span>`).join('')}<span><span class="lang en">EN</span> professora de inglês</span><span><span class="lang pt">PT</span> pedagoga</span></div><br>${weeks}`;
  }

  const fasesHtml = (fases) => `<ol class="fases">${fases.map(([min, t, d]) => `<li><span class="min">${min} min</span><div><b>${esc(t)}</b><p>${esc(d)}</p></div></li>`).join('')}</ol>`;
  function stepsFor(bloco, s) {
    return config.roteiros[bloco].map(([t, nome, txt]) => {
      const key = nome === 'principal' || nome === 'segunda';
      const item = key ? s[nome] : null;
      if (key && !item) return '';
      const titulo = key ? item.t : nome;
      const texto = key ? item.d : ({ roda: s.roda, fechamento: s.fechamento || '', convite: s.convite || '' }[txt] ?? txt);
      return `<div class="step${key ? ' key' : ''}"><time>${hhmm(t)}</time><div><b>${esc(titulo)}</b><p>${esc(texto)}</p>${key && item.fases ? fasesHtml(item.fases) : ''}</div></div>`;
    }).join('');
  }

  function viewDay(iso) {
    const p = plan();
    const idx = p.dias.findIndex((d) => d.data === iso);
    if (idx < 0) return `<div class="panel"><h2>Dia sem plano</h2><p>${esc(longDate(iso))} não é um dia letivo deste mês ou ainda não foi planejado.</p><a class="btn" href="#mes-${state.mes}">Voltar ao mês</a></div>`;
    const dia = p.dias[idx];
    const r = room(iso);
    const w = p.semanas.find((s) => s.n === dia.semana);
    const h = config.horarios[state.turma];
    const todos = allDays(), j = todos.findIndex((d) => d.data === iso);
    const prev = todos[j - 1], next = todos[j + 1];
    const evs = eventsOn(iso);
    const etapa = p.maker.etapas.find((e) => e.data === iso);

    // Barra do dia: 7h30 a 15h30 em blocos de 30 minutos.
    const half = (t) => { const [a, b] = t.split(':').map(Number); return (a * 60 + b - 450) / 30; };
    const segs = [];
    for (const b of BLOCOS) if (dia[b]) segs.push({ ini: half(h[b].ini), fim: half(h[b].fim), cls: 't-' + h[b].lingua, txt: `${h[b].lingua.toUpperCase()} · ${dia[b].titulo}`, href: '#b-' + b });
    if (dia.tardeEN) segs.push({ ini: half('11:30'), fim: half('13:00'), cls: 't-off', txt: 'Almoço' });
    segs.sort((a, b) => a.ini - b.ini);
    const bar = segs.map((s) => `<div class="${s.cls}" style="grid-column:${s.ini + 1} / ${s.fim + 1}" title="${esc(s.txt)}"><span>${esc(s.txt)}</span></div>`).join('');

    const blocks = BLOCOS.filter((b) => dia[b]).map((b) => {
      const s = dia[b], hb = h[b];
      const codes = s.bncc.map((c) => `<details class="bncc"><summary><span><span class="c-${c.slice(4, 6)}">${c}</span><small>${esc(bncc.campos[c.slice(4, 6)])}</small></span></summary><p>${esc(bncc.objetivos[c])}</p></details>`).join('');
      const mats = s.materiais.length ? `<ul class="clean">${s.materiais.map((m) => `<li>${material(m)}</li>`).join('')}</ul>` : '<p class="lead" style="margin:0">Nenhum material além do corpo e da voz.</p>';
      return `<article class="block ${hb.lingua}" id="b-${b}">
        <div class="block-head"><span class="time">${hhmm(hb.ini)}–${hhmm(hb.fim)}</span><span class="lang ${hb.lingua}">${hb.lingua === 'en' ? 'ENGLISH' : 'PORTUGUÊS'}</span><span class="who">${esc(hb.reg)}</span><h2>${esc(s.titulo)}</h2></div>
        <div class="block-body"><div class="steps"><h3>Roteiro</h3>${stepsFor(b, s)}</div>
        <div class="side"><section><h3>Objetivos da BNCC</h3>${codes}</section><section><h3>Materiais</h3>${mats}</section>
        ${s.vocab ? `<section><h3>Vocabulário</h3><div class="vocab">${s.vocab.split(',').map((v) => `<span>${esc(v.trim())}</span>`).join('')}</div></section>` : ''}
        <section><h3>O que observar</h3><ul class="clean check">${(s.observar || []).map((o) => `<li>${esc(o)}</li>`).join('')}</ul></section></div></div></article>`;
    }).join('');

    return `<div class="day-top"><div>${dots}<div class="kicker">Semana ${w.n} · ${esc(w.tema)} · ${esc(w.temaEN)}</div><h1>${esc(longDate(iso))}</h1>
      <div class="meta">${roomTag(r)}<span class="tag" style="background:var(--soft)">${esc(state.turma)}</span>${evs.map(evTag).join('')}</div></div>
      <div class="pager">${prev ? `<a class="btn" href="#dia-${prev.data}" aria-label="Dia anterior">${ic('left')}${dm(prev.data)}</a>` : ''}${next ? `<a class="btn" href="#dia-${next.data}" aria-label="Próximo dia">${dm(next.data)}${ic('right')}</a>` : ''}</div></div>
      ${dia.evento ? `<div class="notice">${esc(dia.evento)}</div>` : ''}
      ${etapa ? `<div class="notice maker"><b>Projeto maker do mês:</b> ${esc(etapa.titulo)}. <a href="#maker">Ver materiais e montagem</a></div>` : ''}
      <div class="timeline" aria-hidden="true">${bar}</div><div class="timeline-scale"><span>7h30</span><span>9h30</span><span>11h30</span><span>13h30</span><span>15h30</span></div>
      <details class="bncc" style="margin-bottom:18px"><summary>Recursos do ${esc(r.nome)}</summary><p>${r.recursos.map(material).join(' · ')}</p></details>
      ${blocks}`;
  }

  function viewMaker() {
    const mk = plan().maker;
    return `<div class="hero orange">${dots}<div class="kicker" style="color:#fff">Projeto maker de ${esc(plan().titulo.toLowerCase())}</div><h1>${esc(mk.titulo)}</h1><p><i>${esc(mk.tituloEN)}</i></p><p>${esc(mk.resumo)}</p></div>
      <div class="two"><div class="panel"><h2>Materiais</h2><ul class="clean check">${mk.materiais.map((m) => `<li>${material(m)}</li>`).join('')}</ul><p class="lead">${esc(mk.custo)}</p></div>
      <div class="panel"><h2>Etapas no mês</h2>${mk.etapas.map((e) => `<a class="etapa" href="#dia-${e.data}-${e.bloco}"><span class="d">${dm(e.data)}</span><span><b>${esc(e.titulo)}</b>${esc(e.texto)}</span></a>`).join('')}</div></div>
      <div class="two"><div class="panel"><h2>Montagem</h2><ol class="steps-list">${mk.montagem.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></div>
      <div class="panel"><h2>Segurança</h2><p>${esc(mk.seguranca)}</p><h2 style="margin-top:18px">BNCC</h2>${mk.bncc.map((c) => `<details class="bncc"><summary><span class="c-${c.slice(4, 6)}">${c}</span></summary><p>${esc(bncc.objetivos[c])}</p></details>`).join('')}</div></div>`;
  }

  function viewBncc() {
    const p = plan();
    const uses = {};
    for (const d of p.dias) for (const b of BLOCOS) if (d[b]) for (const c of d[b].bncc) (uses[c] = uses[c] || []).push([d.data, b]);
    const all = Object.keys(bncc.objetivos);
    const done = all.filter((c) => uses[c]).length;
    const camps = Object.entries(bncc.campos).map(([k, nome]) => {
      const list = all.filter((c) => c.slice(4, 6) === k);
      const rows = list.map((c) => {
        const u = uses[c] || [];
        const days = [...new Set(u.map(([d]) => d))];
        return `<div class="bn-row"><code class="c-${k}">${c}</code><div><p>${esc(bncc.objetivos[c])}</p><div class="bn-days">${days.map((d) => `<a href="#dia-${d}">${dm(d)}</a>`).join('')}</div></div><span class="count${u.length ? '' : ' zero'}">${u.length}</span></div>`;
      }).join('');
      const n = list.filter((c) => uses[c]).length;
      return `<section class="panel"><h2 class="c-${k}">${esc(nome)}</h2><div class="progress"><i style="width:${(n / list.length) * 100}%"></i></div><p class="lead" style="margin:0 0 6px">${n} de ${list.length} objetivos trabalhados no mês</p>${rows}</section>`;
    }).join('');
    return `<div class="page-head"><div>${dots}<div class="kicker">Pilar 1 · BNCC</div><h1>Objetivos da BNCC</h1><p class="lead">Faixa EI02 (crianças bem pequenas). O número indica quantas vezes o objetivo aparece nos planos de ${esc(p.titulo.toLowerCase())}; clique na data para abrir a aula. A meta é que todos os objetivos sejam trabalhados ao longo do ano.</p></div>
      <div class="panel" style="min-width:220px;margin:0"><b style="font-size:28px;font-family:'Roboto Slab'">${done}/${all.length}</b><div class="progress"><i style="width:${(done / all.length) * 100}%"></i></div><span class="lead" style="margin:0">objetivos em ${esc(p.titulo.toLowerCase())}</span></div></div>${camps}`;
  }

  let calFilter = 'todos';
  function viewCalendar() {
    const tipos = { todos: 'Todos', interno: 'Eventos da escola', feriado: 'Feriados', semaula: 'Recesso', internacional: 'Internacionais', cultural: 'Cultura brasileira' };
    const list = calendario.filter((e) => calFilter === 'todos' || e.tipo === calFilter);
    const byMonth = {};
    for (const e of list) (byMonth[e.data.slice(5, 7)] = byMonth[e.data.slice(5, 7)] || []).push(e);
    const planned = new Set(allDays().map((d) => d.data));
    return `<div class="page-head"><div>${dots}<div class="kicker">Pilar 3 · Calendário</div><h1>Calendário 2027</h1><p class="lead">Eventos internos, feriados, recessos e datas do calendário internacional e da cultura brasileira. Itens marcados “a confirmar” ainda não são oficiais.</p></div></div>
      <div class="filters" role="group" aria-label="Filtrar">${Object.entries(tipos).map(([k, v]) => `<button type="button" data-f="${k}" class="${k === calFilter ? 'on' : ''}">${v}</button>`).join('')}</div>
      ${Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b)).map(([mm, evs]) => `<section class="cal-month panel"><h2>${MES[Number(mm) - 1][0].toUpperCase() + MES[Number(mm) - 1].slice(1)}</h2>${evs.map((e) => `<div class="cal-item"><span class="d">${dm(e.data)}<br><small>${WD[parse(e.data).getDay()].slice(0, 3)}</small></span><div>${evTag(e)}${planned.has(e.data) ? ` <a class="tag" style="background:var(--soft)" href="#dia-${e.data}">ver aula</a>` : ''}${e.nota ? `<p>${esc(e.nota)}</p>` : ''}</div></div>`).join('')}</section>`).join('')}`;
  }

  function viewAbout() {
    const t = config.temaAno, h = config.horarios[state.turma];
    const cores = ['--purple', '--green', '--orange', '--blue'];
    return `<div class="hero">${dots}<div class="kicker" style="color:var(--yellow)">Tema do ano · Expo Prime 2027</div><h1>${esc(t.titulo)}</h1><p><b>${esc(t.subtitulo)}</b> · ${esc(t.status)}</p><p>${esc(t.descricao)}</p></div>
      <h2 style="margin:6px 0 12px">Pilares do bilíngue</h2><div class="cards">${config.pilares.map((p, i) => `<div class="card" style="--c:var(${cores[i]})"><h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p></div>`).join('')}</div><br>
      <div class="two"><div class="panel"><h2>O tema mês a mês</h2><table class="h">${t.meses.map(([m, s]) => `<tr><th>${esc(m)}</th><td>${esc(s)}</td></tr>`).join('')}</table></div>
      <div class="panel"><h2>Horários do ${esc(state.turma)}</h2><table class="h">${['manhaEN', 'manhaPT', 'tardeEN'].map((b) => `<tr><th>${hhmm(h[b].ini)}–${hhmm(h[b].fim)}</th><td><span class="lang ${h[b].lingua}">${h[b].lingua.toUpperCase()}</span> ${esc(h[b].reg)}${h[b].dias ? ' (segunda a quinta)' : ''}</td></tr>`).join('')}<tr><th>11h30–13h</th><td>Almoço (fora da carga curricular)</td></tr></table>
      <h2 style="margin-top:20px">Rodízio de ambientes</h2><table class="h">${Object.entries(config.rodizio[state.turma]).map(([d, k]) => `<tr><th>${WD[d]}</th><td>${roomTag(config.ambientes[k])}</td></tr>`).join('')}</table>
      <h2 style="margin-top:20px">Tempo de atenção</h2><p>${esc(config.atencao)}</p>
      <h2 style="margin-top:20px">Legenda dos materiais</h2><ul class="clean">${Object.entries(config.legendaMateriais).map(([k, v]) => `<li><span class="st ${k}">${k}</span> ${esc(v)}</li>`).join('')}</ul></div></div>`;
  }

  // ---------- navegação ----------
  const NAV = [['mes', 'cal', 'Mês'], ['dia', 'day', 'Dia'], ['maker', 'tool', 'Projeto maker'], ['bncc', 'target', 'BNCC'], ['calendario', 'cal', 'Calendário 2027'], ['sobre', 'info', 'Pilares e tema']];
  function firstDay() {
    const today = new Date().toISOString().slice(0, 10);
    const dias = allDays();
    return (dias.find((d) => d.data >= today) || dias[0]).data;
  }
  function render() {
    // Rota: #mes[-AAAA-MM], #maker, #bncc, #calendario, #sobre ou #dia-AAAA-MM-DD[-bloco] (só letras, números e hífens).
    const h = location.hash.slice(1);
    const m = h.match(/^dia-(\d{4}-\d{2}-\d{2})(?:-(\w+))?$/);
    const mm = h.match(/^mes-(\d{4}-\d{2})$/);
    const [route, arg, bloco] = m ? ['dia', m[1], m[2]] : mm ? ['mes'] : [h];
    const novoMes = mm ? mm[1] : m ? m[1].slice(0, 7) : null;
    if (novoMes && months[`${state.turma}-${novoMes}`]) state.mes = novoMes;
    const hashTarget = bloco && 'b-' + bloco;
    const r = NAV.some(([k]) => k === route) ? route : 'mes';
    const view = { mes: viewMonth, dia: () => viewDay(arg || firstDay()), maker: viewMaker, bncc: viewBncc, calendario: viewCalendar, sobre: viewAbout }[r];
    $('view').innerHTML = view();
 $('meses').innerHTML = nums.map((n, i) => months[`${state.turma}-2027-${n}`] ? `<a href="#mes-2027-${n}" class="${state.mes.endsWith(n) ? 'on' : ''}">${nomes[i]}</a>` : `<span title="Em breve">${nomes[i]}</span>`).join('');
    $('nav').innerHTML = NAV.map(([k, i, t]) => `<a href="#${k === 'dia' ? 'dia-' + firstDay() : k === 'mes' ? 'mes-' + state.mes : k}" class="${k === r ? 'on' : ''}">${ic(i)}${t}</a>`).join('');
    const label = NAV.find(([k]) => k === r)[2];
    $('crumbs').innerHTML = `${esc(state.turma)} / ${esc(plan().titulo)} 2027 / <b>${esc(r === 'dia' && arg ? longDate(arg) : label)}</b>`;
    document.title = `${label} · ${state.turma} · Planejamento Prime Enfant`;
    $('sidebar').classList.remove('open'); $('menuBtn').setAttribute('aria-expanded', 'false');
    if (hashTarget && $(hashTarget)) $(hashTarget).scrollIntoView(); else window.scrollTo(0, 0);
    document.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => { calFilter = b.dataset.f; render(); }));
  }

  // ---------- montagem fixa ----------
  $('turmas').innerHTML = config.turmas.map((t) => t.ativo ? `<a class="chip on" href="#mes-${state.mes}">${t.nome}</a>` : `<span class="chip off" title="Em breve">${t.nome}</span>`).join('');
  $('menuBtn').innerHTML = ic('menu');
  $('menuBtn').addEventListener('click', () => { const o = $('sidebar').classList.toggle('open'); $('menuBtn').setAttribute('aria-expanded', String(o)); });
  $('printBtn').innerHTML = ic('print') + 'Imprimir';
  if (window.self !== window.top) $('printBtn').hidden = true; // impressão bloqueada quando o site roda dentro de um quadro
  $('printBtn').addEventListener('click', () => window.print());
  window.addEventListener('hashchange', render);
  render();
})();
