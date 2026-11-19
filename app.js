// ===== Watching Weekend – F1, Werder Bremen, Liverpool & Wetter =====

const CFG = {
  teams: {
    svw: { id: 134, name: 'Werder Bremen', short: 'Bremen' },
    lfc: { id: 370, name: 'Liverpool FC', short: 'Liverpool',
           logo: 'https://r2.thesportsdb.com/images/media/team/badge/kfaher1737969724.png' },
  },
  places: [
    { name: 'Regensburg', lat: 49.0134, lon: 12.1016 },
    { name: 'Immenstaad am Bodensee', lat: 47.6667, lon: 9.3667 },
  ],
};

// Stadion des Heimteams (Quelle liefert keine Stadien → eigene Liste)
const STADIUMS = {
  // Bundesliga
  'SV Werder Bremen': 'Weserstadion', '1. FC Köln': 'RheinEnergieStadion', '1. FC Union Berlin': 'Stadion An der Alten Försterei',
  '1. FSV Mainz 05': 'Mewa Arena', 'Bayer 04 Leverkusen': 'BayArena', 'Borussia Dortmund': 'Signal Iduna Park',
  'Borussia Mönchengladbach': 'Borussia-Park', 'Eintracht Frankfurt': 'Deutsche Bank Park', 'FC Augsburg': 'WWK Arena',
  'FC Bayern München': 'Allianz Arena', 'FC Schalke 04': 'Veltins-Arena', 'Hamburger SV': 'Volksparkstadion',
  'RB Leipzig': 'Red Bull Arena', 'SC Freiburg': 'Europa-Park Stadion', 'SC Paderborn 07': 'Home Deluxe Arena',
  'SV 07 Elversberg': 'Ursapharm-Arena', 'TSG Hoffenheim': 'PreZero Arena', 'VfB Stuttgart': 'MHPArena',
  // Premier League
  'FC Liverpool': 'Anfield', 'AFC Bournemouth': 'Vitality Stadium', 'Aston Villa': 'Villa Park',
  'Brentford F.C.': 'Gtech Community Stadium', 'Brighton & Hove Albion': 'Amex Stadium', 'Chelsea FC': 'Stamford Bridge',
  'Coventry City': 'Coventry Building Society Arena', 'Crystal Palace FC': 'Selhurst Park', 'Everton FC': 'Hill Dickinson Stadium',
  'FC Arsenal': 'Emirates Stadium', 'Arsenal': 'Emirates Stadium', 'Fulham FC': 'Craven Cottage', 'Hull City': 'MKM Stadium', 'Ipswich Town': 'Portman Road',
  'Leeds United': 'Elland Road', 'Manchester City': 'Etihad Stadium', 'Manchester United FC': 'Old Trafford',
  'Newcastle United FC': "St James' Park", 'Nottingham Forest': 'City Ground', 'Sunderland': 'Stadium of Light',
  'Tottenham Hotspur FC': 'Tottenham Hotspur Stadium',
  // Champions League (Liverpool-Gegner)
  'FC Brügge': 'Jan-Breydel-Stadion', 'Inter Mailand': 'San Siro', 'LASK': 'Raiffeisen Arena',
  'Fenerbahçe SK': 'Şükrü-Saracoğlu-Stadion', 'Villarreal CF': 'Estadio de la Cerámica', 'FC Porto': 'Estádio do Dragão',
  'RC Lens': 'Stade Bollaert-Delelis',
};

// Reihenfolge der Wettbewerbe
const COMPS = ['Bundesliga', 'Premier League', 'Champions League', 'Pokal'];

// Icons der Wettbewerbe
const HENKELPOTT = `<svg viewBox="0 0 64 64" class="cup"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round">
  <path d="M20 10 Q4 8 6 24 Q8 38 24 36"/><path d="M44 10 Q60 8 58 24 Q56 38 40 36"/></g>
  <path d="M18 8 H46 Q46 34 34 40 L34 48 H30 L30 40 Q18 34 18 8 Z" fill="currentColor"/>
  <rect x="22" y="48" width="20" height="5" rx="1" fill="currentColor"/><rect x="18" y="53" width="28" height="6" rx="2" fill="currentColor"/></svg>`;
const POKAL = `<svg viewBox="0 0 64 64" class="cup"><g fill="none" stroke="currentColor" stroke-width="4">
  <path d="M18 14 H8 Q8 28 20 30"/><path d="M46 14 H56 Q56 28 44 30"/></g>
  <path d="M16 8 H48 V20 Q48 36 34 38 V46 H30 V38 Q16 36 16 20 Z" fill="currentColor"/>
  <rect x="22" y="46" width="20" height="5" rx="1" fill="currentColor"/><rect x="18" y="51" width="28" height="7" rx="2" fill="currentColor"/></svg>`;
const COMP_ICON = {
  'Bundesliga': '<img class="comp-logo" src="https://r2.thesportsdb.com/images/media/league/badge/teqh1b1679952008.png" alt="">',
  'Premier League': '<img class="comp-logo" src="https://r2.thesportsdb.com/images/media/league/badge/gasy9d1737743125.png" alt="">',
  'Champions League': HENKELPOTT,
  'Pokal': POKAL,
};
// Liga für die Tabelle je Team
const TEAM_LEAGUE = { svw: { code: 'bl1', name: 'Bundesliga' }, lfc: { code: 'pl', name: 'Premier League' } };

