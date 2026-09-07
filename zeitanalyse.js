/* Wie stark haengt das Ergebnis von der Geburtszeit ab? */
var HAUS = { 1:5,10:5,7:4,4:4,11:4,2:3,5:3,9:2,3:1,8:-4,6:-4,12:-5 };
var ORDER = Astro.ORDER;
function zufall(a,b){ return a + Math.random()*(b-a); }

var N = 260, SCHRITT = 15;            /* Nativitaeten, Minutenschritt */
var orte = [[48.14,11.58],[52.52,13.41],[47.37,8.54],[48.21,16.37],[41.90,12.50],
            [40.71,-74.01],[51.51,-0.13],[-33.87,151.21],[35.69,139.69],[59.33,18.07]];

var st = {
  ascZeichen:0, mondZeichenWechsel:0, tagNachtWechsel:0,
  schwankung:{}, schwaechsterTrifft:0, dreiTreffer:0, gesamt:0,
  redSchwaechsterTrifft:0, redDreiTreffer:0, redSelbstStabil:0, redGesamt:0,
  redSchwankung:{}
};
ORDER.forEach(function(n){ st.schwankung[n]=[]; st.redSchwankung[n]=[]; });

function auswerten(y,mo,d,lat,lon){
  var reihen=[], mondZeichen={}, tage=0, nacht=0, ascZ={};
  for (var min=0; min<1440; min+=SCHRITT){
    var ch = Astro.chart({year:y,month:mo,day:d,hour:Math.floor(min/60),
                          minute:min%60,tz:0,lat:lat,lon:lon});
    var j = Wuerden.judge(ch);
    var voll={}, red={};
    ORDER.forEach(function(n){
      voll[n]=j.planets[n].total;
      red[n]=j.planets[n].total - HAUS[ch.planets[n].house];   /* Haus herausrechnen */
    });
    reihen.push({voll:voll, red:red});
    mondZeichen[ch.planets['Mond'].sign]=1;
    ascZ[ch.ascSign]=1;
    if (ch.isDay) tage++; else nacht++;
  }
  if (Object.keys(mondZeichen).length>1) st.mondZeichenWechsel++;
  if (tage>0 && nacht>0) st.tagNachtWechsel++;
  st.ascZeichen += Object.keys(ascZ).length;

  function rang(o){ return ORDER.slice().sort(function(a,b){return o[a]-o[b];}); }
  var mittag = reihen[Math.floor(reihen.length/2)];
  var mVoll = rang(mittag.voll), mRed = rang(mittag.red);

  ORDER.forEach(function(n){
    var v=reihen.map(function(r){return r.voll[n];});
    var r2=reihen.map(function(r){return r.red[n];});
    st.schwankung[n].push(Math.max.apply(null,v)-Math.min.apply(null,v));
    st.redSchwankung[n].push(Math.max.apply(null,r2)-Math.min.apply(null,r2));
  });

  reihen.forEach(function(r){
    var wVoll=rang(r.voll), wRed=rang(r.red);
    st.gesamt++;
    if (mVoll[0]===wVoll[0]) st.schwaechsterTrifft++;
    st.dreiTreffer += mVoll.slice(0,3).filter(function(p){return wVoll.slice(0,3).indexOf(p)>=0;}).length;
    st.redGesamt++;
    if (mRed[0]===wRed[0]) st.redSelbstStabil++;
    /* Trifft die haus-freie Mittagsrechnung den wahren schwaechsten Planeten? */
    if (mRed[0]===wVoll[0]) st.redSchwaechsterTrifft++;
    st.redDreiTreffer += mRed.slice(0,3).filter(function(p){return wVoll.slice(0,3).indexOf(p)>=0;}).length;
  });
}

for (var i=0;i<N;i++){
  var y=Math.floor(zufall(1940,2011)), mo=Math.floor(zufall(1,13)), d=Math.floor(zufall(1,29));
  var o=orte[Math.floor(Math.random()*orte.length)];
  auswerten(y,mo,d,o[0],o[1]);
}

function mittel(a){ return a.reduce(function(x,y){return x+y;},0)/a.length; }
print("=== "+N+" Nativitaeten, Geburtszeit in "+SCHRITT+"-Minuten-Schritten ueber 24 Stunden ===\n");
print("Aszendentenzeichen im Tagesverlauf: im Schnitt "+(st.ascZeichen/N).toFixed(1)+" von 12");
print("Mond wechselt am Geburtstag das Zeichen: "+(100*st.mondZeichenWechsel/N).toFixed(0)+"% der Faelle");
print("Tag- und Nachtgeburt beide moeglich:    "+(100*st.tagNachtWechsel/N).toFixed(0)+"% (immer, da 24h)");
print("\n--- VOLLE RECHNUNG, Mittag als Annahme ---");
print("Schwaechster Planet trifft zu:          "+(100*st.schwaechsterTrifft/st.gesamt).toFixed(1)+"%");
print("Von den drei Schwaechsten richtig:      "+(st.dreiTreffer/st.gesamt).toFixed(2)+" von 3");
print("\n--- OHNE HAUSWERTUNG, Mittag als Annahme ---");
print("Rangfolge bleibt ueber den Tag gleich:  "+(100*st.redSelbstStabil/st.redGesamt).toFixed(1)+"%");
print("Trifft den wahren schwaechsten Planeten:"+(100*st.redSchwaechsterTrifft/st.redGesamt).toFixed(1)+"%");
print("Von den drei Schwaechsten richtig:      "+(st.redDreiTreffer/st.redGesamt).toFixed(2)+" von 3");
print("\n--- Schwankungsbreite der Punktzahl ueber 24 Stunden ---");
print("Planet     mit Haeusern   ohne Haeuser");
ORDER.forEach(function(n){
  print("  "+n.padEnd(9)+" "+mittel(st.schwankung[n]).toFixed(1).padStart(8)+
        "      "+mittel(st.redSchwankung[n]).toFixed(1).padStart(8));
});
var HAUS={1:5,10:5,7:4,4:4,11:4,2:3,5:3,9:2,3:1,8:-4,6:-4,12:-5};
var ORDER=Astro.ORDER;
var orte=[[48.14,11.58],[52.52,13.41],[47.37,8.54],[48.21,16.37],[41.90,12.50],
          [40.71,-74.01],[51.51,-0.13],[-33.87,151.21],[35.69,139.69],[59.33,18.07]];
