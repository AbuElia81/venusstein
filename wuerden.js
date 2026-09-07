/* ============================================================
   VENUSSTEIN — Wesentliche und zufaellige Wuerden
   ------------------------------------------------------------
   Grundgeruest: William Lilly, Christian Astrology (1647), S. 115.
   Zwei bewusste Abweichungen, durchgaengig angewandt:
     - Termini nach der aegyptischen Tafel statt der ptolemaeischen
     - Ganzzeichenhaeuser statt Regiomontanus
   Triplizitaeten bleiben ptolemaeisch, wie bei Lilly.
   ============================================================ */
(function (root) {
'use strict';

var P = { SA:'Saturn', JU:'Jupiter', MA:'Mars', SO:'Sonne', VE:'Venus', ME:'Merkur', LU:'Mond' };
var SIGNS = ['Widder','Stier','Zwillinge','Krebs','Löwe','Jungfrau',
             'Waage','Skorpion','Schütze','Steinbock','Wassermann','Fische'];
/* Der Variationsselektor U+FE0E erzwingt die Schrift- statt der Emojidarstellung */
var VS = '\uFE0E';
var GLYPH = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']
            .map(function (g) { return g + VS; });
var ELEMENT = ['Feuer','Erde','Luft','Wasser'];

/* Domizile je Zeichen */
var DOMICILE = [P.MA,P.VE,P.ME,P.LU,P.SO,P.ME,P.VE,P.MA,P.JU,P.SA,P.SA,P.JU];

/* Erhoehungen: Planet -> [Zeichen, Grad] */
var EXALT = { Sonne:[0,19], Mond:[1,3], Merkur:[5,15], Venus:[11,27],
              Mars:[9,28], Jupiter:[3,15], Saturn:[6,21] };

/* Triplizitaeten nach Ptolemaios/Lilly: [Tag, Nacht] */
var TRIPL = { Feuer:[P.SO,P.JU], Erde:[P.VE,P.LU], Luft:[P.SA,P.ME], Wasser:[P.MA,P.MA] };

/* Aegyptische Termini: je Zeichen [Planet, bis Grad] */
var TERMS = [
 [[P.JU,6],[P.VE,12],[P.ME,20],[P.MA,25],[P.SA,30]],
 [[P.VE,8],[P.ME,14],[P.JU,22],[P.SA,27],[P.MA,30]],
 [[P.ME,6],[P.JU,12],[P.VE,17],[P.MA,24],[P.SA,30]],
 [[P.MA,7],[P.VE,13],[P.ME,19],[P.JU,26],[P.SA,30]],
 [[P.JU,6],[P.VE,11],[P.SA,18],[P.ME,24],[P.MA,30]],
 [[P.ME,7],[P.VE,17],[P.JU,21],[P.MA,28],[P.SA,30]],
 [[P.SA,6],[P.ME,14],[P.JU,21],[P.VE,28],[P.MA,30]],
 [[P.MA,7],[P.VE,11],[P.ME,19],[P.JU,24],[P.SA,30]],
 [[P.JU,12],[P.VE,17],[P.ME,21],[P.SA,26],[P.MA,30]],
 [[P.ME,7],[P.JU,14],[P.VE,22],[P.SA,26],[P.MA,30]],
 [[P.ME,7],[P.VE,13],[P.JU,20],[P.MA,25],[P.SA,30]],
 [[P.VE,12],[P.JU,16],[P.ME,19],[P.MA,28],[P.SA,30]]
];

/* Gesichter: chaldaeische Reihe, beginnend mit Mars auf 0 Grad Widder */
var CHALD = [P.SA,P.JU,P.MA,P.SO,P.VE,P.ME,P.LU];
var FACES = (function () { var a = [], i;
  for (i = 0; i < 36; i++) a.push(CHALD[(i + 2) % 7]); return a; })();

var opp = function (s) { return (s + 6) % 12; };
function elementOf(sign) { return ELEMENT[sign % 4]; }
function termRuler(sign, degInSign) {
  var t = TERMS[sign];
  for (var i = 0; i < t.length; i++) if (degInSign < t[i][1]) return t[i][0];
  return t[4][0];
}
function faceRuler(sign, degInSign) {
  return FACES[sign * 3 + Math.min(2, Math.floor(degInSign / 10))];
}

/* ---------- Wesentliche Wuerden eines Planeten ---------- */
function essential(planet, sign, degInSign, isDay) {
  var out = [], score = 0;
  if (DOMICILE[sign] === planet)      { out.push(['Domizil', 5]); score += 5; }
  if (DOMICILE[opp(sign)] === planet) { out.push(['Exil', -5]);   score -= 5; }
  var ex = EXALT[planet];
  if (ex) {
    if (ex[0] === sign)      { out.push(['Erhöhung', 4]); score += 4; }
    if (opp(ex[0]) === sign) { out.push(['Fall', -4]);    score -= 4; }
  }
  var tr = TRIPL[elementOf(sign)];
  if ((isDay ? tr[0] : tr[1]) === planet) { out.push(['Triplizität', 3]); score += 3; }
  if (termRuler(sign, degInSign) === planet) { out.push(['Terminus', 2]); score += 2; }
  if (faceRuler(sign, degInSign) === planet) { out.push(['Gesicht', 1]);  score += 1; }

  var hasDignity = out.some(function (r) { return r[1] > 0; });
  var inDebility = out.some(function (r) { return r[1] < 0; });
  /* Peregrin nur, wenn der Planet weder Wuerde noch Exil/Fall hat —
     so wird eine Position nicht zweifach bestraft. */
  if (!hasDignity && !inDebility) { out.push(['Peregrin', -5]); score -= 5; }
  return { rows: out, score: score,
           ruler: DOMICILE[sign], term: termRuler(sign, degInSign),
           face: faceRuler(sign, degInSign) };
}

/* ---------- Zufaellige Wuerden nach Lillys Tafel ---------- */
var HOUSE_SCORE = { 1:5, 10:5, 7:4, 4:4, 11:4, 2:3, 5:3, 9:2, 3:1, 8:-4, 6:-4, 12:-5 };
var ORB_PARTILE = 1.0;

function accidental(name, ch, opt) {
  var p = ch.planets[name], sun = ch.planets['Sonne'], out = [], score = 0;
  var A = root.Astro;
  function add(label, pts) { out.push([label, pts]); score += pts; }

  /* Ohne Geburtszeit steht der Aszendent nicht fest, also auch die Haeuser
     nicht — dann bleibt die Hauswertung aussen vor. */
  if (!(opt && opt.ohneHaeuser)) add('Haus ' + p.house, HOUSE_SCORE[p.house]);

  if (name !== 'Sonne' && name !== 'Mond') {
    if (p.retrograde) add('rückläufig', -5); else add('direktläufig', 4);
  }
  /* Lilly fuehrt auch fuer die Sonne eine mittlere Bewegung, darum gilt
     schnell/langsam fuer alle sieben. Direkt/rueckläufig dagegen nicht fuer
     Sonne und Mond — die laufen nie rueckwaerts. */
  add(p.swift ? 'schnell' : 'langsam', p.swift ? 2 : -2);

  /* Verhaeltnis zur Sonne */
  if (name !== 'Sonne') {
    var d = A.arc(p.lon - sun.lon), ad = Math.abs(d);
    if (ad <= 17 / 60)      add('Cazimi', 5);
    else if (ad <= 8.5)     add('verbrannt', -5);
    else if (ad <= 17)      add('unter den Sonnenstrahlen', -4);
    else                    add('frei von der Sonne', 5);
    /* Oriental heisst: der Planet geht vor der Sonne auf, steht also
       in den 180 Grad vor ihr. */
    var oriental = d < 0;
    if (name === 'Saturn' || name === 'Jupiter' || name === 'Mars')
      add(oriental ? 'orientalisch' : 'okzidentalisch', oriental ? 2 : -2);
    if (name === 'Merkur' || name === 'Venus')
      add(oriental ? 'orientalisch' : 'okzidentalisch', oriental ? -2 : 2);
  }
  if (name === 'Mond') {
    var el = A.norm(p.lon - sun.lon);
    add(el < 180 ? 'zunehmend an Licht' : 'abnehmend an Licht', el < 180 ? 2 : -2);
  }

  /* Partile Konjunktionen mit Wohltaetern und Uebeltaetern */
  ['Jupiter','Venus'].forEach(function (b) {
    if (b !== name && Math.abs(A.arc(p.lon - ch.planets[b].lon)) <= ORB_PARTILE)
      add('partil bei ' + b, 5); });
  ['Saturn','Mars'].forEach(function (m) {
    if (m !== name && Math.abs(A.arc(p.lon - ch.planets[m].lon)) <= ORB_PARTILE)
      add('partil bei ' + m, -5); });

  /* Mondknoten */
  if (Math.abs(A.arc(p.lon - ch.node)) <= ORB_PARTILE) add('partil beim Drachenkopf', 4);
  if (Math.abs(A.arc(p.lon - ch.node - 180)) <= ORB_PARTILE) add('partil beim Drachenschwanz', -4);

  /* Belagerung: der Planet steht zwischen Saturn und Mars, beide in Reichweite.
     Vereinfachte Fassung der Lehre — beide Uebeltaeter innerhalb von 30 Grad,
     einer voraus, einer zurueck. */
  if (name !== 'Saturn' && name !== 'Mars') {
    var ds = A.arc(ch.planets['Saturn'].lon - p.lon),
        dm = A.arc(ch.planets['Mars'].lon - p.lon);
    if (ds * dm < 0 && Math.abs(ds) <= 30 && Math.abs(dm) <= 30)
      add('belagert von Saturn und Mars', -5);
  }

  /* Fixsterne */
  if (Math.abs(A.arc(p.lon - ch.stars.regulus)) <= ORB_PARTILE) add('bei Cor Leonis', 6);
  if (Math.abs(A.arc(p.lon - ch.stars.spica))   <= ORB_PARTILE) add('bei Spica', 5);
  if (Math.abs(A.arc(p.lon - ch.stars.algol))   <= ORB_PARTILE) add('bei Caput Algol', -5);

  return { rows: out, score: score };
}

/* ---------- Gesamturteil ---------- */
function verdict(total) {
  if (total >= 10) return { label: 'sehr stark',      key: 'sehr-stark' };
  if (total >= 5)  return { label: 'stark',           key: 'stark' };
  if (total >= 0)  return { label: 'mittel',          key: 'mittel' };
  if (total >= -5) return { label: 'geschwächt',      key: 'schwach' };
  return              { label: 'stark geschwächt', key: 'sehr-schwach' };
}

function judge(ch, opt) {
  var res = {};
  ch.order.forEach(function (n) {
    var p = ch.planets[n];
    var e = essential(n, p.sign, p.degInSign, ch.isDay);
    var a = accidental(n, ch, opt);
    var total = e.score + a.score;
    res[n] = { name: n, essential: e, accidental: a,
               total: total, verdict: verdict(total),
               sign: p.sign, signName: SIGNS[p.sign], glyph: GLYPH[p.sign],
               house: p.house, lon: p.lon, degInSign: p.degInSign,
               retrograde: p.retrograde };
  });
  var ranked = ch.order.slice().sort(function (a, b) { return res[a].total - res[b].total; });
  return { planets: res, ranked: ranked, weakest: ranked.slice(0, 3) };
}

var api = { judge: judge, essential: essential, accidental: accidental,
            SIGNS: SIGNS, GLYPH: GLYPH, DOMICILE: DOMICILE, EXALT: EXALT,
            TERMS: TERMS, FACES: FACES, TRIPL: TRIPL,
            termRuler: termRuler, faceRuler: faceRuler, elementOf: elementOf };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
root.Wuerden = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