// Länderflaggen für Grand Prix (Land → ISO-Code)
const COUNTRY_ISO = {
  Australia: 'au', China: 'cn', Japan: 'jp', USA: 'us', 'United States': 'us', Canada: 'ca', Monaco: 'mc', Spain: 'es',
  Austria: 'at', UK: 'gb', 'United Kingdom': 'gb', Belgium: 'be', Hungary: 'hu', Netherlands: 'nl', Italy: 'it',
  Azerbaijan: 'az', Malaysia: 'my', Singapore: 'sg', Mexico: 'mx', Brazil: 'br', Qatar: 'qa', UAE: 'ae',
  'Saudi Arabia': 'sa', Bahrain: 'bh', Portugal: 'pt', Turkey: 'tr', France: 'fr', Germany: 'de', Argentina: 'ar',
  'South Africa': 'za', Korea: 'kr', India: 'in', Russia: 'ru', Thailand: 'th', Vietnam: 'vn',
};
const flag = country => {
  const iso = COUNTRY_ISO[country];
  return iso ? `<img class="flag" src="https://flagcdn.com/w40/${iso}.png" alt="${esc(country)}">` : '';
};

// Teamfarben Formel 1
const TEAM_COLOR = {
  mercedes: '#27F4D2', ferrari: '#E8002D', red_bull: '#3671C6', mclaren: '#FF8000', rb: '#6692FF',
  alpine: '#FF87BC', haas: '#B6BABD', audi: '#F50537', sauber: '#52E252', williams: '#64C4FF',
  aston_martin: '#229971', cadillac: '#C9C9C9',
};
const teamColor = id => TEAM_COLOR[id] || '#888888';

// F1-Sessions (Feldname in der API → Anzeigename, Dauer in Minuten)
const F1_SESSIONS = [
  ['FirstPractice', '1. Training', 60], ['SecondPractice', '2. Training', 60], ['ThirdPractice', '3. Training', 60],
  ['SprintQualifying', 'Sprint-Qualifying', 45], ['SprintShootout', 'Sprint-Qualifying', 45], ['Sprint', 'Sprint', 60],
  ['Qualifying', 'Qualifying', 60],
];

const cache = {};
const view = document.getElementById('view');
let currentTab = 'home';
let footballTeam = localStorage.getItem('team') || 'svw';
// Kalender-Zustand: angezeigter Monat und ausgewählter Tag (Schlüssel "J-M-T")
let calMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let calDay = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;
let timer;

// ---------- Helpers ----------
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function getJSON(url, key, maxAgeMin = 10) {
  const hit = cache[key];
  if (hit && Date.now() - hit.t < maxAgeMin * 60000) return hit.data;
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.status);
  const data = await res.json();
  cache[key] = { t: Date.now(), data };
  try { localStorage.setItem('c_' + key, JSON.stringify(cache[key])); } catch {}
  return data;
}
// Offline-Fallback aus localStorage
for (let i = 0; i < localStorage.length; i++) {
  const k = localStorage.key(i);
  if (k.startsWith('c_')) try { cache[k.slice(2)] = { ...JSON.parse(localStorage.getItem(k)), t: 0 }; } catch {}
}
async function safe(fn, key) {
  try { return await fn(); }
  catch { return cache[key]?.data ?? null; }
}

const fmtDate = d => d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
const fmtTime = d => d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
const fmtDT = d => `${fmtDate(d)} · ${fmtTime(d)} Uhr`;

function countdown(d) {
  let s = Math.max(0, Math.floor((d - Date.now()) / 1000));
  const days = Math.floor(s / 86400); s %= 86400;
  const h = Math.floor(s / 3600); s %= 3600;
  const m = Math.floor(s / 60); s %= 60;
  const p = n => String(n).padStart(2, '0');
  return `${days}T ${p(h)}:${p(m)}:${p(s)}`;
}

function competition(m) {
  const s = (m.leagueShortcut || '').toLowerCase(), n = (m.leagueName || '').toLowerCase();
  if (s === 'bl1' || n.includes('bundesliga')) return 'Bundesliga';
  if (s === 'pl' || n.includes('premier league')) return 'Premier League';
  if (s.startsWith('ucl') || n.includes('champions')) return 'Champions League';
  return 'Pokal';
}

// ---------- Daten ----------
async function loadF1() {
  const [sched, drivers, constructors] = await Promise.all([
    safe(() => getJSON('https://api.jolpi.ca/ergast/f1/current/races.json', 'f1sched', 60), 'f1sched'),
    safe(() => getJSON('https://api.jolpi.ca/ergast/f1/current/driverStandings.json', 'f1drv', 30), 'f1drv'),
    safe(() => getJSON('https://api.jolpi.ca/ergast/f1/current/constructorStandings.json', 'f1con', 30), 'f1con'),
  ]);
  const races = (sched?.MRData.RaceTable.Races ?? []).map(r => {
    const mk = v => new Date(`${v.date}T${v.time || '12:00:00Z'}`);
    const sessions = F1_SESSIONS.filter(([k]) => r[k]).map(([k, name, dur]) => ({ name, dt: mk(r[k]), dur }));
    sessions.push({ name: 'Rennen', dt: mk(r), dur: 120, race: true });
    sessions.sort((a, b) => a.dt - b.dt);
    return { ...r, dt: mk(r), sessions };
  });
  const now = Date.now();
  const next = races.find(r => r.dt.getTime() + 120 * 60000 > now);

  const dList = drivers?.MRData.StandingsTable.StandingsLists[0];
  const cList = constructors?.MRData.StandingsTable.StandingsLists[0];
  // Noch zu vergebende Punkte (nach dem letzten gewerteten Rennen)
  const left = races.filter(r => +r.round > +(dList?.round ?? 0));
  const sprints = left.filter(r => r.Sprint).length;
  const maxDriver = left.length * 25 + sprints * 8;
  const maxTeam = left.length * (25 + 18) + sprints * (8 + 7);
  const decided = (list, max) => list?.length > 1 && (+list[0].points - +list[1].points) > max;

  const dStand = dList?.DriverStandings ?? [];
  const cStand = cList?.ConstructorStandings ?? [];
  return {
    races, next,
    standings: dStand, constructors: cStand,
    driverChampion: decided(dStand, maxDriver),
    teamChampion: decided(cStand, maxTeam),
  };
}

