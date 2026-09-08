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

/* ---------- Ortssuche ----------
   Tippen statt scrollen: die Vorschlagsliste wird bei jedem Anschlag neu
   gefuellt, immer nur mit den besten Treffern. Bei 25.894 Orten waere eine
   vollstaendig gefuellte Liste sonst nicht zu bedienen. */
var ortFeld = $('ortSuche'), ortListe = $('orteListe'), ortMeldung = $('ortHinweis');
var gewaehlterOrt = Orte.finde('München');
var ortOffen = false;                       /* getippter Ort passt zu keinem Eintrag */

function ortVorschlaege() {
  var treffer = Orte.suche(ortFeld.value, 25);
  ortListe.innerHTML = treffer.map(function (o) {
    return '<option value="' + o.anzeige.replace(/"/g, '&quot;') + '"></option>';
  }).join('');
}
function ortMelden(t, warnung) {
  ortMeldung.textContent = t || '';
  ortMeldung.style.color = warnung ? 'var(--rubrik)' : '';
}
function ortGetippt() {
  ortVorschlaege();
  var eingabe = ortFeld.value.trim();
  if (!eingabe) { ortOffen = false; gewaehlterOrt = null; ortMelden(''); return; }
  var t = Orte.finde(eingabe);
  if (!t) {
    var passend = Orte.suche(eingabe, 6);
    /* Eine eindeutige Vervollstaendigung wird uebernommen, mehrere nicht */
    var genau = passend.filter(function (o) {
      return o.name.toLowerCase() === eingabe.toLowerCase(); });
    if (genau.length === 1) t = genau[0];
    else if (passend.length === 1) t = passend[0];
    else if (passend.length > 1) {
      ortOffen = true; gewaehlterOrt = null;
      ortMelden(passend.length + '+ Orte passen — weiter tippen oder aus der Liste wählen.');
      return;
    }
  }
  if (!t) {
    ortOffen = true; gewaehlterOrt = null;
    ortMelden('Ort nicht gefunden — setze das Häkchen und trage die Koordinaten ein.', true);
    return;
  }
  ortOffen = false; gewaehlterOrt = t;
  $('breite').value = t.lat; $('laenge').value = t.lon;
  ortMelden('');
  zonenHinweis();
}
ortFeld.addEventListener('input', ortGetippt);
ortFeld.addEventListener('change', ortGetippt);
ortVorschlaege();

var zonenWahl = $('zone');
for (var z = -12; z <= 14; z += 0.5) {
  var o = document.createElement('option');
  o.value = z;
  o.textContent = 'UTC' + (z >= 0 ? '+' : '−') + Math.floor(Math.abs(z)) +
                  (Math.abs(z) % 1 ? ':30' : ':00');
  if (z === 1) o.selected = true;
  zonenWahl.appendChild(o);
}

/* Zeitfenster, wenn die Uhrzeit nicht bekannt ist: von, bis, Vertreterzeit */
var BAENDER = {
  morgen:      { von: 6,  bis: 12, vertreter: 9,    text: 'morgens (6 bis 12 Uhr)' },
  nachmittag:  { von: 12, bis: 18, vertreter: 15,   text: 'nachmittags (12 bis 18 Uhr)' },
  abend:       { von: 18, bis: 24, vertreter: 21,   text: 'abends (18 bis 24 Uhr)' },
  nacht:       { von: 0,  bis: 6,  vertreter: 3,    text: 'nachts (0 bis 6 Uhr)' },
  garnicht:    { von: 0,  bis: 24, vertreter: 12,   text: 'zu unbekannter Stunde' }
};
function zeitUnbekannt() { return $('zeitUnbekannt').checked; }
function band() { return BAENDER[$('tageszeit').value]; }

function eigenModus() { return $('eigeneKoord').checked; }
function ortWechsel() {
  var e = eigenModus();
  ['feldBreite','feldLaenge','feldZone'].forEach(function (id) { $(id).hidden = !e; });
  ortFeld.disabled = e;
  ortFeld.style.opacity = e ? .45 : 1;
  if (e) ortMelden('');
  zonenHinweis();
}
$('eigeneKoord').addEventListener('change', ortWechsel);

function zeitWechsel() {
  var u = zeitUnbekannt();
  $('zeit').disabled = u;
  $('zeit').style.opacity = u ? .45 : 1;
  $('feldTageszeit').hidden = !u;
  $('unbekanntHinweis').hidden = !u;
  if (u) {
    $('unbekanntHinweis').innerHTML =
      '<p><strong>Ohne Uhrzeit entfallen Aszendent und Häuser.</strong> Der Aszendent ' +
      'durchläuft im Tagesverlauf alle zwölf Zeichen — er lässt sich nicht raten. Die ' +
      'Würden werden darum ohne die Hauswertung gerechnet.</p>' +
      '<p>Was bleibt, ist belastbar: Die Punktzahl von Saturn, Mars, Sonne, Venus und ' +
      'Jupiter schwankt dann über den ganzen Tag nur noch um 0,4 bis 2,2 Punkte statt ' +
      'um 10 bis 12. Eine grobe Tageszeit hebt die Verlässlichkeit von 89 auf rund ' +
      '96 Prozent. <a href="methode.html#ohnezeit">Näheres zur Rechnung.</a></p>';
  }
  zonenHinweis();
}
$('zeitUnbekannt').addEventListener('change', zeitWechsel);
$('tageszeit').addEventListener('change', zonenHinweis);
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
  if (!dv) return null;
  var dp = dv.split('-').map(Number);
  var b = { year: dp[0], month: dp[1], day: dp[2] };
  if (zeitUnbekannt()) {
    b.unbekannt = true; b.band = band();
    b.hour = Math.floor(b.band.vertreter); b.minute = (b.band.vertreter % 1) * 60;
  } else {
    if (!tv) return null;
    var tp = tv.split(':').map(Number);
    b.hour = tp[0]; b.minute = tp[1];
  }
  if (eigenModus()) {
    b.lat = parseFloat($('breite').value);
    b.lon = parseFloat($('laenge').value);
    b.versatz = parseFloat($('zone').value);
    b.ortName = 'eigene Koordinaten';
  } else {
    if (!gewaehlterOrt) return null;
    b.lat = gewaehlterOrt.lat; b.lon = gewaehlterOrt.lon;
    b.tz = gewaehlterOrt.tz; b.ortName = gewaehlterOrt.anzeige;
  }
  return b;
}

