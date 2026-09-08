# Venusstein

Ein astrologisches Lapidarium: Der Rechner ermittelt aus Geburtsdatum, -zeit und
-ort die Stände der sieben sichtbaren Planeten, bewertet ihre Stärke nach
traditioneller Methode und nennt zu den schwächsten die überlieferten Steine.

**https://abuelia81.github.io/venusstein/**

## Seiten

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite |
| `rechner.html` | Geburtshoroskop, Radix rund und quadratisch, Würden, Steinempfehlung |
| `lapidarium.html` | Alle 40 Steine der sieben Planeten |
| `methode.html` | Rechenverfahren, gewählte Systeme, Quellen, Grenzen |

## Rechenkern

| Datei | Aufgabe |
|---|---|
| `astro.js` | Ephemeride: Sonne, Mond, Merkur bis Saturn; Aszendent, MC, Mondknoten |
| `wuerden.js` | Wesentliche und zufällige Würden nach Lilly (1647) |
| `steine.js` | Lapidarium nach Agrippa (1533), mit heutiger Bestimmung und Bezugsangaben |
| `orte.js` | 25.894 Geburtsorte (GeoNames, CC BY); Zeitzonenversatz aus der IANA-Datenbank des Browsers |

Bei unbekannter Geburtszeit entfallen Aszendent, Häuser und Hauswertung; gefragt
wird stattdessen nach der ungefähren Tageszeit. Die Zahlen dahinter stehen in
`methode.html` und lassen sich mit `zeitanalyse.js` nachrechnen.

Kein Build, keine Abhängigkeiten, keine Anfragen an fremde Dienste — bis auf die
Schriften von Google Fonts. Alles rechnet im Browser. Die Eingabe wird in der
`sessionStorage` gehalten, damit ein Seitenwechsel die Berechnung nicht verwirft.

Bilder in `bilder/` und `bilder/steine/` sind mit Gemini erzeugt (`gemini-3-pro-image`
für die großen, `gemini-3.1-flash-image` für die 32 Steinminiaturen); das Skript dazu
liegt nicht im Repo, die Prompts stehen in der Commit-Geschichte.

**Gewählte Systeme:** Lillys Würdentafel, aber mit ägyptischen Termini und
Ganzzeichenhäusern. Triplizitäten bleiben ptolemäisch. Näheres in `methode.html`.

## Entwicklung

Lokal ansehen: statischer Server auf Port 8918 (Eintrag `venusstein` in
`~/.claude/launch.json`).

Nach Änderungen an CSS oder JS die Versionsnummer der Verweise anheben, sonst
liefert der Browser alte Dateien aus:

```bash
./bump.sh
```

Rechenkern prüfen (JavaScriptCore ist auf macOS vorinstalliert):

```bash
/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc astro.js wuerden.js pruefung.js
```

Empfindlichkeit gegenüber unbekannter Geburtszeit nachrechnen:

```bash
/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc astro.js wuerden.js zeitanalyse.js
```

## Quellen

- Agrippa von Nettesheim, *De occulta philosophia* (1533), Buch I, Kap. XXIII–XXIX —
  Steinzuordnungen
- William Lilly, *Christian Astrology* (1647), S. 104–115 — Würdentafeln
- Jean Meeus, *Astronomical Algorithms* (1998); JPL, *Keplerian Elements for
  Approximate Positions of the Major Planets* — Ephemeride