// Tabelle der Liga (OpenLigaDB)
async function loadTable(key) {
  const l = TEAM_LEAGUE[key];
  const season = new Date().getMonth() >= 6 ? new Date().getFullYear() : new Date().getFullYear() - 1;
  return (await safe(() => getJSON(`https://api.openligadb.de/getbltable/${l.code}/${season}`, 'tbl_' + key, 30), 'tbl_' + key)) ?? [];
}

// Status einer Session: vorbei / läuft / kommt
const sessionState = s => {
  const now = Date.now(), start = s.dt.getTime(), end = start + s.dur * 60000;
  return now >= end ? 'done' : now >= start ? 'live' : 'soon';
};

// Kommende Spiele eines Teams (OpenLigaDB: 0 Wochen zurück, 12 Wochen voraus)
async function loadMatches(key) {
  const t = CFG.teams[key];
  const data = await safe(() => getJSON(`https://api.openligadb.de/getmatchesbyteamid/${t.id}/0/12`, 'm_' + key, 15), 'm_' + key);
  const now = Date.now();
  const logo = team => (team.teamId === t.id && t.logo) ? t.logo : team.teamIconUrl;
  return (data ?? [])
    .filter(m => !m.matchIsFinished && new Date(m.matchDateTimeUTC).getTime() + 2 * 3600e3 > now)
    .map(m => ({
      team: key,
      comp: competition(m),
      round: m.group?.groupName ?? '',
      dt: new Date(m.matchDateTimeUTC),
      home: m.team1.shortName || m.team1.teamName, homeLogo: logo(m.team1),
      away: m.team2.shortName || m.team2.teamName, awayLogo: logo(m.team2),
      stadium: m.location?.locationStadium || STADIUMS[m.team1.teamName] || `Heimspiel ${m.team1.shortName || m.team1.teamName}`,
      isHome: m.team1.teamId === t.id,
    }))
    .sort((a, b) => a.dt - b.dt);
}

// ---------- Watching: Zusammenfassungen der letzten Spiele ----------
// Welche Wettbewerbe pro Team im Watching-Tab erscheinen
const WATCH_COMPS = { svw: ['Bundesliga'], lfc: ['Premier League', 'Champions League'] };

// Zusätzliche Suchbegriffe, weil Sportschau-Titel oft Spitznamen nutzen
const ALIASES = {
  'SV Werder Bremen': ['Werder', 'Bremen'], 'VfB Stuttgart': ['VfB', 'Stuttgart'], 'Hamburger SV': ['HSV', 'Hamburg'],
  'Borussia Dortmund': ['BVB', 'Dortmund'], 'FC Bayern München': ['Bayern', 'FCB'], 'Bayer 04 Leverkusen': ['Leverkusen', 'Bayer'],
  'Borussia Mönchengladbach': ['Gladbach', 'Borussia'], 'Eintracht Frankfurt': ['Frankfurt', 'Eintracht'],
  'TSG Hoffenheim': ['Hoffenheim', 'TSG'], '1. FSV Mainz 05': ['Mainz'], '1. FC Union Berlin': ['Union'],
  'FC Schalke 04': ['Schalke', 'S04'], 'RB Leipzig': ['Leipzig'], 'SC Freiburg': ['Freiburg'],
  '1. FC Köln': ['Köln'], 'FC Augsburg': ['Augsburg', 'FCA'], 'SC Paderborn 07': ['Paderborn'], 'SV 07 Elversberg': ['Elversberg'],
  'FC Liverpool': ['Liverpool', 'Reds'],
};
// Mehrdeutige Wörter nicht zur Zuordnung nutzen
const STOP_WORDS = new Set(['borussia', 'eintracht', 'bayer', 'berlin', 'city', 'united']);
const teamWords = team => [...new Set([team.shortName, ...(ALIASES[team.teamName] || []), ...team.teamName.split(' ').filter(w => w.length > 3)])]
  .filter(Boolean).map(w => w.toLowerCase()).filter(w => !STOP_WORDS.has(w));

// Letzte beendete Spiele (6 Wochen zurück)
async function loadRecent(key) {
  const t = CFG.teams[key];
  const data = await safe(() => getJSON(`https://api.openligadb.de/getmatchesbyteamid/${t.id}/6/0`, 'r_' + key, 30), 'r_' + key);
  const logo = team => (team.teamId === t.id && t.logo) ? t.logo : team.teamIconUrl;
  return (data ?? [])
    .filter(m => m.matchIsFinished && WATCH_COMPS[key].includes(competition(m)))
    .map(m => {
      const end = m.matchResults?.find(r => r.resultTypeID === 2) ?? m.matchResults?.at(-1);
      return {
        team: key, comp: competition(m), round: m.group?.groupName ?? '',
        dt: new Date(m.matchDateTimeUTC),
        home: m.team1.shortName || m.team1.teamName, homeLogo: logo(m.team1),
        away: m.team2.shortName || m.team2.teamName, awayLogo: logo(m.team2),
        hs: end?.pointsTeam1, as: end?.pointsTeam2,
        words: [...teamWords(m.team1), ...teamWords(m.team2)],
      };
    })
    .sort((a, b) => b.dt - a.dt)
    .slice(0, 3);
}

// ARD-Mediathek (enthält Das Erste/Sportschau und ZDF) nach Zusammenfassungen durchsuchen
async function ardSearch(q) {
  const url = `https://api.ardmediathek.de/page-gateway/widgets/ard/search/vod?searchString=${encodeURIComponent(q)}&pageSize=50`;
  const data = await safe(() => getJSON(url, 'ard_' + q, 60), 'ard_' + q);
  return data?.teasers ?? [];
}