/* ============================================================
   Rundes Radix
   ============================================================ */
function zeichneRund(ch, urteil, ohneHaeuser) {
  /* Ohne Aszendent gibt es keinen Anfangspunkt — dann liegt 0 Grad Widder links. */
  var svg = $('radix'), c = 500, basis = ohneHaeuser ? 0 : ch.ascSign * 30;
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
  if (!ohneHaeuser) {
    kreis(R.haus_a, 'rgba(43,33,23,.35)', 1);
    kreis(R.haus_i, 'rgba(43,33,23,.2)', 1);
  }
  kreis(R.marke, 'rgba(43,33,23,.12)', 1);

  /* Gradteilung */
  for (var d = 0; d < 360; d++) {
    var lang = d % 10 === 0, mittel = d % 5 === 0;
    if (!mittel && !lang) continue;
    line(basis + d, R.tk_a, lang ? R.tk_i - 8 : R.tk_i, 'rgba(43,33,23,.4)', lang ? 1.4 : .8);
  }

  /* Zeichen und Haeuser — bei Ganzzeichenhaeusern faellt beides zusammen */
  for (var i = 0; i < 12; i++) {
    var sign = ohneHaeuser ? i : (ch.ascSign + i) % 12, start = sign * 30;
    var betont = !ohneHaeuser && i % 3 === 0;
    line(start, ohneHaeuser ? R.marke : R.haus_i, R.aussen,
         betont ? '#8f2c21' : 'rgba(43,33,23,.45)', betont ? 2.2 : 1.1);
    text(start + 15, 424, GLYPH[sign], { size: 34, fill: '#8f2c21', font: SYMBOL });
    if (!ohneHaeuser) text(start + 15, 221, String(i + 1), { size: 22, fill: 'rgba(43,33,23,.55)' });
  }

  /* Aszendent und Medium Coeli — nur bei bekannter Geburtszeit */
  (ohneHaeuser ? [] : [[ch.asc, 'ASC', '#8f2c21'], [ch.mc, 'MC', '#a8801f']]).forEach(function (m) {
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
  var mitte = ohneHaeuser
    ? [nm || '', ch.isDay ? 'Tagesgeburt' : 'Nachtgeburt', 'ohne Aszendent'].filter(Boolean)
    : [nm || '', ch.isDay ? 'Tagesgeburt' : 'Nachtgeburt', 'ASC ' + stand(ch.asc)].filter(Boolean);
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
/* Die Skala liegt symmetrisch um die Null: Minuspunkte gehen nach links,
   Pluspunkte nach rechts, die Nulllinie steht fest in der Mitte. Sonst laesst
   sich am Balken nicht ablesen, ob ein Wert positiv oder negativ ist. */
function rangliste(urteil) {
  var werte = urteil.ranked.map(function (n) { return Math.abs(urteil.planets[n].total); });
  var reich = Math.max(Math.max.apply(null, werte.concat([0])), 5);
  var stufe = reich <= 10 ? 5 : 10;
  var marken = [];
  for (var m = -Math.floor(reich / stufe) * stufe; m <= reich; m += stufe) {
    if (m === 0) continue;
    marken.push('<i class="teil" style="left:' + (50 + m / reich * 50) + '%"></i>');
  }
  var achse = marken.join('') + '<i class="null"></i>';

  $('rangliste').innerHTML =
    '<div class="rang-skala"><span>−' + reich + '</span><span>0</span><span>+' + reich + '</span></div>' +
    urteil.ranked.map(function (n) {
      var u = urteil.planets[n], farbe = farbeVon(n);
      var breite = Math.abs(u.total) / reich * 50;
      var start = u.total >= 0 ? 50 : 50 - breite;
      var balken = u.total === 0
        ? '<i class="punkt" style="left:50%;background:' + farbe + '"></i>'
        : '<i style="left:' + start + '%;width:' + breite + '%;background:' + farbe +
          ';border-radius:' + (u.total < 0 ? '5px 0 0 5px' : '0 5px 5px 0') + '"></i>';
      return '<div class="rang">' +
        '<span class="rang-glyph" style="color:' + farbe + '">' + PL[n].g + '</span>' +
        '<span class="rang-name">' + n + '</span>' +
        '<span class="rang-balken">' + achse + balken + '</span>' +
        '<span class="rang-wert ' + klasse(u.total) + '">' + vz(u.total) + '</span></div>';
    }).join('');
}

function standTabelle(ch, urteil, ohneHaeuser) {
  var kopf = '<thead><tr><th>Planet</th><th>Stand</th>' +
    (ohneHaeuser ? '' : '<th>Haus</th>') + '<th class="zahl">Würden</th></tr></thead>';
  var leib = ch.order.map(function (n) {
    var u = urteil.planets[n];
    return '<tr><td><span style="color:' + farbeVon(n) + '">' + PL[n].g + '</span> ' + n + '</td>' +
      '<td>' + grad(u.degInSign) + ' ' + u.glyph + ' ' + u.signName +
      (u.retrograde ? ' <span title="rückläufig">℞</span>' : '') + '</td>' +
      (ohneHaeuser ? '' : '<td>' + u.house + '</td>') +
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

function empfehlungen(urteil, ohneHaeuser) {
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
      e.urteil.signName + (ohneHaeuser ? '' : ' · Haus ' + e.urteil.house) + '</span>' +
      '<span class="urteil" style="color:' + farbe + '">' + e.urteil.verdict.label +
      ' · ' + vz(e.urteil.total) + '</span></div>' +
      '<p style="max-width:44rem">' + l.mangel + '</p>' +
      '<p class="hinweis" style="max-width:44rem">' + l.quelle + '</p>' +
      '<div class="stein-gitter">' + l.steine.map(steinKarte).join('') + '</div></div>';
  }).join('');
}

function einzelheiten(ch, urteil, ohneHaeuser) {
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
      (ohneHaeuser ? '' : ' · Haus ' + u.house) + (u.retrograde ? ' · rückläufig' : '') + '</span>' +
      '<span class="urteil" style="color:' + farbe + '">' + u.verdict.label + ' · ' + vz(u.total) + '</span>' +
      '</div><div class="wuerdenpaar">' +
      '<div><p class="klein-kapital">Wesentliche Würden — ' + vz(u.essential.score) + '</p>' +
      '<ul class="wuerdenliste">' + liste(u.essential.rows) + '</ul></div>' +
      '<div><p class="klein-kapital">Zufällige Würden — ' + vz(u.accidental.score) + '</p>' +
      '<ul class="wuerdenliste">' + liste(u.accidental.rows) + '</ul></div></div></div>';
  }).join('');
}

/* ------------------------------------------------------------
   Was aendert sich innerhalb des angegebenen Zeitfensters?
   Geprueft werden die beiden Dinge, die ohne Uhrzeit noch
   wandern koennen: das Mondzeichen und die Tag-Nacht-Frage.
   ------------------------------------------------------------ */
function fensterPruefen(b, versatz) {
  function stelle(stunde) {
    return Astro.chart({ year: b.year, month: b.month, day: b.day,
                         hour: Math.floor(stunde), minute: Math.round((stunde % 1) * 60),
                         tz: versatz, lat: b.lat, lon: b.lon });
  }
  var a = stelle(b.band.von), z = stelle(Math.min(b.band.bis, 23.983));
  return {
    mondWechsel: a.planets['Mond'].sign !== z.planets['Mond'].sign,
    mondZeichen: [SIGNS[a.planets['Mond'].sign], SIGNS[z.planets['Mond'].sign]],
    tagNachtUnsicher: a.isDay !== z.isDay
  };
}

function vorbehalteZeigen(b, pruef, urteil) {
  var kasten = $('vorbehalt');
  if (!b.unbekannt) { kasten.hidden = true; return; }
  var t = ['<p><strong>Ohne Uhrzeit gerechnet</strong> — ' + b.band.text +
           '. Aszendent und Häuser bleiben außen vor, die Würden stützen sich auf ' +
           'Zeichenstand, Lauf und Stellung zur Sonne.</p>'];
  if (pruef.mondWechsel) {
    t.push('<p>Der Mond wechselt in diesem Zeitfenster das Zeichen — von ' +
      pruef.mondZeichen[0] + ' nach ' + pruef.mondZeichen[1] +
      '. <strong>Was zum Mond gesagt wird, steht damit unter Vorbehalt.</strong> ' +
      'Die übrigen Planeten sind davon nicht berührt.</p>');
  } else {
    t.push('<p>Der Mond bleibt im ganzen Zeitfenster in ' + pruef.mondZeichen[0] +
      ' — hier gibt es keine Unsicherheit.</p>');
  }
  if (pruef.tagNachtUnsicher) {
    t.push('<p>Im gewählten Fenster geht die Sonne auf oder unter — ob es eine Tag- oder ' +
      'eine Nachtgeburt war, steht also nicht fest. Davon hängen die ' +
      'Triplizitätsherrscher ab. <strong>Eine genauere Angabe würde das Ergebnis hier ' +
      'merklich sicherer machen.</strong></p>');
  }
  if (urteil.planets['Merkur'].total <= urteil.planets[urteil.ranked[2]].total) {
    t.push('<p>Merkur gehört zu den schwächsten Planeten. Er ist neben dem Mond der ' +
      'beweglichste — ein Vorbehalt ist auch hier angebracht.</p>');
  }
  kasten.innerHTML = t.join('');
  kasten.hidden = false;
}

/* Stilblatt der Druckansicht — bewusst hell, das spart Farbe */
var DRUCK_STIL = [
'@page { size:A4 portrait; margin:14mm; }',
'* { box-sizing:border-box; }',
'body { margin:0; font-family:"Cormorant Garamond",Georgia,serif; font-size:10.5pt;',
'  line-height:1.5; color:#2b2117; background:#fff; }',
'h1 { font-family:"Cinzel",serif; font-size:20pt; font-weight:600; margin:.1em 0 .15em;',
'  letter-spacing:.03em; }',
'h2 { font-family:"Cinzel",serif; font-size:11pt; font-weight:600; letter-spacing:.1em;',
'  text-transform:uppercase; color:#8f2c21; margin:0 0 .6em; }',
'header { border-bottom:1.5px solid #a8801f; padding-bottom:.5em; margin-bottom:1em; }',
'.marke { font-family:"Cinzel",serif; font-size:7pt; letter-spacing:.22em;',
'  text-transform:uppercase; color:#6d5e47; margin:0; }',
'.daten { font-family:"Cinzel",serif; font-size:7.5pt; letter-spacing:.14em;',
'  text-transform:uppercase; color:#6d5e47; margin:0; }',
'section { margin-bottom:1.1em; }',
'.oben { display:flex; gap:6mm; align-items:flex-start; }',
'.radix { flex:0 0 52%; }',
'.staerke { flex:1; padding-top:.2em; }',
'.skala { display:flex; justify-content:space-between; font-family:"Cinzel",serif;',
'  font-size:6pt; letter-spacing:.1em; color:#6d5e47; margin:0 0 .3em 7.2em; padding-right:3.4em; }',
'.dz { display:flex; align-items:center; gap:.4em; padding:.2em 0;',
'  border-bottom:.5px solid rgba(43,33,23,.14); }',
'.dg { width:1.4em; text-align:center; font-size:12pt;',
'  font-family:"Apple Symbols","Segoe UI Symbol",serif; }',
'.dn { width:5.4em; font-family:"Cinzel",serif; font-size:6.8pt; letter-spacing:.1em;',
'  text-transform:uppercase; }',
'.db { flex:1; position:relative; height:10px; border-radius:2px;',
'  background:linear-gradient(90deg,rgba(143,44,33,.12) 0 50%,rgba(63,107,69,.12) 50% 100%); }',
'.db i { position:absolute; top:0; bottom:0; }',
'.dnull { left:50%; width:1px; margin-left:-.5px; background:rgba(43,33,23,.6); }',
'.dpunkt { left:50%; width:4px; height:4px; top:3px; margin-left:-2px; border-radius:50%; }',
'.dw { width:3em; text-align:right; font-weight:600; font-size:9.5pt;',
'  font-variant-numeric:tabular-nums; }',
'.dpl { border-left:2px solid; padding:.15em 0 .5em .7em; margin-bottom:.8em;',
'  break-inside:avoid; page-break-inside:avoid; }',
'.dplk { display:flex; align-items:baseline; gap:.5em; flex-wrap:wrap; margin-bottom:.2em; }',
'.dplk b { font-family:"Cinzel",serif; font-size:11pt; letter-spacing:.08em; }',
'.dstand { font-size:9pt; color:#6d5e47; }',
'.durteil { font-family:"Cinzel",serif; font-size:6.5pt; letter-spacing:.14em;',
'  text-transform:uppercase; color:#8f2c21; border:.5px solid #8f2c21;',
'  border-radius:2px; padding:.1em .5em; }',
'.dmangel { margin:.1em 0 .5em; font-size:9.5pt; max-width:48em; }',
'.dstg { display:grid; grid-template-columns:repeat(3,1fr); gap:.4em .7em; }',
'.dst { border:.5px solid #d9c8a4; border-radius:2px; padding:.35em .5em;',
'  display:flex; flex-direction:column; gap:.05em; }',
'.dst b { font-family:"Cinzel",serif; font-size:8pt; letter-spacing:.05em; }',
'.dst span { font-size:8pt; color:#6d5e47; }',
'footer { border-top:.5px solid #d9c8a4; padding-top:.5em; margin-top:1em;',
'  font-size:7.5pt; color:#6d5e47; }',
'.drucken { text-align:right; margin-bottom:.8em; }',
'.drucken button { font-family:"Cinzel",serif; font-size:8pt; letter-spacing:.16em;',
'  text-transform:uppercase; background:#8f2c21; color:#f3ead6; border:none;',
'  border-radius:2px; padding:.6em 1.4em; cursor:pointer; }',
'@media print { .drucken { display:none; } }'
].join('\n');

/* ============================================================
   Klappknoepfe
   ============================================================ */
function klappen(knopf, inhalt) {
  $(knopf).addEventListener('click', function () {
    var offen = $(inhalt).hidden;
    $(inhalt).hidden = !offen;
    this.setAttribute('aria-expanded', String(offen));
  });
}
klappen('btnStaende', 'staendeInhalt');
klappen('btnDetails', 'details');

/* ============================================================
   Druckansicht — Radix, Stärke der Planeten, empfohlene Steine
   ============================================================ */
function druckansicht() {
  if (!letztes) return;
  var ch = letztes.ch, urteil = letztes.urteil, b = letztes.b, ohneH = letztes.ohneHaeuser;
  var nm = $('name').value.trim();

  /* Das Radix wird so uebernommen, wie es auf der Seite steht */
  var svg = $('radix').cloneNode(true);
  svg.removeAttribute('id');
  svg.setAttribute('style', 'width:100%;height:auto');

  var kopfzeile = String(b.day).padStart(2, '0') + '.' + String(b.month).padStart(2, '0') +
    '.' + b.year + (ohneH ? ' · ' + b.band.text
      : ' um ' + String(b.hour).padStart(2, '0') + ':' + String(b.minute).padStart(2, '0')) +
    ' · ' + b.ortName + ' · ' + (ch.isDay ? 'Tagesgeburt' : 'Nachtgeburt');

  /* Staerkeleiste, mit denselben Verhaeltnissen wie auf der Seite */
  var werte = urteil.ranked.map(function (n) { return Math.abs(urteil.planets[n].total); });
  var reich = Math.max(Math.max.apply(null, werte.concat([0])), 5);
  var leiste = urteil.ranked.map(function (n) {
    var u = urteil.planets[n], f = farbeVon(n);
    var breite = Math.abs(u.total) / reich * 50, start = u.total >= 0 ? 50 : 50 - breite;
    return '<div class="dz"><span class="dg" style="color:' + f + '">' + PL[n].g + '</span>' +
      '<span class="dn">' + n + '</span><span class="db">' +
      '<i class="dnull"></i>' +
      (u.total === 0 ? '<i class="dpunkt" style="background:' + f + '"></i>'
        : '<i style="left:' + start + '%;width:' + breite + '%;background:' + f + '"></i>') +
      '</span><span class="dw" style="color:' + (u.total < 0 ? '#8f2c21' : '#3f6b45') + '">' +
      vz(u.total) + '</span></div>';
  }).join('');

  /* Empfohlene Steine der schwaechsten Planeten */
  var drei = Steine.empfehlung(urteil, 3);
  var schwach = drei.filter(function (e) { return e.urteil.total < 5; });
  var ziel = schwach.length ? schwach : drei.slice(0, 1);
  var steine = ziel.map(function (e) {
    var f = farbeVon(e.planet), l = e.lapidarium;
    var karten = l.steine.filter(function (st) { return st.bezug !== 'nicht erhältlich'; })
      .map(function (st) {
        return '<div class="dst"><b>' + (st.haupt ? '✦ ' : '') + st.name + '</b>' +
          '<span>' + st.modern + '</span>' +
          '<span>' + st.bezug + ' · ' + st.preis + '</span></div>';
      }).join('');
    return '<div class="dpl" style="border-color:' + f + '">' +
      '<div class="dplk"><span style="color:' + f + ';font-size:20pt">' + l.glyph + '</span>' +
      '<b style="color:' + f + '">' + e.planet + '</b>' +
      '<span class="dstand">' + grad(e.urteil.degInSign) + ' ' + e.urteil.glyph + ' ' +
      e.urteil.signName + (ohneH ? '' : ' · Haus ' + e.urteil.house) + '</span>' +
      '<span class="durteil">' + e.urteil.verdict.label + ' · ' + vz(e.urteil.total) + '</span></div>' +
      '<p class="dmangel">' + l.mangel + '</p>' +
      '<div class="dstg">' + karten + '</div></div>';
  }).join('');

  var heute = new Date();
  var html = '<!DOCTYPE html><html lang="de"><head><meta charset="utf-8">' +
    '<title>Venusstein — ' + (nm || 'Nativität') + '</title>' +
    '<link rel="preconnect" href="https://fonts.googleapis.com">' +
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
    '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&' +
    'family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">' +
    '<style>' + DRUCK_STIL + '</style></head><body>' +
    '<div class="drucken"><button onclick="window.print()">Drucken oder als PDF sichern</button></div>' +
    '<header><p class="marke">Venusstein — ein astrologisches Lapidarium</p>' +
    '<h1>' + (nm || 'Nativität') + '</h1><p class="daten">' + kopfzeile + '</p></header>' +
    '<section class="oben"><div class="radix">' + svg.outerHTML + '</div>' +
    '<div class="staerke"><h2>Stärke der Planeten</h2>' +
    '<p class="skala"><span>−' + reich + '</span><span>0</span><span>+' + reich + '</span></p>' +
    leiste + '</div></section>' +
    '<section><h2>Die Steine, die fehlen</h2>' + steine + '</section>' +
    '<footer>Gerechnet nach William Lilly, <i>Christian Astrology</i> (1647), mit ' +
    'ägyptischen Termini und Ganzzeichenhäusern. Steine nach Agrippa von Nettesheim, ' +
    '<i>De occulta philosophia</i> (1533). · Erstellt am ' +
    String(heute.getDate()).padStart(2, '0') + '.' +
    String(heute.getMonth() + 1).padStart(2, '0') + '.' + heute.getFullYear() +
    ' · abuelia81.github.io/venusstein</footer></body></html>';

  var w = window.open('', '_blank');
  if (!w) { alert('Der Browser hat das Fenster blockiert. Bitte Pop-ups für diese Seite erlauben.'); return; }
  w.document.open(); w.document.write(html); w.document.close();
}
$('btnDruck').addEventListener('click', druckansicht);

/* ============================================================
   Ablauf
   ============================================================ */
var letztes = null, form = 'rund';

function zeichne() {
  if (!letztes) return;
  var ohneH = letztes.ohneHaeuser;
  /* Die quadratische Figur ist eine Haeuserfigur — ohne Haeuser hat sie keinen Sinn. */
  $('btnEckig').hidden = ohneH;
  if (ohneH) form = 'rund';
  (form === 'rund' ? zeichneRund : zeichneEckig)(letztes.ch, letztes.urteil, ohneH);
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
  var ohneH = !!b.unbekannt;
  var urteil = Wuerden.judge(ch, { ohneHaeuser: ohneH });
  letztes = { ch: ch, urteil: urteil, b: b, ohneHaeuser: ohneH };

  var nm = $('name').value.trim();
  $('ergebnisKopf').textContent = nm ? 'Das Radix für ' + nm : 'Das Radix';
  $('ergebnisUnter').textContent =
    String(b.day).padStart(2, '0') + '.' + String(b.month).padStart(2, '0') + '.' + b.year +
    (ohneH ? ' · ' + b.band.text
           : ' um ' + String(b.hour).padStart(2, '0') + ':' + String(b.minute).padStart(2, '0')) +
    ' · ' + b.ortName + ' · UTC' + (versatz >= 0 ? '+' : '−') + Math.abs(versatz) +
    ' · ' + (ch.isDay ? 'Tagesgeburt' : 'Nachtgeburt');

  $('ergebnis').hidden = false;
  zeichne();
  rangliste(urteil);
  standTabelle(ch, urteil, ohneH);
  empfehlungen(urteil, ohneH);
  einzelheiten(ch, urteil, ohneH);
  vorbehalteZeigen(b, ohneH ? fensterPruefen(b, versatz) : null, urteil);
  $('ergebnis').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

ortWechsel();
zeitWechsel();
})();
