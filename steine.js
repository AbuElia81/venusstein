/* ============================================================
   VENUSSTEIN — Lapidarium der sieben Planeten
   ------------------------------------------------------------
   Zuordnungen nach Heinrich Cornelius Agrippa von Nettesheim,
   De occulta philosophia libri tres (1533), Buch I, Kap. XXIII-XXIX,
   zitiert nach der englischen Uebersetzung von J. F. (London 1651).
   Ergaenzt um die mineralogische Bestimmung nach heutigem Stand
   und um Angaben zum Bezug. Preise sind Anhaltswerte fuer einen
   getrommelten Stein von zwei bis drei Zentimetern, Stand 2026.
   ============================================================ */
(function (root) {
'use strict';

var LAPIDARIUM = {
  Saturn: {
    glyph: '♄', metall: 'Blei', farbe: '#7a8a6a',
    wesen: 'Grenze, Dauer, Schwere, Zeit',
    mangel: 'Wenn Saturn schwach steht, fehlt es an Halt, an Geduld und an der '
          + 'Fähigkeit, etwas lange auszuhalten. Die Steine Saturns sind dunkel, '
          + 'schwer und erdig — sie sollen sammeln, was zerstreut ist.',
    quelle: 'Agrippa I, XXV: „Amongst stones, the Onix, the Ziazaa, the Camonius, '
          + 'the Saphir, the brown Jasper, the Chalcedon, the Loadstone, and all '
          + 'dark, weighty, earthy things."',
    steine: [
      { name:'Onyx', lat:'Onix', modern:'Chalcedon-Varietät, schwarz-weiß gebändert',
        bezug:'sehr leicht', preis:'3–8 €', form:'Trommelstein, Cabochon, Perlen',
        haupt:true, hinweis:'Der klassische Saturnstein. Achte auf ungefärbte Ware — '
          + 'viel Handelsonyx ist geschwärzter Achat.' },
      { name:'Schwarzer Chalcedon', lat:'Chalcedon', modern:'Chalcedon (SiO₂)',
        bezug:'leicht', preis:'4–10 €', form:'Trommelstein, Rohstück' },
      { name:'Magnetit', lat:'Loadstone', modern:'Magnetit (Fe₃O₄)',
        bezug:'leicht', preis:'3–12 €', form:'Rohstück, oft als Magnetstein verkauft',
        hinweis:'Agrippa führt ihn zugleich unter Mars — die Doppelzuordnung ist alt.' },
      { name:'Brauner Jaspis', lat:'brown Jasper', modern:'Jaspis, eisenhaltig',
        bezug:'sehr leicht', preis:'2–6 €', form:'Trommelstein' },
      { name:'Saphir', lat:'Saphir', modern:'Korund (Al₂O₃), blau',
        bezug:'Fachhandel', preis:'ab 40 € für geschliffene Kleinware',
        form:'Rohkristall, Cabochon',
        hinweis:'Agrippa nennt ihn auch unter Jupiter und Venus. Im Mittelalter '
          + 'meinte „saphirus" oft Lapislazuli.' },
      { name:'Ziazaa und Camonius', lat:'Ziazaa, Camonius', modern:'nicht bestimmbar',
        bezug:'nicht erhältlich', preis:'—', form:'—',
        hinweis:'Zwei Steinnamen aus der arabisch-lateinischen Überlieferung, die '
          + 'sich keinem heutigen Mineral sicher zuordnen lassen. Der Vollständigkeit '
          + 'halber genannt.' }
    ]
  },
  Jupiter: {
    glyph: '♃', metall: 'Zinn', farbe: '#6a7abf',
    wesen: 'Maß, Weite, Gunst, Wachstum',
    mangel: 'Ein schwacher Jupiter zeigt sich als Enge — im Urteil, im Vertrauen, '
          + 'im Spielraum. Seine Steine sind klar und licht und sollen den Blick weiten.',
    quelle: 'Agrippa I, XXVI: „Amongst stones, the Hyacinth, Beril, Saphir, the '
          + 'Emrald, green Jasper, and airy colours."',
    steine: [
      { name:'Saphir', lat:'Saphir', modern:'Korund (Al₂O₃), blau',
        bezug:'Fachhandel', preis:'ab 40 €', form:'Rohkristall, Cabochon', haupt:true,
        hinweis:'Der vornehmste Jupiterstein der mittelalterlichen Lapidarien. '
          + 'Bei Marbod von Rennes gilt er als Stein der Könige.' },
      { name:'Hyazinth', lat:'Hyacinth', modern:'Zirkon (ZrSiO₄), orangebraun',
        bezug:'Fachhandel', preis:'15–60 €', form:'geschliffen, Rohkristall',
        hinweis:'Nicht zu verwechseln mit dem Hyazinth-Granat des heutigen Handels.' },
      { name:'Beryll', lat:'Beril', modern:'Beryll (Be₃Al₂Si₆O₁₈), farblos bis blaugrün',
        bezug:'leicht', preis:'10–40 €', form:'Rohkristall, Trommelstein' },
      { name:'Smaragd', lat:'Emrald', modern:'Beryll, chromgrün',
        bezug:'Fachhandel', preis:'ab 30 € für trübe Ware, klare Steine deutlich mehr',
        form:'Rohkristall, Trommelstein' },
      { name:'Grüner Jaspis', lat:'green Jasper', modern:'Jaspis, chloritgrün',
        bezug:'sehr leicht', preis:'2–6 €', form:'Trommelstein' },
      { name:'Amethyst', lat:'—', modern:'Quarz, violett',
        bezug:'sehr leicht', preis:'2–8 €', form:'Trommelstein, Druse',
        hinweis:'Nicht bei Agrippa unter Jupiter — er führt ihn unter Mars. In der '
          + 'späteren Überlieferung häufig jupiterisch. Hier nur als Hinweis.' }
    ]
  },
  Mars: {
    glyph: '♂', metall: 'Eisen', farbe: '#bf4a3a',
    wesen: 'Schnitt, Antrieb, Abwehr, Zorn',
    mangel: 'Steht Mars schwach, fehlt die Kante: Abgrenzung fällt schwer, Vorhaben '
          + 'bleiben unbegonnen. Seine Steine sind rot oder eisenhaltig.',
    quelle: 'Agrippa I, XXVII: „Amongst Stones the Diamond, Loadstone, the '
          + 'Blood-stone, the Jasper, the stone that consists of divers kinds, '
          + 'the Amethist."',
    steine: [
      { name:'Blutstein', lat:'Blood-stone', modern:'Heliotrop, grüner Chalcedon mit '
          + 'roten Jaspiseinschlüssen', bezug:'sehr leicht', preis:'3–10 €',
        form:'Trommelstein, Cabochon', haupt:true,
        hinweis:'Der Marsstein der Lapidarien schlechthin — schon Plinius nennt ihn '
          + 'blutstillend. Im Handel oft auch Hämatit als „Blutstein" bezeichnet; '
          + 'gemeint ist hier der Heliotrop.' },
      { name:'Hämatit', lat:'—', modern:'Hämatit (Fe₂O₃)',
        bezug:'sehr leicht', preis:'2–6 €', form:'Trommelstein, poliert',
        hinweis:'Nicht bei Agrippa, aber das Eisenmineral schlechthin und daher '
          + 'in der Praxis der übliche Marsstein.' },
      { name:'Roter Jaspis', lat:'Jasper', modern:'Jaspis, hämatitrot',
        bezug:'sehr leicht', preis:'2–6 €', form:'Trommelstein' },
      { name:'Magnetit', lat:'Loadstone', modern:'Magnetit (Fe₃O₄)',
        bezug:'leicht', preis:'3–12 €', form:'Rohstück' },
      { name:'Diamant', lat:'Diamond', modern:'Diamant (C)',
        bezug:'Fachhandel', preis:'ab 150 € für Kleinstware',
        form:'Rohkristall, geschliffen',
        hinweis:'Bei Marbod von Rennes der härteste und unbezwingbarste Stein — '
          + 'darum martialisch, nicht wegen des Glanzes.' },
      { name:'Amethyst', lat:'Amethist', modern:'Quarz, violett',
        bezug:'sehr leicht', preis:'2–8 €', form:'Trommelstein, Druse',
        hinweis:'Agrippas Zuordnung überrascht; sie folgt der Lehre, der Amethyst '
          + 'bändige den Rausch — eine Mäßigung des Feurigen.' }
    ]
  },
  Sonne: {
    glyph: '☉', metall: 'Gold', farbe: '#d4a020',
    wesen: 'Mitte, Sichtbarkeit, Lebenskraft',
    mangel: 'Eine geschwächte Sonne zeigt sich als Blässe des Eigenen — man wird '
          + 'nicht gesehen, oder sieht sich selbst nicht. Ihre Steine funkeln golden.',
    quelle: 'Agrippa I, XXIII: „Amongst stones, they which resemble the rays of the '
          + 'Sun by their golden sparklings, as doth the glittering stone Aetites … '
          + 'the stone which is called the eye of the Sun … the Carbuncle which '
          + 'shines by night … the Chrysolite stone."',
    steine: [
      { name:'Chrysolith', lat:'Chryfolite', modern:'Peridot, Olivin ((Mg,Fe)₂SiO₄)',
        bezug:'leicht', preis:'8–30 €', form:'Trommelstein, geschliffen', haupt:true,
        hinweis:'Agrippa beschreibt ihn genau: hellgrün, und gegen die Sonne '
          + 'gehalten zeigt sich ein goldener Stern. Das trifft den Peridot.' },
      { name:'Karfunkel', lat:'Carbuncle', modern:'roter Granat (Almandin, Pyrop), '
          + 'im engeren Sinn auch Rubin', bezug:'sehr leicht', preis:'5–20 € für Granat',
        form:'Trommelstein, geschliffen',
        hinweis:'„Karfunkel" ist ein Sammelname für alle glühend roten Steine. '
          + 'Granat ist die erschwingliche, Rubin die kostbare Lesart.' },
      { name:'Rubin', lat:'—', modern:'Korund (Al₂O₃), rot',
        bezug:'Fachhandel', preis:'ab 50 € für trübe Ware', form:'Rohkristall, Cabochon' },
      { name:'Adlerstein', lat:'Aetites', modern:'Toneisenstein-Geode mit lockerem Kern',
        bezug:'schwierig', preis:'20–60 €', form:'Rohknolle',
        hinweis:'Eine hohle Knolle, die beim Schütteln klappert. Über Mineralienbörsen '
          + 'und Fossilienhändler zu bekommen, im Esoterikhandel selten.' },
      { name:'Sonnenauge', lat:'oculus solis', modern:'nicht sicher bestimmbar, '
          + 'wohl ein Achat mit Augenzeichnung', bezug:'als Augenachat leicht',
        preis:'4–15 €', form:'Trommelstein',
        hinweis:'Agrippa beschreibt einen Stein „von der Gestalt eines Augapfels, '
          + 'aus dessen Mitte ein Strahl hervorleuchtet".' }
    ]
  },
  Venus: {
    glyph: '♀', metall: 'Kupfer', farbe: '#7abf6a',
    wesen: 'Bindung, Anmut, Ausgleich, Genuss',
    mangel: 'Schwache Venus heißt: Verbindungen gelingen nicht, das Angenehme fehlt, '
          + 'der Ausgleich misslingt. Ihre Steine sind grün, blau und von milder Farbe.',
    quelle: 'Agrippa I, XXVIII: „Amongst Stones, the Berill, Chrysolite, Emrald, '
          + 'Saphir, green Jasper, the Corneola, the stone Aetites, the Lazull stone, '
          + 'Corall, and all of a fair, various, white, and green colour."',
    steine: [
      { name:'Smaragd', lat:'Emrald', modern:'Beryll, chromgrün',
        bezug:'Fachhandel', preis:'ab 30 €', form:'Rohkristall, Trommelstein', haupt:true,
        hinweis:'Der Venusstein der Lapidarien. Marbod schreibt ihm zu, den Reichtum '
          + 'zu mehren und die Rede zu beflügeln.' },
      { name:'Lapislazuli', lat:'Lazull stone', modern:'Lasurit-Gestein',
        bezug:'sehr leicht', preis:'5–20 €', form:'Trommelstein, Cabochon',
        hinweis:'Auf Pyriteinsprengsel achten — sie zeigen ungefärbte Ware. Billiger '
          + 'Handelslapis ist oft eingefärbter Jaspis.' },
      { name:'Karneol', lat:'Corneola', modern:'Chalcedon, eisenrot',
        bezug:'sehr leicht', preis:'2–8 €', form:'Trommelstein, Cabochon' },
      { name:'Koralle', lat:'Corall', modern:'Edelkoralle (Corallium rubrum)',
        bezug:'eingeschränkt', preis:'15–80 €', form:'Zweig, Perlen',
        hinweis:'Rote Edelkoralle ist geschützt und nur aus zertifizierter Entnahme '
          + 'zu beziehen. Wer das meiden will, nimmt Karneol.' },
      { name:'Beryll', lat:'Berill', modern:'Beryll, farblos bis blaugrün',
        bezug:'leicht', preis:'10–40 €', form:'Rohkristall' },
      { name:'Malachit', lat:'—', modern:'Malachit (Cu₂CO₃(OH)₂)',
        bezug:'sehr leicht', preis:'4–15 €', form:'Trommelstein, Cabochon',
        hinweis:'Nicht bei Agrippa, aber das Kupfermineral — und Kupfer ist das '
          + 'Metall der Venus. In der Praxis der naheliegende Ersatz für den Smaragd.' }
    ]
  },
  Merkur: {
    glyph: '☿', metall: 'Quecksilber', farbe: '#8a6abf',
    wesen: 'Vermittlung, Sprache, Unterscheidung, Handel',
    mangel: 'Ist Merkur schwach, stockt die Vermittlung: Worte finden nicht, Ordnung '
          + 'stellt sich nicht ein. Seine Steine sind vielfarbig und gemustert.',
    quelle: 'Agrippa I, XXIX: „Amongst stones, the Emrald, Achates, red Marble, '
          + 'Topaze, and those which are of divers colours and various figures '
          + 'naturally, and those that are artificial, as glass."',
    steine: [
      { name:'Achat', lat:'Achates', modern:'Chalcedon, gebändert',
        bezug:'sehr leicht', preis:'2–8 €', form:'Trommelstein, Scheibe, Druse', haupt:true,
        hinweis:'Der merkurische Stein schlechthin — vielfarbig, gemustert, in jeder '
          + 'Bänderung anders. Ungefärbte Naturachate erkennt man an gedeckten Tönen.' },
      { name:'Topas', lat:'Topaze', modern:'Topas (Al₂SiO₄(F,OH)₂)',
        bezug:'leicht', preis:'10–40 €', form:'Rohkristall, geschliffen',
        hinweis:'Der mittelalterliche „topazius" meinte oft den Chrysolith. '
          + 'Beide Lesarten sind vertretbar.' },
      { name:'Roter Marmor', lat:'red Marble', modern:'Kalkstein-Marmor, eisenrot',
        bezug:'leicht', preis:'5–20 €', form:'Fliese, Rohstück, gedrechselte Kugel',
        hinweis:'Über Steinmetzbedarf und Mineralienhandel, nicht über den '
          + 'Esoterikhandel.' },
      { name:'Smaragd', lat:'Emrald', modern:'Beryll, chromgrün',
        bezug:'Fachhandel', preis:'ab 30 €', form:'Rohkristall' },
      { name:'Glas und Obsidian', lat:'glass', modern:'künstliches Glas, natürlich Obsidian',
        bezug:'sehr leicht', preis:'2–10 €', form:'Trommelstein, Rohstück',
        hinweis:'Agrippa nennt ausdrücklich das Künstliche — Merkur ist der Planet '
          + 'des Gemachten. Obsidian ist das natürliche Gegenstück.' }
    ]
  },
  Mond: {
    glyph: '☽', metall: 'Silber', farbe: '#aab8c8',
    wesen: 'Wechsel, Nähe, Aufnahme, Gedächtnis des Leibes',
    mangel: 'Ein schwacher Mond zeigt sich als Unruhe im Alltäglichen: Schlaf, Rhythmus '
          + 'und Nähe geraten durcheinander. Seine Steine sind weiß und schimmernd.',
    quelle: 'Agrippa I, XXIV: „Amongst stones, Crystall, the Silver Marcasite, and '
          + 'all those stones that are White and Green. Also the stone Selenites … '
          + 'Also Pearls … also the Berill."',
    steine: [
      { name:'Selenit', lat:'Selenites', modern:'Gips (CaSO₄·2H₂O), Marienglas',
        bezug:'sehr leicht', preis:'3–12 €', form:'Stab, Rohstück, Platte', haupt:true,
        hinweis:'Agrippa beschreibt einen Stein, dessen Mondbild mit dem Mond zu- und '
          + 'abnimmt. Der Name meint heute Gips; die Beschreibung passt ebenso auf '
          + 'den Mondstein. Beide sind vertretbar — Selenit ist wasserlöslich, also '
          + 'trocken lagern.' },
      { name:'Mondstein', lat:'—', modern:'Adular, Kalifeldspat mit Schiller',
        bezug:'sehr leicht', preis:'5–20 €', form:'Trommelstein, Cabochon' },
      { name:'Bergkristall', lat:'Crystall', modern:'Quarz, klar',
        bezug:'sehr leicht', preis:'3–15 €', form:'Spitze, Trommelstein' },
      { name:'Perle', lat:'Pearls', modern:'Perlmutt, Aragonit',
        bezug:'sehr leicht', preis:'5–30 € für Zuchtperlen', form:'lose Perle, Strang' },
      { name:'Markasit', lat:'Silver Marcasite', modern:'Markasit oder Pyrit (FeS₂)',
        bezug:'leicht', preis:'3–12 €', form:'Rohstück, Knolle',
        hinweis:'Markasit zerfällt mit der Zeit an feuchter Luft. Pyrit ist die '
          + 'haltbarere Wahl.' },
      { name:'Beryll', lat:'Berill', modern:'Beryll, farblos',
        bezug:'leicht', preis:'10–40 €', form:'Rohkristall' }
    ]
  }
};

/* Miniaturbilder — ein Bild je Stein, über mehrere Planeten hinweg geteilt */
var BILDER = {
  'Onyx':'onyx', 'Schwarzer Chalcedon':'schwarzer-chalcedon', 'Magnetit':'magnetit',
  'Brauner Jaspis':'brauner-jaspis', 'Saphir':'saphir', 'Hyazinth':'hyazinth',
  'Beryll':'beryll', 'Smaragd':'smaragd', 'Grüner Jaspis':'gruener-jaspis',
  'Amethyst':'amethyst', 'Blutstein':'blutstein', 'Hämatit':'haematit',
  'Roter Jaspis':'roter-jaspis', 'Diamant':'diamant', 'Chrysolith':'chrysolith',
  'Karfunkel':'karfunkel', 'Rubin':'rubin', 'Adlerstein':'adlerstein',
  'Sonnenauge':'sonnenauge', 'Lapislazuli':'lapislazuli', 'Karneol':'karneol',
  'Koralle':'koralle', 'Malachit':'malachit', 'Achat':'achat', 'Topas':'topas',
  'Roter Marmor':'roter-marmor', 'Glas und Obsidian':'obsidian', 'Selenit':'selenit',
  'Mondstein':'mondstein', 'Bergkristall':'bergkristall', 'Perle':'perle',
  'Markasit':'markasit'
};
function bild(steinName) {
  var s = BILDER[steinName];
  return s ? 'bilder/steine/' + s + '.jpg' : null;
}

/* Der Hauptstein eines Planeten */
function hauptstein(planet) {
  var l = LAPIDARIUM[planet];
  for (var i = 0; i < l.steine.length; i++) if (l.steine[i].haupt) return l.steine[i];
  return l.steine[0];
}

/* Empfehlung: die schwaechsten Planeten eines Horoskops mit ihren Steinen */
function empfehlung(urteil, anzahl) {
  return urteil.ranked.slice(0, anzahl || 3).map(function (n) {
    return { planet: n, urteil: urteil.planets[n],
             lapidarium: LAPIDARIUM[n], haupt: hauptstein(n) };
  });
}

var api = { LAPIDARIUM: LAPIDARIUM, hauptstein: hauptstein, empfehlung: empfehlung,
            bild: bild };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
root.Steine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
