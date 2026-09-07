/* ============================================================
   VENUSSTEIN — Ephemeride der sieben sichtbaren Planeten
   ------------------------------------------------------------
   Keine Abhaengigkeiten, laeuft im Browser wie in Node.
   Planeten: Kepler-Elemente der JPL-Naeherung (1800-2050),
   heliozentrisch gerechnet, dann geozentrisch umgesetzt und
   auf das Aequinoktium des Datums praezediert.
   Mond: gekuerzte ELP-Reihe nach Meeus, Kap. 47.
   ============================================================ */
(function (root) {
'use strict';

var rad = function (x) { return x * Math.PI / 180; };
var deg = function (x) { return x * 180 / Math.PI; };
var norm = function (x) { return ((x % 360) + 360) % 360; };
/* Differenz zweier Laengen als kuerzester Bogen, -180..+180 */
var arc = function (x) { var a = norm(x); return a > 180 ? a - 360 : a; };

/* ---------- Julianisches Datum aus UT ---------- */
function julianDay(y, m, d, hoursUT) {
  var A = Math.floor((14 - m) / 12), Y = y + 4800 - A, M = m + 12 * A - 3;
  return d + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4)
       - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045 + (hoursUT - 12) / 24;
}

/* ---------- Kepler-Elemente, Epoche J2000, Raten pro Jahrhundert ----------
   a AE | e | I Grad | L mittlere Laenge | peri Laenge des Perihels | node */
var ELEM = {
  Merkur:  [0.38709927, 0.20563593, 7.00497902, 252.25032350,  77.45779628,  48.33076593,
            0.00000037, 0.00001906,-0.00594749, 149472.67411175, 0.16047689,  -0.12534081],
  Venus:   [0.72333566, 0.00677672, 3.39467605, 181.97909950, 131.60246718,  76.67984255,
            0.00000390,-0.00004107,-0.00078890,  58517.81538729, 0.00268329,  -0.27769418],
  Erde:    [1.00000261, 0.01671123,-0.00001531, 100.46457166, 102.93768193,   0.0,
            0.00000562,-0.00004392,-0.01294668,  35999.37244981, 0.32327364,   0.0],
  Mars:    [1.52371034, 0.09339410, 1.84969142,  -4.55343205, -23.94362959,  49.55953891,
            0.00001847, 0.00007882,-0.00813131,  19140.30268499, 0.44441088,  -0.29257343],
  Jupiter: [5.20288700, 0.04838624, 1.30439695,  34.39644051,  14.72847983, 100.47390909,
           -0.00011607,-0.00013253,-0.00183714,   3034.74612775, 0.21252668,   0.20469106],
  Saturn:  [9.53667594, 0.05386179, 2.48599187,  49.95424423,  92.59887831, 113.66242448,
           -0.00125060,-0.00050991, 0.00193609,   1222.49362201,-0.41897216,  -0.28867794]
};

/* Heliozentrischer Ortsvektor im Ekliptiksystem J2000 */
function helio(name, T) {
  var E = ELEM[name];
  var a = E[0] + E[6] * T, e = E[1] + E[7] * T, I = E[2] + E[8] * T,
      L = E[3] + E[9] * T, peri = E[4] + E[10] * T, node = E[5] + E[11] * T;
  var M = norm(L - peri); if (M > 180) M -= 360;
  /* Keplergleichung, Newton-Iteration; e ist klein, sechs Schritte genuegen */
  var Ea = M + e * (180 / Math.PI) * Math.sin(rad(M));
  for (var i = 0; i < 8; i++) {
    var dM = M - (Ea - e * (180 / Math.PI) * Math.sin(rad(Ea)));
    Ea += dM / (1 - e * Math.cos(rad(Ea)));
  }
  var xv = a * (Math.cos(rad(Ea)) - e),
      yv = a * Math.sqrt(1 - e * e) * Math.sin(rad(Ea));
  var w = rad(peri - node), o = rad(node), inc = rad(I);
  return {
    x: (Math.cos(w) * Math.cos(o) - Math.sin(w) * Math.sin(o) * Math.cos(inc)) * xv
     + (-Math.sin(w) * Math.cos(o) - Math.cos(w) * Math.sin(o) * Math.cos(inc)) * yv,
    y: (Math.cos(w) * Math.sin(o) + Math.sin(w) * Math.cos(o) * Math.cos(inc)) * xv
     + (-Math.sin(w) * Math.sin(o) + Math.cos(w) * Math.cos(o) * Math.cos(inc)) * yv,
    z: (Math.sin(w) * Math.sin(inc)) * xv + (Math.cos(w) * Math.sin(inc)) * yv
  };
}

/* Allgemeine Praezession in Laenge, J2000 -> Datum */
function precession(T) { return 1.396971 * T + 0.0003086 * T * T; }

/* Geozentrische ekliptikale Laenge eines Planeten, Aequinoktium des Datums */
function planetLon(name, T) {
  var p = helio(name, T), e = helio('Erde', T);
  return norm(deg(Math.atan2(p.y - e.y, p.x - e.x)) + precession(T));
}

/* Sonne: Erde plus 180 Grad */
function sunLon(T) {
  var e = helio('Erde', T);
  return norm(deg(Math.atan2(-e.y, -e.x)) + precession(T));
}

/* ---------- Mond, gekuerzte ELP-Reihe (Meeus 47) ---------- */
var MOON_T = [
 [0,0,1,0,6288774],[2,0,-1,0,1274027],[2,0,0,0,658314],[0,0,2,0,213618],
 [0,1,0,0,-185116],[0,0,0,2,-114332],[2,0,-2,0,58793],[2,-1,-1,0,57066],
 [2,0,1,0,53322],[2,-1,0,0,45758],[0,1,-1,0,-40923],[1,0,0,0,-34720],
 [0,1,1,0,-30383],[2,0,0,-2,15327],[0,0,1,2,-12528],[0,0,1,-2,10980],
 [4,0,-1,0,10675],[0,0,3,0,10034],[4,0,-2,0,8548],[2,1,-1,0,-7888],
 [2,1,0,0,-6766],[1,0,-1,0,-5163],[1,1,0,0,4987],[2,-1,1,0,4036],
 [2,0,2,0,3994],[4,0,0,0,3861],[2,0,-3,0,3665],[0,1,-2,0,-2689],
 [2,0,-1,2,-2602],[2,-1,-2,0,2390],[1,0,1,0,-2348],[2,-2,0,0,2236],
 [0,1,2,0,-2120],[0,2,0,0,-2069],[2,-2,-1,0,2048],[2,0,1,-2,-1773],
 [2,0,0,2,-1595],[4,-1,-1,0,1215],[0,0,2,2,-1110],[3,0,-1,0,-892],
 [2,1,1,0,-810],[4,-1,-2,0,759],[0,2,-1,0,-713],[2,2,-1,0,-700],
 [2,1,-2,0,691],[2,-1,0,-2,596],[4,0,1,0,549],[0,0,4,0,537],
 [4,-1,0,0,520],[1,0,-2,0,-487],[2,1,0,-2,-399],[0,0,2,-2,-381],
 [1,1,1,0,351],[3,0,-2,0,-340],[4,0,-3,0,330],[2,-1,2,0,327],
 [0,2,1,0,-323],[1,1,-1,0,299],[2,0,3,0,294]
];
function moonLon(T) {
  var Ls = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T
         + T * T * T / 538841 - T * T * T * T / 65194000;
  var D  = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T
         + T * T * T / 545868 - T * T * T * T / 113065000;
  var M  = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + T * T * T / 24490000;
  var Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T
         + T * T * T / 69699 - T * T * T * T / 14712000;
  var F  = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T
         - T * T * T / 3526000 + T * T * T * T / 863310000;
  var Ecc = 1 - 0.002516 * T - 0.0000074 * T * T, sum = 0;
  for (var i = 0; i < MOON_T.length; i++) {
    var t = MOON_T[i], f = 1;
    if (t[1] === 1 || t[1] === -1) f = Ecc;
    else if (t[1] === 2 || t[1] === -2) f = Ecc * Ecc;
    sum += t[4] * f * Math.sin(rad(t[0] * D + t[1] * M + t[2] * Mp + t[3] * F));
  }
  return norm(Ls + sum / 1000000);
}

/* ---------- Aszendent, Medium Coeli ---------- */
function siderealTime(jd, T, lonEast) {
  var hUT = ((jd + 0.5) % 1) * 24;
  var GMST = norm(100.4606184 + 36000.77004 * T + 0.000387933 * T * T
                + 360.98564724 * (hUT / 24));
  return norm(GMST + lonEast);
}
function ascMc(jd, T, lat, lonEast) {
  var eps = rad(23.439291 - 0.013004 * T);
  var LST = siderealTime(jd, T, lonEast), R = rad(LST), la = rad(lat);
  var asc = norm(deg(Math.atan2(Math.cos(R),
            -(Math.sin(R) * Math.cos(eps) + Math.tan(la) * Math.sin(eps)))));
  var mc = norm(deg(Math.atan2(Math.sin(R), Math.cos(R) * Math.cos(eps))));
  return { asc: asc, mc: mc, lst: LST };
}

/* ---------- Mittlere Tagesbewegung nach Lilly ---------- */
var MEAN_MOTION = {
  Saturn: 2 / 60, Jupiter: 5 / 60, Mars: 31 / 60, Sonne: 59.13 / 60,
  Venus: 59.13 / 60, Merkur: 59.13 / 60, Mond: 13 + 10.6 / 60
};

/* ---------- Fixsterne, Laenge zum Datum ---------- */
function fixedStars(year) {
  var p = 0.013971 * (year - 2000);
  return { regulus: norm(149.8333 + p), spica: norm(203.8333 + p), algol: norm(56.1667 + p) };
}

var ORDER = ['Saturn', 'Jupiter', 'Mars', 'Sonne', 'Venus', 'Merkur', 'Mond'];

function lonOf(name, T) {
  if (name === 'Sonne') return sunLon(T);
  if (name === 'Mond') return moonLon(T);
  return planetLon(name, T);
}

/* ============================================================
   Hauptfunktion: Geburtsdaten in Ortszeit, tz = Stunden oestlich
   ============================================================ */
function chart(o) {
  var hUT = o.hour + o.minute / 60 - o.tz;
  var jd = julianDay(o.year, o.month, o.day, hUT);
  var T = (jd - 2451545.0) / 36525.0;
  var Tm = (jd - 0.5 - 2451545.0) / 36525.0, Tp = (jd + 0.5 - 2451545.0) / 36525.0;

  var pl = {};
  ORDER.forEach(function (n) {
    var L = lonOf(n, T);
    var speed = arc(lonOf(n, Tp) - lonOf(n, Tm));
    pl[n] = {
      name: n, lon: L, speed: speed,
      retrograde: speed < 0,
      swift: Math.abs(speed) > MEAN_MOTION[n]
    };
  });

  var am = ascMc(jd, T, o.lat, o.lon);
  var ascSign = Math.floor(am.asc / 30);

  /* Ganzzeichenhaeuser: das Aszendentenzeichen ist Haus 1 */
  ORDER.forEach(function (n) {
    pl[n].house = ((Math.floor(pl[n].lon / 30) - ascSign) + 12) % 12 + 1;
    pl[n].sign = Math.floor(pl[n].lon / 30);
    pl[n].degInSign = pl[n].lon % 30;
  });

  /* Tag- oder Nachtgeburt: steht die Sonne ueber dem Horizont?
     Ueber die Haeuser gerechnet, weil das bei Ganzzeichen konsistent ist:
     Sonne in Haus 7-12 heisst ueber dem Horizont. */
  var sunAlt = solarAltitude(jd, T, o.lat, o.lon, pl['Sonne'].lon);
  var isDay = sunAlt > 0;

  /* Mittlerer aufsteigender Mondknoten */
  var node = norm(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T
                + T * T * T / 467441);

  return {
    jd: jd, T: T, asc: am.asc, mc: am.mc, lst: am.lst, node: node,
    ascSign: ascSign, planets: pl, order: ORDER,
    isDay: isDay, sunAltitude: sunAlt,
    stars: fixedStars(o.year + (o.month - 1) / 12)
  };
}

/* Hoehe der Sonne ueber dem Horizont, aus ekliptikaler Laenge */
function solarAltitude(jd, T, lat, lonEast, sl) {
  var eps = rad(23.439291 - 0.013004 * T), l = rad(sl);
  var ra = Math.atan2(Math.cos(eps) * Math.sin(l), Math.cos(l));
  var dec = Math.asin(Math.sin(eps) * Math.sin(l));
  var H = rad(siderealTime(jd, T, lonEast)) - ra;
  return deg(Math.asin(Math.sin(rad(lat)) * Math.sin(dec)
           + Math.cos(rad(lat)) * Math.cos(dec) * Math.cos(H)));
}

var api = { chart: chart, julianDay: julianDay, norm: norm, arc: arc,
            lonOf: lonOf, ORDER: ORDER, MEAN_MOTION: MEAN_MOTION,
            fixedStars: fixedStars, ascMc: ascMc };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
root.Astro = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