async function findHighlights(m) {
  if (m.comp === 'Premier League') return [];   // keine Rechte bei Das Erste / ZDF
  const results = (await Promise.all([ardSearch(m.home), ardSearch(m.away)])).flat();
  const start = m.dt.getTime() - 3600e3, end = m.dt.getTime() + 4 * 86400e3;
  const seen = new Set();
  return results.filter(v => {
    if (seen.has(v.id)) return false;
    seen.add(v.id);
    const sender = v.publicationService?.name || '';
    const show = v.show?.title || '';
    const t = new Date(v.broadcastedOn).getTime();
    const title = (v.longTitle || v.shortTitle || '').toLowerCase();
    return /das erste|sportschau|zdf/i.test(sender)
      && /sportschau|sportstudio/i.test(show) && !/frauen|3\. liga|2\. liga/i.test(show)
      && t >= start && t <= end
      && m.words.some(w => new RegExp(`(^|[^a-zäöüß])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-zäöüß]|$)`).test(title));
  }).map(v => ({
    title: v.longTitle || v.shortTitle,
    sender: /zdf/i.test(v.publicationService?.name) ? 'ZDF' : 'Das Erste',
    show: v.show?.title,
    dur: v.duration,
    img: v.images?.aspect16x9?.src?.replace('{width}', '640'),
    url: `https://www.ardmediathek.de/video/${v.id}`,
  })).slice(0, 2);
}

// ---------- Kalender: alle Termine ----------
async function loadCalendarEvents() {
  const f1 = await loadF1();
  const events = [];
  f1.races.forEach(r => r.sessions.forEach(s => events.push({
    type: 'f1', icon: s.race ? '🏁' : '🏎️', dt: s.dt,
    title: `${s.name} – ${r.raceName}`,
    sub: `${r.Circuit.circuitName}, ${r.Circuit.Location.country}`,
  })));
  // Spiele: 8 Wochen zurück bis 30 Wochen voraus
  for (const key of Object.keys(CFG.teams)) {
    const t = CFG.teams[key];
    const data = await safe(() => getJSON(`https://api.openligadb.de/getmatchesbyteamid/${t.id}/8/30`, 'cal_' + key, 60), 'cal_' + key);
    (data ?? []).forEach(m => {
      const end = m.matchResults?.find(r => r.resultTypeID === 2) ?? m.matchResults?.at(-1);
      const score = m.matchIsFinished && end ? ` ${end.pointsTeam1}:${end.pointsTeam2}` : '';
      events.push({
        type: key, icon: '⚽', dt: new Date(m.matchDateTimeUTC),
        title: `${m.team1.shortName || m.team1.teamName} – ${m.team2.shortName || m.team2.teamName}${score}`,
        sub: `${competition(m)}${m.group?.groupName ? ' · ' + m.group.groupName : ''} · ${STADIUMS[m.team1.teamName] || ''}`,
      });
    });
  }
  return events;
}

