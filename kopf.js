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
      '<p style="font-size:.84rem">Diese Seite gibt überlieferte Lehren wieder. Sie ' +
      'ersetzt keine ärztliche Behandlung und keine Beratung in rechtlichen oder ' +
      'finanziellen Dingen.</p></div>';
    document.body.appendChild(f);
  });
})();
