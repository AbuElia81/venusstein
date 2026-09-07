/* ============================================================
   VENUSSTEIN — Geburtsorte und Zeitzonen
   ------------------------------------------------------------
   Zu jedem Ort gehoert eine IANA-Zeitzone. Der tatsaechliche
   Versatz zur Weltzeit wird nicht geraten, sondern fuer den
   Geburtstag aus der Zeitzonendatenbank des Browsers gelesen —
   damit stimmen auch alte Sommerzeitregelungen.
   ============================================================ */
(function (root) {
'use strict';

/* [Name, Breite, Laenge, Zeitzone] */
var ORTE = [
  ['Aachen',50.776,6.084,'Europe/Berlin'],['Augsburg',48.371,10.898,'Europe/Berlin'],
  ['Basel',47.560,7.588,'Europe/Zurich'],['Berlin',52.520,13.405,'Europe/Berlin'],
  ['Bern',46.948,7.447,'Europe/Zurich'],['Bielefeld',52.030,8.532,'Europe/Berlin'],
  ['Bochum',51.482,7.216,'Europe/Berlin'],['Bonn',50.735,7.100,'Europe/Berlin'],
  ['Braunschweig',52.269,10.521,'Europe/Berlin'],['Bregenz',47.503,9.747,'Europe/Vienna'],
  ['Bremen',53.079,8.802,'Europe/Berlin'],['Chemnitz',50.828,12.921,'Europe/Berlin'],
  ['Dortmund',51.514,7.466,'Europe/Berlin'],['Dresden',51.051,13.738,'Europe/Berlin'],
  ['Duisburg',51.435,6.763,'Europe/Berlin'],['Düsseldorf',51.228,6.773,'Europe/Berlin'],
  ['Erfurt',50.985,11.030,'Europe/Berlin'],['Essen',51.456,7.012,'Europe/Berlin'],
  ['Frankfurt am Main',50.110,8.682,'Europe/Berlin'],['Freiburg im Breisgau',47.999,7.842,'Europe/Berlin'],
  ['Genf',46.204,6.143,'Europe/Zurich'],['Graz',47.071,15.439,'Europe/Vienna'],
  ['Halle (Saale)',51.483,11.970,'Europe/Berlin'],['Hamburg',53.551,9.994,'Europe/Berlin'],
  ['Hannover',52.376,9.732,'Europe/Berlin'],['Heidelberg',49.399,8.672,'Europe/Berlin'],
  ['Innsbruck',47.269,11.404,'Europe/Vienna'],['Karlsruhe',49.007,8.404,'Europe/Berlin'],
  ['Kassel',51.312,9.480,'Europe/Berlin'],['Kiel',54.323,10.135,'Europe/Berlin'],
  ['Klagenfurt',46.624,14.308,'Europe/Vienna'],['Koblenz',50.356,7.594,'Europe/Berlin'],
  ['Köln',50.938,6.960,'Europe/Berlin'],['Krefeld',51.334,6.564,'Europe/Berlin'],
  ['Leipzig',51.340,12.375,'Europe/Berlin'],['Linz',48.306,14.286,'Europe/Vienna'],
  ['Lübeck',53.866,10.687,'Europe/Berlin'],['Luzern',47.051,8.310,'Europe/Zurich'],
  ['Magdeburg',52.121,11.627,'Europe/Berlin'],['Mainz',49.993,8.247,'Europe/Berlin'],
  ['Mannheim',49.488,8.469,'Europe/Berlin'],['München',48.137,11.575,'Europe/Berlin'],
  ['Münster',51.961,7.626,'Europe/Berlin'],['Nürnberg',49.452,11.077,'Europe/Berlin'],
  ['Oldenburg',53.144,8.214,'Europe/Berlin'],['Osnabrück',52.279,8.047,'Europe/Berlin'],
  ['Potsdam',52.391,13.064,'Europe/Berlin'],['Regensburg',49.013,12.102,'Europe/Berlin'],
  ['Rostock',54.093,12.141,'Europe/Berlin'],['Saarbrücken',49.240,6.997,'Europe/Berlin'],
  ['Salzburg',47.809,13.055,'Europe/Vienna'],['St. Gallen',47.424,9.377,'Europe/Zurich'],
  ['Stuttgart',48.776,9.183,'Europe/Berlin'],['Trier',49.750,6.638,'Europe/Berlin'],
  ['Ulm',48.401,9.987,'Europe/Berlin'],['Vaduz',47.141,9.521,'Europe/Vaduz'],
  ['Wien',48.208,16.373,'Europe/Vienna'],['Wiesbaden',50.083,8.240,'Europe/Berlin'],
  ['Winterthur',47.500,8.724,'Europe/Zurich'],['Wuppertal',51.256,7.150,'Europe/Berlin'],
  ['Würzburg',49.792,9.951,'Europe/Berlin'],['Zürich',47.377,8.542,'Europe/Zurich'],

  ['Amsterdam',52.370,4.895,'Europe/Amsterdam'],['Antwerpen',51.220,4.402,'Europe/Brussels'],
  ['Athen',37.984,23.728,'Europe/Athens'],['Barcelona',41.385,2.173,'Europe/Madrid'],
  ['Belgrad',44.787,20.449,'Europe/Belgrade'],['Bologna',44.494,11.343,'Europe/Rome'],
  ['Bratislava',48.146,17.107,'Europe/Bratislava'],['Brüssel',50.851,4.352,'Europe/Brussels'],
  ['Bukarest',44.427,26.103,'Europe/Bucharest'],['Budapest',47.498,19.040,'Europe/Budapest'],
  ['Danzig',54.352,18.646,'Europe/Warsaw'],['Dublin',53.350,-6.260,'Europe/Dublin'],
  ['Edinburgh',55.953,-3.188,'Europe/London'],['Florenz',43.770,11.256,'Europe/Rome'],
  ['Helsinki',60.170,24.938,'Europe/Helsinki'],['Istanbul',41.008,28.978,'Europe/Istanbul'],
  ['Kattowitz',50.264,19.024,'Europe/Warsaw'],['Kiew',50.450,30.523,'Europe/Kyiv'],
  ['Kopenhagen',55.676,12.568,'Europe/Copenhagen'],['Krakau',50.064,19.945,'Europe/Warsaw'],
  ['Lissabon',38.722,-9.139,'Europe/Lisbon'],['Ljubljana',46.056,14.505,'Europe/Ljubljana'],
  ['London',51.507,-0.128,'Europe/London'],['Luxemburg',49.612,6.130,'Europe/Luxembourg'],
  ['Madrid',40.417,-3.704,'Europe/Madrid'],['Mailand',45.464,9.190,'Europe/Rome'],
  ['Marseille',43.297,5.370,'Europe/Paris'],['Moskau',55.756,37.617,'Europe/Moscow'],
  ['Neapel',40.852,14.268,'Europe/Rome'],['Oslo',59.914,10.752,'Europe/Oslo'],
  ['Palermo',38.116,13.361,'Europe/Rome'],['Paris',48.857,2.352,'Europe/Paris'],
  ['Prag',50.076,14.438,'Europe/Prague'],['Riga',56.950,24.106,'Europe/Riga'],
  ['Rom',41.903,12.496,'Europe/Rome'],['Sarajevo',43.857,18.413,'Europe/Sarajevo'],
  ['Sofia',42.698,23.322,'Europe/Sofia'],['Stockholm',59.329,18.069,'Europe/Stockholm'],
  ['Straßburg',48.573,7.752,'Europe/Paris'],['Tallinn',59.437,24.754,'Europe/Tallinn'],
  ['Thessaloniki',40.640,22.944,'Europe/Athens'],['Turin',45.070,7.687,'Europe/Rome'],
  ['Valletta',35.899,14.514,'Europe/Malta'],['Venedig',45.441,12.316,'Europe/Rome'],
  ['Vilnius',54.687,25.280,'Europe/Vilnius'],['Warschau',52.230,21.012,'Europe/Warsaw'],
  ['Zagreb',45.815,15.982,'Europe/Zagreb'],

  ['Ankara',39.933,32.859,'Europe/Istanbul'],['Bagdad',33.315,44.366,'Asia/Baghdad'],
  ['Bangkok',13.756,100.502,'Asia/Bangkok'],['Beirut',33.889,35.495,'Asia/Beirut'],
  ['Damaskus',33.513,36.292,'Asia/Damascus'],['Delhi',28.614,77.209,'Asia/Kolkata'],
  ['Dubai',25.205,55.271,'Asia/Dubai'],['Hongkong',22.320,114.174,'Asia/Hong_Kong'],
  ['Jakarta',-6.208,106.846,'Asia/Jakarta'],['Jerusalem',31.769,35.214,'Asia/Jerusalem'],
  ['Kabul',34.556,69.208,'Asia/Kabul'],['Karatschi',24.861,67.010,'Asia/Karachi'],
  ['Manila',14.600,120.984,'Asia/Manila'],['Mumbai',19.076,72.878,'Asia/Kolkata'],
  ['Peking',39.904,116.407,'Asia/Shanghai'],['Schanghai',31.230,121.474,'Asia/Shanghai'],
  ['Seoul',37.567,126.978,'Asia/Seoul'],['Singapur',1.352,103.820,'Asia/Singapore'],
  ['Teheran',35.689,51.389,'Asia/Tehran'],['Tokio',35.690,139.692,'Asia/Tokyo'],

  ['Accra',5.604,-0.187,'Africa/Accra'],['Addis Abeba',9.005,38.764,'Africa/Addis_Ababa'],
  ['Algier',36.754,3.059,'Africa/Algiers'],['Kairo',30.044,31.236,'Africa/Cairo'],
  ['Kapstadt',-33.925,18.424,'Africa/Johannesburg'],['Casablanca',33.573,-7.590,'Africa/Casablanca'],
  ['Johannesburg',-26.204,28.047,'Africa/Johannesburg'],['Lagos',6.524,3.379,'Africa/Lagos'],
  ['Nairobi',-1.292,36.822,'Africa/Nairobi'],['Tunis',36.807,10.181,'Africa/Tunis'],

  ['Boston',42.360,-71.058,'America/New_York'],['Buenos Aires',-34.604,-58.382,'America/Argentina/Buenos_Aires'],
  ['Chicago',41.878,-87.630,'America/Chicago'],['Havanna',23.114,-82.366,'America/Havana'],
  ['Lima',-12.046,-77.043,'America/Lima'],['Los Angeles',34.052,-118.244,'America/Los_Angeles'],
  ['Mexiko-Stadt',19.433,-99.133,'America/Mexico_City'],['Montreal',45.502,-73.567,'America/Toronto'],
  ['New York',40.713,-74.006,'America/New_York'],['Rio de Janeiro',-22.907,-43.173,'America/Sao_Paulo'],
  ['San Francisco',37.775,-122.419,'America/Los_Angeles'],['Santiago de Chile',-33.449,-70.669,'America/Santiago'],
  ['São Paulo',-23.551,-46.633,'America/Sao_Paulo'],['Toronto',43.653,-79.383,'America/Toronto'],
  ['Vancouver',49.283,-123.121,'America/Vancouver'],

  ['Auckland',-36.849,174.763,'Pacific/Auckland'],['Melbourne',-37.814,144.963,'Australia/Melbourne'],
  ['Perth',-31.953,115.857,'Australia/Perth'],['Sydney',-33.869,151.209,'Australia/Sydney']
];

ORTE.sort(function (a, b) { return a[0].localeCompare(b[0], 'de'); });

/* ------------------------------------------------------------
   Versatz einer Zeitzone zur Weltzeit, in Stunden oestlich,
   fuer eine bestimmte Ortszeit. Zwei Durchgaenge, damit auch
   Zeitpunkte nahe einer Umstellung richtig aufgeloest werden.
   ------------------------------------------------------------ */
function zonenVersatz(tz, y, mo, d, h, mi) {
  function versatzBei(utcMs) {
    var f = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hour12: false, era: 'short',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    var p = {}, teile = f.formatToParts(new Date(utcMs));
    teile.forEach(function (t) { p[t.type] = t.value; });
    var jahr = parseInt(p.year, 10);
    if (p.era && /^B/.test(p.era)) jahr = 1 - jahr;      /* v. Chr. */
    var alsUtc = Date.UTC(jahr, p.month - 1, +p.day, p.hour % 24, +p.minute, +p.second);
    if (jahr >= 0 && jahr < 100) alsUtc = verschiebeJahr(alsUtc, jahr);
    return (alsUtc - utcMs) / 3600000;
  }
  function verschiebeJahr(ms, jahr) {           /* Date.UTC deutet 0-99 als 1900+ */
    var dt = new Date(ms); dt.setUTCFullYear(jahr); return dt.getTime();
  }
  var roh = Date.UTC(y, mo - 1, d, h, mi, 0);
  if (y >= 0 && y < 100) roh = verschiebeJahr(roh, y);
  var v = versatzBei(roh);
  v = versatzBei(roh - v * 3600000);            /* zweiter Durchgang */
  return v;
}

var api = { ORTE: ORTE, zonenVersatz: zonenVersatz };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
root.Orte = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