// ---------- Hintergrund (Startseite): Ferrari- und Werder-Logo im Wechsel ----------
// Alle 5 Sekunden wechselt das Logo; beim Wechsel verschwimmt das Bild wie eine Wasseroberfläche.
const BG_LOGOS = [
  { src: 'https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg', tint: '#6e0000', alt: 'Scuderia Ferrari' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/b/be/SV-Werder-Bremen-Logo.svg', tint: '#06321f', alt: 'SV Werder Bremen' },
];
const BG_INTERVAL = 5000;     // Wechsel alle 5 Sekunden
const RIPPLE_MS = 1800;       // Dauer des Wasser-Effekts
let bgTimer = null, bgIndex = 0, rippleFrame = null;

function updateBgLogos() {
  const box = document.getElementById('bg-video');
  const want = currentTab === 'home';
  document.body.classList.toggle('has-bg', want);
  if (!want) {
    clearInterval(bgTimer); bgTimer = null;
    cancelAnimationFrame(rippleFrame);
    box.innerHTML = '';
    return;
  }
  if (box.firstChild) return;   // läuft schon
  bgIndex = 0;
  box.style.setProperty('--tint', BG_LOGOS[0].tint);
  box.innerHTML = `
    <svg class="water-defs" width="0" height="0" aria-hidden="true">
      <filter id="water" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence id="water-turb" type="fractalNoise" baseFrequency="0.012 0.035" numOctaves="2" seed="7" result="noise"/>
        <feDisplacementMap id="water-disp" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </svg>
    <div class="logo-stage">
      ${BG_LOGOS.map((l, i) => `<img class="bg-logo ${i === 0 ? 'show' : ''}" src="${l.src}" alt="${l.alt}" decoding="async">`).join('')}
    </div>`;
  bgTimer = setInterval(nextBgLogo, BG_INTERVAL);
}

function nextBgLogo() {
  const box = document.getElementById('bg-video');
  const stage = box.querySelector('.logo-stage');
  if (!stage || document.hidden) return;
  const imgs = stage.querySelectorAll('.bg-logo');
  const next = (bgIndex + 1) % BG_LOGOS.length;
  const swap = () => {
    imgs[bgIndex].classList.remove('show');
    imgs[next].classList.add('show');
    box.style.setProperty('--tint', BG_LOGOS[next].tint);
    bgIndex = next;
  };
  // Bei "Bewegung reduzieren" nur sanft überblenden
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return swap();

  const turb = box.querySelector('#water-turb'), disp = box.querySelector('#water-disp');
  stage.classList.add('rippling');
  const t0 = performance.now();
  let swapped = false;
  const step = now => {
    const t = Math.min(1, (now - t0) / RIPPLE_MS);
    const wave = Math.sin(Math.PI * t);                       // 0 → 1 → 0
    disp.setAttribute('scale', (wave * 80).toFixed(1));       // Stärke der Verzerrung
    const f = 0.012 + 0.008 * Math.sin(t * Math.PI * 6);      // wandernde Wellen
    turb.setAttribute('baseFrequency', `${f.toFixed(4)} ${(f * 2.6).toFixed(4)}`);
    if (!swapped && t >= 0.4) { swapped = true; swap(); }
    if (t < 1) rippleFrame = requestAnimationFrame(step);
    else { disp.setAttribute('scale', '0'); stage.classList.remove('rippling'); }
  };
  rippleFrame = requestAnimationFrame(step);
}

async function loadWeather() {
  return Promise.all(CFG.places.map(async p => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}` +
      `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe%2FBerlin`;
    const data = await safe(() => getJSON(url, 'wx_' + p.name, 15), 'wx_' + p.name);
    return { ...p, data };
  }));
}

// ---------- Wetter-Codes ----------
function wx(code) {
  const map = [
    [[0], '☀️', 'Klar'], [[1], '🌤️', 'Überwiegend klar'], [[2], '⛅', 'Teilweise bewölkt'], [[3], '☁️', 'Bewölkt'],
    [[45, 48], '🌫️', 'Nebel'], [[51, 53, 55, 56, 57], '🌦️', 'Nieselregen'], [[61, 63, 65, 66, 67, 80, 81, 82], '🌧️', 'Regen'],
    [[71, 73, 75, 77, 85, 86], '🌨️', 'Schnee'], [[95, 96, 99], '⛈️', 'Gewitter'],
  ];
  const f = map.find(([c]) => c.includes(code));
  return f ? { icon: f[1], text: f[2] } : { icon: '❔', text: '' };
}

// ---------- Render-Bausteine ----------
function matchCard(m, { label = 'round', withTeam = false } = {}) {
  const img = src => src ? `<img src="${esc(src)}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">` : '';
  const head = label === 'comp'
    ? `${withTeam ? esc(CFG.teams[m.team].name) + ' · ' : ''}${esc(m.comp)}${m.round ? ' · ' + esc(m.round) : ''}`
    : esc(m.round);
  return `<div class="match-card ${m.team}">
    <div class="mc-head"><span>${head}</span><span class="mc-ha">${m.isHome ? 'Heim' : 'Auswärts'}</span></div>
    <div class="mc-body">
      <div class="team">${img(m.homeLogo)}<span>${esc(m.home)}</span></div>
      <div class="kick">
        <div class="kick-date">${fmtDate(m.dt)}</div>
        <div class="kick-time">${fmtTime(m.dt)}</div>
      </div>
      <div class="team">${img(m.awayLogo)}<span>${esc(m.away)}</span></div>
    </div>
    <div class="mc-foot">
      <span class="stadium">🏟️ ${esc(m.stadium)}</span>
      ${m.dt > Date.now()
        ? `<span class="cd">⏱ <b data-cd="${m.dt.getTime()}">${countdown(m.dt)}</b></span>`
        : '<span class="cd"><b>LÄUFT</b></span>'}
    </div>
  </div>`;
}

function raceCard(r, big = true) {
  if (!r) return '<div class="card f1card">Keine weiteren Rennen in dieser Saison 🏁</div>';
  const nextS = r.sessions.find(s => sessionState(s) !== 'done');
  const live = nextS && sessionState(nextS) === 'live';
  const rows = r.sessions.map(s => {
    const st = sessionState(s);
    return `<div class="row session ${st} ${s === nextS ? 'next' : ''}">
      <span class="name">${s.race ? '🏁 ' : ''}${s.name}${st === 'live' ? ' <em>LIVE</em>' : ''}</span>
      <span>${fmtDT(s.dt)}</span></div>`;
  }).join('');
  return `<div class="card f1card">
    <span class="tag">Formel 1 · Runde ${esc(r.round)}</span>
    <div class="title race-title">${flag(r.Circuit.Location.country)}${esc(r.raceName)}</div>
    <div class="sub">${esc(r.Circuit.circuitName)}, ${esc(r.Circuit.Location.country)}</div>
    ${nextS ? `<div class="next-label">${live ? 'Läuft gerade' : 'Nächste Session'}: <b>${nextS.name}</b></div>
      ${live ? '<div class="countdown">LIVE</div>'
             : `<div class="countdown" data-cd="${nextS.dt.getTime()}">${countdown(nextS.dt)}</div>`}` : ''}
    ${big ? `<div class="sessions">${rows}</div>` : ''}
  </div>`;
}

// Tabelle: Top 3, eigenes Team mit 3 Plätzen davor/danach, letzte 3
function tableCard(table, key) {
  if (!table.length) return '';
  const t = CFG.teams[key], lg = TEAM_LEAGUE[key];
  const n = table.length;
  const rows = table.map((r, i) => ({ ...r, pos: i + 1, own: r.teamInfoId === t.id || r.teamId === t.id }));
  const show = new Set([0, 1, 2, n - 3, n - 2, n - 1]);
  const ownIdx = rows.findIndex(r => r.own);
  if (ownIdx >= 0) for (let i = ownIdx - 3; i <= ownIdx + 3; i++) show.add(i);
  const idx = [...show].filter(i => i >= 0 && i < n).sort((a, b) => a - b);
  const sign = v => v > 0 ? '+' + v : v;
  let html = '', prev = -1;
  for (const i of idx) {
    if (i - prev > 1) html += '<tr class="gap"><td colspan="9">···</td></tr>';
    const r = rows[i];
    html += `<tr class="${r.own ? 'own' : ''} ${i < 3 ? 't-top' : ''} ${i >= n - 3 ? 't-bottom' : ''}">
      <td class="tp">${r.pos}</td>
      <td class="tl">${r.teamIconUrl ? `<img src="${esc(r.teamIconUrl)}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">` : ''}</td>
      <td class="tn">${esc(r.shortName || r.teamName)}</td>
      <td>${r.matches}</td><td>${r.won}</td><td>${r.draw}</td><td>${r.lost}</td>
      <td>${sign(r.goalDiff)}</td><td class="tpts">${r.points}</td></tr>`;
    prev = i;
  }
  return `<h2 class="comp">${COMP_ICON[lg.name]}<span>Tabelle ${esc(lg.name)}</span></h2>
    <div class="card table-card"><table class="league">
      <thead><tr><th>#</th><th></th><th class="tn">Team</th><th>Sp</th><th>S</th><th>U</th><th>N</th><th>TD</th><th>Pkt</th></tr></thead>
      <tbody>${html}</tbody></table></div>`;
}

function weatherCard(p, compact = false) {
  const d = p.data;
  if (!d) return `<div class="card err">Wetter für ${esc(p.name)} nicht verfügbar</div>`;
  const c = d.current, w = wx(c.weather_code);
  const days = d.daily.time.map((t, i) => {
    const dw = wx(d.daily.weather_code[i]);
    return `<div><div class="d">${i === 0 ? 'Heute' : new Date(t).toLocaleDateString('de-DE', { weekday: 'short' })}</div>
      <div class="i">${dw.icon}</div>
      <div class="hi">${Math.round(d.daily.temperature_2m_max[i])}°</div>
      <div class="lo">${Math.round(d.daily.temperature_2m_min[i])}°</div>
      <div class="rain">💧${d.daily.precipitation_probability_max[i] ?? 0}%</div></div>`;
  }).join('');
  return `<div class="card">
    <div class="wx-place">${esc(p.name)}</div>
    <div class="wx-now">
      <div class="wx-icon">${w.icon}</div>
      <div>
        <div class="wx-temp">${Math.round(c.temperature_2m)}°C</div>
        <div class="sub">${w.text} · gefühlt ${Math.round(c.apparent_temperature)}°</div>
        ${compact ? '' : `<div class="sub">💨 ${Math.round(c.wind_speed_10m)} km/h · 💧 ${c.relative_humidity_2m}% · ☔ ${d.daily.precipitation_probability_max[0] ?? 0}%</div>`}
      </div>
    </div>
    ${compact ? '' : `<div class="wx-days">${days}</div>`}
  </div>`;
}

// ---------- Seiten ----------
const pages = {
  async home() {
    const [f1, svw, lfc, weather] = await Promise.all([loadF1(), loadMatches('svw'), loadMatches('lfc'), loadWeather()]);
    const next = [svw[0], lfc[0]].filter(Boolean).sort((a, b) => a.dt - b.dt);
    return `
      <div class="sections">
        <section><h2>Nächstes Rennen</h2>${raceCard(f1.next, false)}</section>
        <section><h2>Nächste Spiele</h2>${next.map(m => matchCard(m, { label: 'comp', withTeam: true })).join('') || '<div class="card">Keine Spiele gefunden</div>'}</section>
        <section><h2>Wetter jetzt</h2>${weather.map(p => weatherCard(p, true)).join('')}</section>
      </div>`;
  },

  async kalender() {
    const events = await loadCalendarEvents();
    const y = calMonth.getFullYear(), mo = calMonth.getMonth();
    const first = new Date(y, mo, 1);
    const offset = (first.getDay() + 6) % 7;            // Montag = erste Spalte
    const daysInMonth = new Date(y, mo + 1, 0).getDate();
    const key = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const byDay = {};
    events.forEach(e => (byDay[key(e.dt)] ??= []).push(e));
    const todayKey = key(new Date());

    let cells = '';
    for (let i = 0; i < offset; i++) cells += '<div class="cal-cell empty"></div>';
    for (let d = 1; d <= daysInMonth; d++) {
      const k = `${y}-${mo}-${d}`, evs = byDay[k] ?? [];
      const types = [...new Set(evs.map(e => e.type))];
      cells += `<button class="cal-cell ${k === todayKey ? 'today' : ''} ${k === calDay ? 'sel' : ''} ${evs.length ? 'has' : ''}" data-day="${k}">
        <span class="cal-num">${d}</span>
        <span class="dots">${types.map(t => `<i class="dot ${t}"></i>`).join('')}</span></button>`;
    }
    const selEvents = (byDay[calDay] ?? []).sort((a, b) => a.dt - b.dt);
    const [sy, sm, sd] = calDay.split('-').map(Number);
    const selDate = new Date(sy, sm, sd);
    const list = selEvents.map(e => `
      <div class="cal-event ${e.type}">
        <div class="ce-time">${fmtTime(e.dt)}</div>
        <div class="ce-body"><div class="ce-title">${e.icon} ${esc(e.title)}</div><div class="sub">${esc(e.sub)}</div></div>
      </div>`).join('') || '<div class="sub cal-none">Keine Termine an diesem Tag</div>';

    // Die nächsten Termine ab heute
    const upcoming = events.filter(e => e.dt > Date.now()).sort((a, b) => a.dt - b.dt).slice(0, 6).map(e => `
      <div class="cal-event ${e.type}">
        <div class="ce-time">${fmtDate(e.dt)}<br>${fmtTime(e.dt)}</div>
        <div class="ce-body"><div class="ce-title">${e.icon} ${esc(e.title)}</div><div class="sub">${esc(e.sub)}</div></div>
      </div>`).join('');

    return `<div class="cal-layout">
      <div class="card cal">
        <div class="cal-head">
          <button class="cal-nav" data-nav="-1" aria-label="Vorheriger Monat">‹</button>
          <div class="cal-title">${calMonth.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</div>
          <button class="cal-nav" data-nav="1" aria-label="Nächster Monat">›</button>
        </div>
        <div class="cal-grid">
          ${['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => `<div class="cal-wd">${d}</div>`).join('')}
          ${cells}
        </div>
        <div class="cal-legend"><span><i class="dot f1"></i>Formel 1</span><span><i class="dot svw"></i>Werder</span><span><i class="dot lfc"></i>Liverpool</span>
          <button class="cal-today" data-nav="0">Heute</button></div>
      </div>
      <div>
        <h2>${selDate.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
        <div class="card">${list}</div>
        <h2>Als Nächstes</h2>
        <div class="card">${upcoming || '<div class="sub">Keine Termine</div>'}</div>
      </div>
    </div>`;
  },

  async f1() {
    const f1 = await loadF1();
    const now = Date.now();
    const rest = f1.races.filter(r => r.dt > now && r !== f1.next);
    const pos = (p, champ) => `<span class="pos ${p === '1' && champ ? 'gold' : ''}" title="${p === '1' && champ ? 'Weltmeister' : ''}">${p}</span>`;
    const drivers = f1.standings.map(s => {
      const c = s.Constructors[0] ?? {}, col = teamColor(c.constructorId);
      return `<div class="row standing ${s.position === '1' && f1.driverChampion ? 'champion' : ''}" style="--team:${col}">
        ${pos(s.position, f1.driverChampion)}
        <span class="num">${esc(s.Driver.permanentNumber ?? '')}</span>
        <span class="name"><b>${esc(s.Driver.givenName)} ${esc(s.Driver.familyName)}</b>
          <span class="team-name">${esc(c.name)}</span></span>
        ${s.position === '1' && f1.driverChampion ? '<span class="champ">🏆 WM</span>' : ''}
        <span class="pts">${s.points}</span></div>`;
    }).join('');
    const teams = f1.constructors.map(s => {
      const col = teamColor(s.Constructor.constructorId);
      return `<div class="row standing ${s.position === '1' && f1.teamChampion ? 'champion' : ''}" style="--team:${col}">
        ${pos(s.position, f1.teamChampion)}
        <span class="swatch"></span>
        <span class="name"><b>${esc(s.Constructor.name)}</b></span>
        ${s.position === '1' && f1.teamChampion ? '<span class="champ">🏆 WM</span>' : ''}
        <span class="pts">${s.points}</span></div>`;
    }).join('');
    return `
      <h2>Nächstes Rennen</h2>${raceCard(f1.next)}
      <h2>Weitere Rennen</h2><div class="card f1card">${rest.map(r =>
        `<div class="row"><span class="name race-title">${flag(r.Circuit.Location.country)}${esc(r.raceName)}</span><span>${fmtDate(r.dt)}</span></div>`).join('') || 'Saison vorbei'}</div>
      <h2>Fahrer-WM</h2><div class="card f1card">${drivers || 'Keine Daten'}</div>
      <h2>Konstrukteurs-WM</h2><div class="card f1card">${teams || 'Keine Daten'}</div>`;
  },

  async fussball() {
    const [matches, table] = await Promise.all([loadMatches(footballTeam), loadTable(footballTeam)]);
    const seg = Object.entries(CFG.teams).map(([k, t]) =>
      `<button class="seg-btn ${k === footballTeam ? 'active' : ''}" data-team="${k}">${esc(t.name)}</button>`).join('');
    // Beide Teams gleiches Layout: nach Wettbewerb gruppiert, mit Icon
    const list = COMPS.map(c => {
      const g = matches.filter(m => m.comp === c);
      return g.length ? `<h2 class="comp">${COMP_ICON[c]}<span>${esc(c)}</span></h2><div class="match-list-grid">${g.map(m => matchCard(m)).join('')}</div>` : '';
    }).join('');
    return `<div class="seg">${seg}</div>
      ${tableCard(table, footballTeam)}
      ${list || '<div class="card">Keine kommenden Spiele gefunden</div>'}`;
  },

  async watching() {
    const recent = await loadRecent(footballTeam);
    const withVideos = await Promise.all(recent.map(async m => ({ m, videos: await findHighlights(m) })));
    const seg = Object.entries(CFG.teams).map(([k, t]) =>
      `<button class="seg-btn ${k === footballTeam ? 'active' : ''}" data-team="${k}">${esc(t.name)}</button>`).join('');
    const img = src => src ? `<img src="${esc(src)}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">` : '';
    const mins = s => s ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} Min.` : '';
    const q = m => encodeURIComponent(`${m.home} ${m.away}`);

    const cards = withVideos.map(({ m, videos }) => {
      const vids = videos.map(v => `
        <a class="video" href="${esc(v.url)}" target="_blank" rel="noopener">
          <div class="thumb">${img(v.img)}<span class="play">▶</span>${v.dur ? `<span class="dur">${mins(v.dur)}</span>` : ''}</div>
          <div class="v-info"><span class="sender ${v.sender === 'ZDF' ? 'zdf' : 'ard'}">${esc(v.sender)}</span>
            <div class="v-title">${esc(v.title)}</div><div class="sub">${esc(v.show || '')}</div></div>
        </a>`).join('');
      let fallback = '';
      if (!videos.length) {
        if (m.comp === 'Champions League') {
          fallback = `<div class="no-video">Champions-League-Highlights gibt es bei DAZN:</div>
            <div class="links"><a class="btn dazn" target="_blank" rel="noopener"
              href="https://www.youtube.com/results?search_query=${encodeURIComponent(`DAZN Highlights ${m.home} ${m.away} Champions League`)}">▶ DAZN Highlights</a></div>`;
        } else if (m.comp === 'Premier League') {
          const yt = sender => `https://www.youtube.com/results?search_query=${encodeURIComponent(`${sender} Premier League Highlights ${m.home} ${m.away}`)}`;
          fallback = `<div class="no-video">Premier-League-Highlights gibt es bei Sky und DAZN:</div>
            <div class="links">
              <a class="btn sky" target="_blank" rel="noopener" href="${yt('Sky Sport')}">▶ Sky Highlights</a>
              <a class="btn dazn" target="_blank" rel="noopener" href="${yt('DAZN')}">▶ DAZN Highlights</a>
            </div>`;
        } else {
          fallback = `<div class="no-video">Noch keine Zusammenfassung gefunden.</div>
            <div class="links">
              <a class="btn ard" target="_blank" rel="noopener" href="https://www.ardmediathek.de/suche/${q(m)}">Das Erste</a>
              <a class="btn zdf" target="_blank" rel="noopener" href="https://www.zdf.de/suche?q=${q(m)}">ZDF</a>
            </div>`;
        }
      }
      return `<div class="match-card ${m.team} watch-card">
        <div class="mc-head"><span>${esc(m.comp)} · ${esc(m.round)}</span><span class="mc-ha">${fmtDate(m.dt)}</span></div>
        <div class="mc-body">
          <div class="team">${img(m.homeLogo)}<span>${esc(m.home)}</span></div>
          <div class="result">${esc(m.hs)} : ${esc(m.as)}</div>
          <div class="team">${img(m.awayLogo)}<span>${esc(m.away)}</span></div>
        </div>
        <div class="videos">${vids}${fallback}</div>
      </div>`;
    }).join('');
    return `<div class="seg">${seg}</div><h2>Zusammenfassungen der letzten Spiele</h2>
      <div class="match-list-grid">${cards || '<div class="card">Keine beendeten Spiele gefunden</div>'}</div>`;
  },

  async wetter() {
    const weather = await loadWeather();
    return `<div class="wx-grid">${weather.map(p => weatherCard(p)).join('')}</div>`;
  },
};

// ---------- Farbschema je Ansicht ----------
function applyTheme() {
  const theme = currentTab === 'f1' ? 'f1'
    : (['fussball', 'watching'].includes(currentTab) && footballTeam === 'lfc') ? 'lfc' : 'svw';
  document.body.dataset.theme = theme;
  const colors = { svw: '#0b4d32', lfc: '#a5001c', f1: '#000000' };
  document.querySelector('meta[name=theme-color]').content = colors[theme];
}

// ---------- Navigation ----------
async function render(force = false) {
  if (force) Object.values(cache).forEach(c => c.t = 0);
  applyTheme();
  updateBgLogos();
  const btn = document.getElementById('refresh');
  btn.classList.add('spin');
  if (!view.innerHTML) view.innerHTML = '<div class="loading">Lade Termine …</div>';
  const token = ++renderToken;   // nur das zuletzt angeforderte Ergebnis anzeigen
  let html;
  try {
    html = await pages[currentTab]();
  } catch (e) {
    console.error(e);
    html = '<div class="err">Daten konnten nicht geladen werden. Internet prüfen und ⟳ drücken.</div>';
  }
  if (token === renderToken) {
    view.innerHTML = html;
    btn.classList.remove('spin');
  }
}
let renderToken = 0;

// Ziehen zum Aktualisieren (oben auf der Seite nach unten ziehen)
(() => {
  const ptr = document.getElementById('ptr');
  let startY = null, dist = 0;
  window.addEventListener('touchstart', e => {
    startY = window.scrollY <= 0 ? e.touches[0].clientY : null; dist = 0;
  }, { passive: true });
  window.addEventListener('touchmove', e => {
    if (startY === null) return;
    dist = Math.max(0, Math.min(120, e.touches[0].clientY - startY));
    ptr.style.opacity = dist / 80;
    ptr.style.transform = `translateY(${dist - 80}px) rotate(${dist * 3}deg)`;
  }, { passive: true });
  window.addEventListener('touchend', async () => {
    if (startY === null) return;
    startY = null;
    if (dist > 80) {
      ptr.classList.add('spin');
      await render(true);
      ptr.classList.remove('spin');
    }
    ptr.style.transition = 'transform .25s, opacity .25s';
    ptr.style.opacity = 0; ptr.style.transform = 'translateY(-80px)';
    setTimeout(() => ptr.style.transition = '', 300);
  });
})();

document.querySelector('.tabbar').addEventListener('click', e => {
  const b = e.target.closest('button[data-tab]');
  if (!b) return;
  document.querySelectorAll('.tabbar button').forEach(x => x.classList.toggle('active', x === b));
  currentTab = b.dataset.tab;
  window.scrollTo(0, 0);
  view.innerHTML = '';
  render();
});

view.addEventListener('click', e => {
  const seg = e.target.closest('.seg-btn');
  if (seg) {
    footballTeam = seg.dataset.team;
    localStorage.setItem('team', footballTeam);
    return render();
  }
  // Kalender: Tag wählen
  const day = e.target.closest('.cal-cell[data-day]');
  if (day) { calDay = day.dataset.day; return render(); }
  // Kalender: Monat wechseln / Heute
  const nav = e.target.closest('[data-nav]');
  if (nav) {
    const n = +nav.dataset.nav, now = new Date();
    if (n === 0) {
      calMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      calDay = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    } else {
      calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + n, 1);
      calDay = `${calMonth.getFullYear()}-${calMonth.getMonth()}-1`;
    }
    return render();
  }
});

// Kalender: Wischen nach links/rechts wechselt den Monat
(() => {
  let x0 = null, y0 = null;
  view.addEventListener('touchstart', e => {
    if (currentTab !== 'kalender' || !e.target.closest('.cal')) return;
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
  }, { passive: true });
  view.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + (dx < 0 ? 1 : -1), 1);
      calDay = `${calMonth.getFullYear()}-${calMonth.getMonth()}-1`;
      render();
    }
  });
})();