function rang(o){return ORDER.slice().sort(function(a,b){return o[a]-o[b];});}

var N=300, S=15;
var z={tagNachtGleich:0, tagNachtN:0,
       redTag:0, redTagN:0, redNacht:0, redNachtN:0,
       nurWesentlich:0, nurWesentlichN:0,
       ohneMond:0, ohneMondN:0,
       bandStabil:0, bandN:0};

for (var i=0;i<N;i++){
  var y=1940+Math.floor(Math.random()*71), mo=1+Math.floor(Math.random()*12),
      d=1+Math.floor(Math.random()*28), o=orte[Math.floor(Math.random()*orte.length)];
  var reihen=[];
  for (var min=0;min<1440;min+=S){
    var ch=Astro.chart({year:y,month:mo,day:d,hour:Math.floor(min/60),minute:min%60,
                        tz:0,lat:o[0],lon:o[1]});
    var j=Wuerden.judge(ch);
    var red={}, wes={};
    ORDER.forEach(function(n){
      red[n]=j.planets[n].total-HAUS[ch.planets[n].house];
      wes[n]=j.planets[n].essential.score;
    });
    reihen.push({red:red, wes:wes, tag:ch.isDay});
  }
  /* 1) Wie oft stimmt die haus-freie Rangfolge bei Tag- und bei Nachtannahme ueberein? */
  var tagR=reihen.filter(function(r){return r.tag;}), nachtR=reihen.filter(function(r){return !r.tag;});
  if (tagR.length && nachtR.length){
    z.tagNachtN++;
    if (rang(tagR[Math.floor(tagR.length/2)].red)[0]===rang(nachtR[Math.floor(nachtR.length/2)].red)[0])
      z.tagNachtGleich++;
  }
  /* 2) Stabilitaet der haus-freien Rangfolge INNERHALB einer bekannten Tageshaelfte */
  [[tagR,'redTag'],[nachtR,'redNacht']].forEach(function(p){
    var arr=p[0]; if(!arr.length) return;
    var basis=rang(arr[Math.floor(arr.length/2)].red)[0];
    arr.forEach(function(r){ z[p[1]+'N']++; if(rang(r.red)[0]===basis) z[p[1]]++; });
  });
  /* 3) Nur wesentliche Wuerden, ueber den ganzen Tag */
  var bw=rang(reihen[Math.floor(reihen.length/2)].wes)[0];
  reihen.forEach(function(r){ z.nurWesentlichN++; if(rang(r.wes)[0]===bw) z.nurWesentlich++; });
  /* 4) Haus-frei, aber ohne den Mond */
  function rangOM(ob){ return ORDER.filter(function(n){return n!=='Mond';})
      .sort(function(a,b){return ob[a]-ob[b];}); }
  var bo=rangOM(reihen[Math.floor(reihen.length/2)].red)[0];
  reihen.forEach(function(r){ z.ohneMondN++; if(rangOM(r.red)[0]===bo) z.ohneMond++; });
  /* 5) Vier-Stunden-Band um den Mittag (10-14 Uhr), haus-frei */
  var band=reihen.filter(function(r,ix){var m=ix*S; return m>=600&&m<840;});
  var bb=rang(band[Math.floor(band.length/2)].red)[0];
  band.forEach(function(r){ z.bandN++; if(rang(r.red)[0]===bb) z.bandStabil++; });
}
function p(a,b){ return (100*a/b).toFixed(1)+'%'; }
print("=== "+N+" Nativitaeten ===\n");
print("Haus-frei, schwaechster Planet bei Tag- und Nachtannahme derselbe: "+p(z.tagNachtGleich,z.tagNachtN));
print("Haus-frei, stabil innerhalb bekannter Tageshaelfte (Tag):         "+p(z.redTag,z.redTagN));
print("Haus-frei, stabil innerhalb bekannter Tageshaelfte (Nacht):       "+p(z.redNacht,z.redNachtN));
print("Haus-frei ohne den Mond, stabil ueber 24 Stunden:                 "+p(z.ohneMond,z.ohneMondN));
print("Nur wesentliche Wuerden, stabil ueber 24 Stunden:                 "+p(z.nurWesentlich,z.nurWesentlichN));
print("Haus-frei, stabil in einem Vier-Stunden-Fenster:                  "+p(z.bandStabil,z.bandN));
