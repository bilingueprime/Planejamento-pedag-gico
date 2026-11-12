# Prime Enfant Lesson Planning

![HTML](https://img.shields.io/badge/HTML-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

[Versão em português](README.md)

A static site for browsing Prime Enfant Bilingual School’s 2027 bilingual lesson planning. Teachers browse by month and by day and see, for each teaching block, the step-by-step plan, BNCC objectives, materials and what to observe.

Current content: **LK3, February and March 2027** (17 + 21 school days; March covers 32 of 32 BNCC EI02 objectives). Each activity is split into timed phases (`fases: [minutes, title, description]`), and the tests check that they fit the schedule.

## How to open

Open `index.html` in a browser. There is no build step and no dependencies: it works from a local folder or any static host (GitHub Pages, for example).

## Structure

```
index.html                 single page
assets/css/style.css       styles (Prime Enfant colors and fonts)
assets/js/app.js           views: month, day, maker project, BNCC, calendar, pillars
assets/fonts/              Roboto and Roboto Slab (local files)
assets/img/                logo and icon
data/config.js             schedules, room rotation, year theme, pillars, legend
data/bncc-ei02.js          the 32 BNCC objectives for children aged 1y7m to 3y11m
data/calendario-2027.js    school events, non-school days and international dates
data/lk3/2027-02.js        LK3 planning for February
data/lk3/2027-03.js        LK3 planning for March
tests/                     data validation
```

## Adding a month or a year group

1. Copy `data/lk3/2027-03.js` to `data/<group>/<year-month>.js` and change the `PRIME.months` key.
2. Add the file to `index.html` next to the other data scripts.
3. For a new group, enable it in `config.turmas`, set `config.rodizio` and `config.horarios`, and add the objectives file for its age band (EI01 or EI03) if needed.
4. Run the tests.

## Tests

```
npm test
```

The tests check that every school day has a plan, that Portuguese and English blocks do not overlap, that BNCC codes exist and that no nap or rest moments are planned. They also print the month’s BNCC coverage.

## Security and privacy

Static site with no forms, no data collection and no external calls. All data text is escaped before being rendered. Do not put children’s photos or names in the data files.