document.getElementById('refresh').addEventListener('click', () => render(true));

// Live-Countdowns; ist ein Timer abgelaufen, springt die Ansicht zur nächsten Session/zum nächsten Spiel
let lastDay = new Date().toDateString();
clearInterval(timer);
timer = setInterval(() => {
  let expired = false;
  document.querySelectorAll('[data-cd]').forEach(el => {
    const t = +el.dataset.cd;
    el.textContent = countdown(new Date(t));
    if (t <= Date.now()) expired = true;
  });
  if (expired) render();
  dailyRefresh();
}, 1000);

// Tägliche Aktualisierung: einmal pro Tag alle Daten frisch aus dem Netz holen
// (beim Start, beim Datumswechsel und beim Zurückkehren in die App)
function dailyRefresh() {
  const today = new Date().toDateString();
  if (localStorage.getItem('lastRefresh') === today) return false;
  localStorage.setItem('lastRefresh', today);
  lastDay = today;
  render(true);
  return true;
}

// Beim Zurückkehren in die App: neuer Tag → alles neu, sonst nur Ansicht auffrischen
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && !dailyRefresh()) render();
});

// Installierbar / offline
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').then(reg => reg.update());
}

// Als installierte App: Hochformat festhalten (Android); sonst greift der Hinweis "Handy hochkant halten"
try { screen.orientation?.lock?.('portrait').catch(() => {}); } catch {}

if (!dailyRefresh()) render();
