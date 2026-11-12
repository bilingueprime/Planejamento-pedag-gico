# Planejamento Prime Enfant

![HTML](https://img.shields.io/badge/HTML-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

[English version](README.en.md)

Site estático de consulta do planejamento pedagógico bilíngue da Prime Enfant Bilingual School (2027). As professoras navegam por mês e por dia e encontram, para cada bloco de aula, o roteiro, os objetivos da BNCC, os materiais e o que observar.

Conteúdo atual: **LK3, fevereiro e março de 2027** (17 + 21 dias letivos; março cobre 32 de 32 objetivos EI02 da BNCC). Cada proposta é dividida em fases cronometradas (campo `fases: [minutos, título, descrição]`), e os testes conferem se a soma cabe no horário.

## Como abrir

Abra `index.html` no navegador. Não há build nem dependências: funciona direto do computador ou em qualquer hospedagem estática (GitHub Pages, por exemplo).

## Estrutura

```
index.html                 página única
assets/css/style.css       visual (cores e fontes da Prime Enfant)
assets/js/app.js           telas: mês, dia, projeto maker, BNCC, calendário, pilares
assets/fonts/              Roboto e Roboto Slab (locais, sem depender da internet)
assets/img/                logotipo e ícone
data/config.js             horários, rodízio de ambientes, tema do ano, pilares, legenda
data/bncc-ei02.js          os 32 objetivos da BNCC para crianças bem pequenas
data/calendario-2027.js    eventos internos, dias sem aula e datas internacionais
data/lk3/2027-02.js        planejamento do LK3 em fevereiro
data/lk3/2027-03.js        planejamento do LK3 em março
tests/                     validação dos dados
```

## Como acrescentar um mês ou uma turma

1. Copie `data/lk3/2027-03.js` para `data/<turma>/<ano-mês>.js` (por exemplo `data/lk3/2027-04.js`) e troque a chave `PRIME.months['LK3-2027-04']`.
2. Inclua o arquivo em `index.html`, junto dos outros scripts de dados.
3. Para uma nova turma, ative-a em `config.turmas`, defina `config.rodizio` e `config.horarios` e crie o arquivo de objetivos da faixa etária (EI01 ou EI03) se for o caso.
4. Rode os testes.

Cada dia tem os blocos `manhaEN` (7h30–8h30), `manhaPT` (8h30–11h30) e, de segunda a quinta, `tardeEN` (13h–15h30). O roteiro fixo de cada bloco fica em `config.roteiros`; o plano do dia preenche a roda, a proposta principal, a segunda proposta e o fechamento.

## Testes

```
npm test
```

Os testes conferem que todo dia letivo tem plano, que os horários de português e inglês não se sobrepõem, que os códigos da BNCC existem e que não há momentos de soneca ou descanso. Também mostram a cobertura da BNCC no mês.

## Segurança e privacidade

Site estático, sem formulários, sem coleta de dados e sem chamadas externas. Todo texto vindo dos dados é escapado antes de entrar na página. Não publique fotos ou nomes de crianças nos arquivos de dados.
