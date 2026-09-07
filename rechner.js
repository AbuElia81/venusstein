/* ============================================================
   VENUSSTEIN — Bedienung und Darstellung des Rechners
   ============================================================ */
(function () {
'use strict';

var VS = '\uFE0E';                       /* zwingt zur Schriftdarstellung */
var PL = {
  Saturn:  { g:'♄'+VS, f:'var(--sat)' }, Jupiter:{ g:'♃'+VS, f:'var(--jup)' },
  Mars:    { g:'♂'+VS, f:'var(--mar)' }, Sonne:  { g:'☉'+VS, f:'var(--sol)' },
  Venus:   { g:'♀'+VS, f:'var(--ven)' }, Merkur: { g:'☿'+VS, f:'var(--mer)' },
  Mond:    { g:'☽'+VS, f:'var(--lun)' }
};
var SIGNS = Wuerden.SIGNS, GLYPH = Wuerden.GLYPH;
var SYMBOL = "'Apple Symbols','Segoe UI Symbol','DejaVu Sans',serif";
var $ = function (id) { return document.getElementById(id); };
var norm = Astro.norm;

function grad(x) {                      /* 12.53 -> 12°32' */
  var g = Math.floor(x), m = Math.round((x - g) * 60);
  if (m === 60) { g += 1; m = 0; }
  return g + '°' + (m < 10 ? '0' : '') + m + "'";
}
function stand(lon) {
  var s = Math.floor(lon / 30);
  return grad(lon % 30) + ' ' + GLYPH[s] + ' ' + SIGNS[s];
}
function vz(n) { return (n > 0 ? '+' : '') + n; }
function klasse(n) { return n > 0 ? 'plus' : (n < 0 ? 'minus' : ''); }

/* ---------- Formular vorbereiten ---------- */
var ortWahl = $('ort');
Orte.ORTE.forEach(function (o, i) {
  var opt = document.createElement('option');
  opt.value = i; opt.textContent = o[0];
  if (o[0] === 'München') opt.selected = true;
  ortWahl.appendChild(opt);
});
var eigen = document.createElement('option');
eigen.value = 'eigen'; eigen.textContent = '— Koordinaten selbst eingeben —';
ortWahl.appendChild(eigen);

var zonenWahl = $('zone');
for (var z = -12; z <= 14; z += 0.5) {
  var o = document.createElement('option');
  o.value = z;
  o.textContent = 'UTC' + (z >= 0 ? '+' : '−') + Math.floor(Math.abs(z)) +
                  (Math.abs(z) % 1 ? ':30' : ':00');
  if (z === 1) o.selected = true;
  zonenWahl.appendChild(o);
}

function eigenModus() { return ortWahl.value === 'eigen'; }
function ortWechsel() {
  var e = eigenModus();
  ['feldBreite','feldLaenge','feldZone'].forEach(function (id) { $(id).hidden = !e; });
  zonenHinweis();
}
ortWahl.addEventListener('change', ortWechsel);
['datum','zeit'].forEach(function (id) { $(id).addEventListener('change', zonenHinweis); });

function zonenHinweis() {
  var h = $('zonenhinweis');
  if (eigenModus()) {
    h.textContent = 'Bei eigenen Koordinaten musst du die damals geltende Zeitzone selbst wählen — '
                  + 'für Mitteleuropa im Sommer meist UTC+2, im Winter UTC+1.';
    return;
  }
  var d = daten();
  if (!d) { h.textContent = ''; return; }
  var v = Orte.zonenVersatz(d.tz, d.year, d.month, d.day, d.hour, d.minute);
  h.textContent = 'Zeitzone ' + d.tz + ' — am Geburtstag galt UTC'
                + (v >= 0 ? '+' : '−') + Math.abs(v) + '. '
                + 'Sommerzeit und historische Regelungen sind dabei berücksichtigt.';
}

function daten() {
  var dv = $('datum').value, tv = $('zeit').value;
  if (!dv || !tv) return null;
  var dp = dv.split('-').map(Number), tp = tv.split(':').map(Number);
  var b = { year: dp[0], month: dp[1], day: dp[2], hour: tp[0], minute: tp[1] };
  if (eigenModus()) {
    b.lat = parseFloat($('breite').value);
    b.lon = parseFloat($('laenge').value);
    b.versatz = parseFloat($('zone').value);
    b.ortName = 'eigene Koordinaten';
  } else {
    var o = Orte.ORTE[+ortWahl.value];
    b.lat = o[1]; b.lon = o[2]; b.tz = o[3]; b.ortName = o[0];
  }
  return b;
}

/* ============================================================
   Rundes Radix
   ============================================================ */
function zeichneRund(ch, urteil) {
  var svg = $('radix'), c = 500, basis = ch.ascSign * 30;
  var R = { aussen:472, tk_a:472, tk_i:452, band_i:396, planet:336, marke:300, haus_a:246, haus_i:196 };
  var teile = [];

  function pt(lon, r) {
    var a = (180 + norm(lon - basis)) * Math.PI / 180;
    return [c + r * Math.cos(a), c - r * Math.sin(a)];
  }
  function line(l, r1, r2, stroke, w, extra) {
    var a = pt(l, r1), b = pt(l, r2);
    teile.push('<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) +
      '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) +
      '" stroke="' + stroke + '" stroke-width="' + w + '"' + (extra || '') + '/>');
  }
  function kreis(r, stroke, w, fill) {
    teile.push('<circle cx="' + c + '" cy="' + c + '" r="' + r + '" fill="' + (fill || 'none') +
      '" stroke="' + stroke + '" stroke-width="' + w + '"/>');
  }
  function text(l, r, s, opt) {
    var p = pt(l, r); opt = opt || {};
    teile.push('<text x="' + p[0].toFixed(1) + '" y="' + p[1].toFixed(1) +
      '" text-anchor="middle" dominant-baseline="central" font-size="' + (opt.size || 26) +
      '" fill="' + (opt.fill || '#2b2117') + '" font-family="' + (opt.font || "'Cinzel',serif") +
      '"' + (opt.weight ? ' font-weight="' + opt.weight + '"' : '') + '>' + s + '</text>');
  }

  /* Grundringe */
  teile.push('<circle cx="500" cy="500" r="472" fill="#fbf5e6"/>');
  kreis(R.aussen, '#a8801f', 3);
  kreis(R.band_i, '#a8801f', 1.5);
  kreis(R.haus_a, 'rgba(43,33,23,.35)', 1);
  kreis(R.haus_i, 'rgba(43,33,23,.2)', 1);
  kreis(R.marke, 'rgba(43,33,23,.12)', 1);

  /* Gradteilung */
  for (var d = 0; d < 360; d++) {
    var lang = d % 10 === 0, mittel = d % 5 === 0;
    if (!mittel && !lang) continue;
    line(basis + d, R.tk_a, lang ? R.tk_i - 8 : R.tk_i, 'rgba(43,33,23,.4)', lang ? 1.4 : .8);
  }

  /* Zeichen und Haeuser — bei Ganzzeichenhaeusern faellt beides zusammen */
  for (var i = 0; i < 12; i++) {
    var sign = (ch.ascSign + i) % 12, start = sign * 30;
    line(start, R.haus_i, R.aussen, i % 3 === 0 ? '#8f2c21' : 'rgba(43,33,23,.45)', i % 3 === 0 ? 2.2 : 1.1);
    text(start + 15, 424, GLYPH[sign], { size: 34, fill: '#8f2c21', font: SYMBOL });
    text(start + 15, 221, String(i + 1), { size: 22, fill: 'rgba(43,33,23,.55)' });
    /* Zeichennamen ganz aussen, leicht gedreht waere schoener, hier schlicht */
  }

  /* Aszendent und Medium Coeli */
  [[ch.asc, 'ASC', '#8f2c21'], [ch.mc, 'MC', '#a8801f']].forEach(function (m) {
    line(m[0], R.haus_i, R.aussen + 14, m[2], 2.6);
    var p = pt(m[0], R.aussen + 34);
    teile.push('<text x="' + p[0].toFixed(1) + '" y="' + p[1].toFixed(1) +
      '" text-anchor="middle" dominant-baseline="central" font-size="21" fill="' + m[2] +
      '" font-family="\'Cinzel\',serif" font-weight="600">' + m[1] + '</text>');
  });

  /* Planeten, gegen Ueberdeckung auseinandergerueckt */
  var liste = ch.order.map(function (n) {
    return { n: n, echt: norm(ch.planets[n].lon - basis) };
  }).sort(function (a, b) { return a.echt - b.echt; });
  liste.forEach(function (p) { p.zeig = p.echt; });
  var MIN = 11;
  for (var runde = 0; runde < 220; runde++) {
    for (var k = 0; k < liste.length; k++) {
      var a = liste[k], b = liste[(k + 1) % liste.length];
      var l = norm(b.zeig - a.zeig);
      if (l < MIN) { var s = (MIN - l) / 2; a.zeig = norm(a.zeig - s); b.zeig = norm(b.zeig + s); }
    }
  }
  liste.forEach(function (p) {
    var farbe = getComputedStyle(document.documentElement)
      .getPropertyValue(PL[p.n].f.replace('var(', '').replace(')', '')).trim() || '#2b2117';
    var rueck = ch.planets[p.n].retrograde;
    line(basis + p.echt, R.marke, R.marke + 16, farbe, 2);              /* wahre Stelle */
    var a = pt(basis + p.echt, R.marke + 16), b2 = pt(basis + p.zeig, R.planet - 26);
    teile.push('<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' +
      b2[0].toFixed(1) + '" y2="' + b2[1].toFixed(1) + '" stroke="' + farbe +
      '" stroke-width="1" opacity=".5"/>');
    text(basis + p.zeig, R.planet, PL[p.n].g, { size: 42, fill: farbe, font: SYMBOL });
    text(basis + p.zeig, R.planet - 40, grad(ch.planets[p.n].lon % 30) + (rueck ? ' ℞' : ''),
         { size: 17, fill: farbe });
    var u = urteil.planets[p.n];
    text(basis + p.zeig, R.planet + 38, vz(u.total),
         { size: 18, fill: u.total < 0 ? '#8f2c21' : '#3f6b45', weight: 600 });
  });

  /* Mitte */
  teile.push('<circle cx="500" cy="500" r="196" fill="rgba(255,253,247,.75)"/>');
  var nm = $('name').value.trim();
  var mitte = [nm || '', ch.isDay ? 'Tagesgeburt' : 'Nachtgeburt',
               'ASC ' + stand(ch.asc)].filter(Boolean);
  mitte.forEach(function (t, i) {
    teile.push('<text x="500" y="' + (500 - (mitte.length - 1) * 17 + i * 34) +
      '" text-anchor="middle" dominant-baseline="central" font-size="' + (i === 0 ? 27 : 21) +
      '" fill="' + (i === 0 ? '#2b2117' : '#6d5e47') + '" font-family="\'Cinzel\',serif">' +
      t.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</text>');
  });

  svg.innerHTML = teile.join('');
}

/* ============================================================
   Quadratische Figur nach mittelalterlichem Vorbild
   ============================================================ */
function zeichneEckig(ch, urteil) {
  var svg = $('radix');
  var o = 40, O = 960, c = 500, d = 150;
  var p = (o + c) / 2, q = (O + c) / 2, e = c - d / 2, f = c + d / 2;
  var T = [c, o], Rr = [O, c], B = [c, O], L = [o, c];
  var Ti = [c, c - d], Ri = [c + d, c], Bi = [c, c + d], Li = [c - d, c];

  /* Die zwoelf Felder gegen den Uhrzeigersinn, beginnend links */
  var felder = {
    1:  [[p,p], L, [p,q], [e,f], Li, [e,e]],
    2:  [L, [p,q], [o,O]],
    3:  [[o,O], [p,q], B],
    4:  [[p,q], B, [q,q], [f,f], Bi, [e,f]],
    5:  [B, [q,q], [O,O]],
    6:  [[O,O], [q,q], Rr],
    7:  [[q,q], Rr, [q,p], [f,e], Ri, [f,f]],
    8:  [Rr, [q,p], [O,o]],
    9:  [[O,o], [q,p], T],
    10: [[q,p], T, [p,p], [e,e], Ti, [f,e]],
    11: [T, [p,p], [o,o]],
    12: [[o,o], [p,p], L]
  };
  function mittelpunkt(pts, winkelhaus) {
    var x = 0, y = 0; pts.forEach(function (t) { x += t[0]; y += t[1]; });
    x /= pts.length; y /= pts.length;
    /* Bei den vier Winkelhaeusern reicht das Mittelfeld bis dicht an den
       Schwerpunkt heran — die Beschriftung wandert darum nach aussen. */
    if (winkelhaus) { x = c + (x - c) * 1.2; y = c + (y - c) * 1.2; }
    return [x, y];
  }
  var teile = ['<rect x="40" y="40" width="920" height="920" fill="#fbf5e6" stroke="#a8801f" stroke-width="3"/>'];

  Object.keys(felder).forEach(function (h) {
    var pts = felder[h], sign = (ch.ascSign + (+h - 1)) % 12;
    teile.push('<polygon points="' + pts.map(function (t) { return t[0] + ',' + t[1]; }).join(' ') +
      '" fill="none" stroke="' + (+h % 3 === 1 ? '#8f2c21' : 'rgba(43,33,23,.45)') +
      '" stroke-width="' + (+h % 3 === 1 ? 2 : 1.2) + '"/>');
    var m = mittelpunkt(pts, +h % 3 === 1);
    /* Hausnummer und Zeichen */
    teile.push('<text x="' + m[0].toFixed(0) + '" y="' + (m[1] - 46).toFixed(0) +
      '" text-anchor="middle" font-size="19" fill="rgba(43,33,23,.5)" font-family="\'Cinzel\',serif">' +
      h + '</text>');
    teile.push('<text x="' + m[0].toFixed(0) + '" y="' + (m[1] - 16).toFixed(0) +
      '" text-anchor="middle" font-size="30" fill="#8f2c21" font-family="' + SYMBOL.replace(/"/g,"'") + '">' + GLYPH[sign] + '</text>');
    /* Planeten dieses Hauses */
    var drin = ch.order.filter(function (n) { return ch.planets[n].house === +h; });
    drin.forEach(function (n, i) {
      var u = urteil.planets[n];
      teile.push('<text x="' + m[0].toFixed(0) + '" y="' + (m[1] + 18 + i * 30).toFixed(0) +
        '" text-anchor="middle" font-size="25" font-family="' + SYMBOL.replace(/"/g, "'") +
        '" fill="' + farbeVon(n) + '">' +
        PL[n].g + ' ' + grad(ch.planets[n].lon % 30) +
        (ch.planets[n].retrograde ? ' ℞' : '') + ' ' + vz(u.total) + '</text>');
    });
  });

  /* Mittelfeld */
  teile.push('<polygon points="' + [Ti, Ri, Bi, Li].map(function (t) { return t[0] + ',' + t[1]; }).join(' ') +
    '" fill="rgba(255,253,247,.9)" stroke="#a8801f" stroke-width="1.6"/>');
  var nm = $('name').value.trim();
  var zeilen = [nm || 'Nativität', ch.isDay ? 'Tagesgeburt' : 'Nachtgeburt', 'ASC ' + stand(ch.asc)];
  zeilen.forEach(function (t, i) {
    teile.push('<text x="500" y="' + (470 + i * 32) + '" text-anchor="middle" font-size="' +
      (i === 0 ? 24 : 19) + '" fill="' + (i === 0 ? '#2b2117' : '#6d5e47') +
      '" font-family="\'Cinzel\',serif">' + t.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</text>');
  });

  svg.innerHTML = teile.join('');
}

function farbeVon(n) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(PL[n].f.replace('var(', '').replace(')', '')).trim() || '#2b2117';
}

/* ============================================================
   Tabellen, Rangliste, Empfehlungen
   ============================================================ */
function rangliste(urteil) {
  var werte = urteil.ranked.map(function (n) { return urteil.planets[n].total; });
  var min = Math.min.apply(null, werte.concat([0])), max = Math.max.apply(null, werte.concat([0]));
  var spanne = Math.max(max - min, 1);
  $('rangliste').innerHTML = urteil.ranked.map(function (n) {
    var u = urteil.planets[n], farbe = farbeVon(n);
    var links = (0 - min) / spanne * 100, breite = Math.abs(u.total) / spanne * 100;
    var start = u.total >= 0 ? links : links - breite;
    return '<div class="rang">' +
      '<span class="rang-glyph" style="color:' + farbe + '">' + PL[n].g + '</span>' +
      '<span class="rang-name">' + n + '</span>' +
      '<span class="rang-balken"><i style="left:' + start + '%;width:' + breite +
        '%;background:' + farbe + '"></i></span>' +
      '<span class="rang-wert ' + klasse(u.total) + '">' + vz(u.total) + '</span></div>';
  }).join('');
}

function standTabelle(ch, urteil) {
  var kopf = '<thead><tr><th>Planet</th><th>Stand</th><th>Haus</th><th class="zahl">Würden</th></tr></thead>';
  var leib = ch.order.map(function (n) {
    var u = urteil.planets[n];
    return '<tr><td><span style="color:' + farbeVon(n) + '">' + PL[n].g + '</span> ' + n + '</td>' +
      '<td>' + grad(u.degInSign) + ' ' + u.glyph + ' ' + u.signName +
      (u.retrograde ? ' <span title="rückläufig">℞</span>' : '') + '</td>' +
      '<td>' + u.house + '</td>' +
      '<td class="zahl ' + klasse(u.total) + '">' + vz(u.total) + '</td></tr>';
  }).join('');
  $('standTabelle').innerHTML = kopf + '<tbody>' + leib + '</tbody>';
}

function steinKarte(s) {
  var zeilen = [['Bestimmung', s.modern], ['Bezug', s.bezug], ['Preis', s.preis]];
  if (s.form) zeilen.push(['Form', s.form]);
  return '<div class="stein">' +
    '<h4>' + (s.haupt ? '<span class="krone" title="Hauptstein">✦</span> ' : '') + s.name + '</h4>' +
    (s.lat && s.lat !== '—' ? '<div class="lat">bei Agrippa: ' + s.lat + '</div>' : '') +
    '<dl>' + zeilen.map(function (z) {
      return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>';
    }).join('') + '</dl>' +
    (s.hinweis ? '<p class="anm">' + s.hinweis + '</p>' : '') + '</div>';
}

function empfehlungen(urteil) {
  var drei = Steine.empfehlung(urteil, 3);
  var schwach = drei.filter(function (e) { return e.urteil.total < 5; });
  var ziel = schwach.length ? schwach : drei.slice(0, 1);

  $('empfehlungText').innerHTML = schwach.length
    ? 'Am schwächsten stehen ' + ziel.map(function (e) {
        return '<strong>' + e.planet + '</strong> (' + vz(e.urteil.total) + ')'; }).join(', ') +
      '. Nach der Lehre der Lapidarien reicht der Stein nach, was dem Planeten am Himmel fehlt.'
    : 'In diesem Horoskop steht kein Planet ausgesprochen schwach. Genannt sei darum nur ' +
      'der schwächste unter starken: <strong>' + ziel[0].planet + '</strong> (' +
      vz(ziel[0].urteil.total) + ').';

  $('empfehlungen').innerHTML = ziel.map(function (e) {
    var l = e.lapidarium, farbe = farbeVon(e.planet);
    return '<div class="planet-block" style="border-color:' + farbe + '">' +
      '<div class="planet-kopf"><span class="g" style="color:' + farbe + '">' + l.glyph + '</span>' +
      '<h3 style="color:' + farbe + '">' + e.planet + '</h3>' +
      '<span class="planet-stand">' + grad(e.urteil.degInSign) + ' ' + e.urteil.glyph + ' ' +
      e.urteil.signName + ' · Haus ' + e.urteil.house + '</span>' +
      '<span class="urteil" style="color:' + farbe + '">' + e.urteil.verdict.label +
      ' · ' + vz(e.urteil.total) + '</span></div>' +
      '<p style="max-width:44rem">' + l.mangel + '</p>' +
      '<p class="hinweis" style="max-width:44rem">' + l.quelle + '</p>' +
      '<div class="stein-gitter">' + l.steine.map(steinKarte).join('') + '</div></div>';
  }).join('');
}

function einzelheiten(ch, urteil) {
  $('details').innerHTML = ch.order.map(function (n) {
    var u = urteil.planets[n], farbe = farbeVon(n);
    function liste(rows) {
      if (!rows.length) return '<li><span>keine</span><span>—</span></li>';
      return rows.map(function (r) {
        return '<li><span>' + r[0] + '</span><span class="' + klasse(r[1]) + '">' + vz(r[1]) + '</span></li>';
      }).join('');
    }
    return '<div class="planet-block" style="border-color:' + farbe + '">' +
      '<div class="planet-kopf"><span class="g" style="color:' + farbe + '">' + PL[n].g + '</span>' +
      '<h3 style="color:' + farbe + '">' + n + '</h3>' +
      '<span class="planet-stand">' + grad(u.degInSign) + ' ' + u.glyph + ' ' + u.signName +
      ' · Haus ' + u.house + (u.retrograde ? ' · rückläufig' : '') + '</span>' +
      '<span class="urteil" style="color:' + farbe + '">' + u.verdict.label + ' · ' + vz(u.total) + '</span>' +
      '</div><div class="wuerdenpaar">' +
      '<div><p class="klein-kapital">Wesentliche Würden — ' + vz(u.essential.score) + '</p>' +
      '<ul class="wuerdenliste">' + liste(u.essential.rows) + '</ul></div>' +
      '<div><p class="klein-kapital">Zufällige Würden — ' + vz(u.accidental.score) + '</p>' +
      '<ul class="wuerdenliste">' + liste(u.accidental.rows) + '</ul></div></div></div>';
  }).join('');
}

/* ============================================================
   Ablauf
   ============================================================ */
var letztes = null, form = 'rund';

function zeichne() {
  if (!letztes) return;
  (form === 'rund' ? zeichneRund : zeichneEckig)(letztes.ch, letztes.urteil);
  $('btnRund').setAttribute('aria-pressed', form === 'rund');
  $('btnEckig').setAttribute('aria-pressed', form === 'eckig');
}
$('btnRund').addEventListener('click', function () { form = 'rund'; zeichne(); });
$('btnEckig').addEventListener('click', function () { form = 'eckig'; zeichne(); });

$('form').addEventListener('submit', function (ev) {
  ev.preventDefault();
  $('fehler').textContent = '';
  var b = daten();
  if (!b) { $('fehler').textContent = 'Bitte Datum und Uhrzeit angeben.'; return; }
  if (isNaN(b.lat) || isNaN(b.lon)) { $('fehler').textContent = 'Die Koordinaten sind unvollständig.'; return; }

  var versatz = eigenModus() ? b.versatz
    : Orte.zonenVersatz(b.tz, b.year, b.month, b.day, b.hour, b.minute);

  var ch = Astro.chart({ year: b.year, month: b.month, day: b.day,
                         hour: b.hour, minute: b.minute, tz: versatz,
                         lat: b.lat, lon: b.lon });
  var urteil = Wuerden.judge(ch);
  letztes = { ch: ch, urteil: urteil, b: b };

  var nm = $('name').value.trim();
  $('ergebnisKopf').textContent = nm ? 'Das Radix für ' + nm : 'Das Radix';
  $('ergebnisUnter').textContent =
    String(b.day).padStart(2, '0') + '.' + String(b.month).padStart(2, '0') + '.' + b.year +
    ' um ' + String(b.hour).padStart(2, '0') + ':' + String(b.minute).padStart(2, '0') +
    ' · ' + b.ortName + ' · UTC' + (versatz >= 0 ? '+' : '−') + Math.abs(versatz) +
    ' · ' + (ch.isDay ? 'Tagesgeburt' : 'Nachtgeburt');

  $('ergebnis').hidden = false;
  zeichne();
  rangliste(urteil);
  standTabelle(ch, urteil);
  empfehlungen(urteil);
  einzelheiten(ch, urteil);
  $('ergebnis').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

ortWechsel();
})();
