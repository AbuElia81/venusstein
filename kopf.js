/* Gemeinsamer Seitenkopf und Seitenfuss */
(function () {
  var seiten = [
    ['index.html', 'Venusstein'],
    ['rechner.html', 'Der Rechner'],
    ['lapidarium.html', 'Lapidarium'],
    ['methode.html', 'Methode']
  ];
  var hier = (location.pathname.split('/').pop() || 'index.html');
  var nav = seiten.slice(1).map(function (s) {
    return '<a href="' + s[0] + '"' + (s[0] === hier ? ' aria-current="page"' : '') + '>' + s[1] + '</a>';
  }).join('');

  document.write(
    '<header class="kopf"><div class="bahn kopf-innen">' +
    '<a class="marke" href="index.html">Venusstein</a><nav>' + nav + '</nav>' +
    '</div></header>');

  window.addEventListener('DOMContentLoaded', function () {
    var f = document.createElement('footer');
    f.className = 'fuss';
    f.innerHTML = '<div class="bahn">' +
      '<p>Venusstein — ein astrologisches Lapidarium. Die Zuordnung der Steine folgt ' +
      'Agrippa von Nettesheim (1533), die Bewertung der Planeten William Lilly (1647). ' +
      '<a href="methode.html">Zur Methode und den Quellen.</a></p>' +
      '<p><a class="quellcode" href="https://github.com/AbuElia81/venusstein">' +
      '<svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">' +
      '<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38' +
      ' 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13' +
      '-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66' +
      '.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15' +
      '-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09' +
      ' 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15' +
      ' 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2' +
      ' 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>' +
      '<span>Quelltext auf GitHub</span></a></p>' +
      '<p style="font-size:.84rem">Diese Seite gibt überlieferte Lehren wieder. Sie ' +
      'ersetzt keine ärztliche Behandlung und keine Beratung in rechtlichen oder ' +
      'finanziellen Dingen.</p></div>';
    document.body.appendChild(f);
  });
})();
