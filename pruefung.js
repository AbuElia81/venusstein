function T(jd){return (jd-2451545.0)/36525.0;}
function jdUT(y,m,d,h){return Astro.julianDay(y,m,d,h);}
var fails=0;
function ok(label,cond,info){ if(!cond){fails++; print("FEHLT  "+label+"   "+info);} else print("ok     "+label+"   "+info); }

// 1) Sonne zu J2000.0
var t=T(jdUT(2000,1,1,12));
var s=Astro.lonOf('Sonne',t);
ok("Sonne J2000 = 280.382 Grad (wahre, nicht mittlere Laenge)", Math.abs(s-280.382)<0.02, "berechnet "+s.toFixed(4));

// 2) Mond bei totaler Mondfinsternis 2025-03-14 06:59 UT -> Opposition zur Sonne
[[2025,3,14,6.983],[2025,9,7,18.19],[2022,5,16,4.19]].forEach(function(e){
  var tt=T(jdUT(e[0],e[1],e[2],e[3]));
  var d=Math.abs(Astro.arc(Astro.lonOf('Mond',tt)-Astro.lonOf('Sonne',tt)-180));
  ok("Mondfinsternis "+e[0]+"-"+e[1]+"-"+e[2]+" Opposition", d<0.6, "Abweichung "+d.toFixed(3)+" Grad");
});

// 3) Sonnenfinsternis 2024-04-08 18:17 UT -> Konjunktion
[[2024,4,8,18.28],[2017,8,21,18.42]].forEach(function(e){
  var tt=T(jdUT(e[0],e[1],e[2],e[3]));
  var d=Math.abs(Astro.arc(Astro.lonOf('Mond',tt)-Astro.lonOf('Sonne',tt)));
  ok("Sonnenfinsternis "+e[0]+"-"+e[1]+"-"+e[2]+" Konjunktion", d<0.6, "Abweichung "+d.toFixed(3)+" Grad");
});

// 4) Ingresse: Saturn 2025-05-25 nach Widder, Jupiter 2025-06-09 nach Krebs
var ts=T(jdUT(2025,5,25,12));
ok("Saturn Ingress Widder 2025-05-25", Math.abs(Astro.arc(Astro.lonOf('Saturn',ts)-0))<0.6,
   "Saturn bei "+Astro.lonOf('Saturn',ts).toFixed(3));
var tj=T(jdUT(2025,6,9,12));
ok("Jupiter Ingress Krebs 2025-06-09", Math.abs(Astro.lonOf('Jupiter',tj)-90)<0.6,
   "Jupiter bei "+Astro.lonOf('Jupiter',tj).toFixed(3));

// 5) Maximale Elongationen ueber 3000 Zufallsdaten
var maxMer=0,maxVen=0;
for(var i=0;i<3000;i++){
  var jd=2415020+Math.random()*55000; var tt=T(jd);
  var sun=Astro.lonOf('Sonne',tt);
  maxMer=Math.max(maxMer,Math.abs(Astro.arc(Astro.lonOf('Merkur',tt)-sun)));
  maxVen=Math.max(maxVen,Math.abs(Astro.arc(Astro.lonOf('Venus',tt)-sun)));
}
ok("Merkur Elongation <= 28.5", maxMer<28.6, "Maximum "+maxMer.toFixed(2)+" Grad");
ok("Venus Elongation <= 47.5", maxVen<47.6, "Maximum "+maxVen.toFixed(2)+" Grad");

// 6) Merkur rueckläufig 2025-03-25, direkt 2025-05-01
var c1=Astro.chart({year:2025,month:3,day:25,hour:12,minute:0,tz:0,lat:48,lon:11});
var c2=Astro.chart({year:2025,month:5,day:1,hour:12,minute:0,tz:0,lat:48,lon:11});
ok("Merkur rueckläufig 2025-03-25", c1.planets['Merkur'].retrograde===true, "Geschw. "+c1.planets['Merkur'].speed.toFixed(3));
ok("Merkur direkt 2025-05-01", c2.planets['Merkur'].retrograde===false, "Geschw. "+c2.planets['Merkur'].speed.toFixed(3));

// 7) Tag/Nacht und Aszendent
var mit=Astro.chart({year:2025,month:6,day:21,hour:12,minute:0,tz:2,lat:48.14,lon:11.58});
var nac=Astro.chart({year:2025,month:6,day:21,hour:1,minute:0,tz:2,lat:48.14,lon:11.58});
ok("Mittag ist Tagesgeburt", mit.isDay===true, "Sonnenhoehe "+mit.sunAltitude.toFixed(1));
ok("1 Uhr ist Nachtgeburt", nac.isDay===false, "Sonnenhoehe "+nac.sunAltitude.toFixed(1));

// Aszendent muss in 24 Stunden einmal umlaufen und monoton steigen
var prev=null,steps=0,upward=0;
for(var h=0;h<24;h+=0.5){
  var c=Astro.chart({year:2025,month:6,day:21,hour:h,minute:0,tz:0,lat:48.14,lon:11.58});
  if(prev!==null){ steps++; if(Astro.arc(c.asc-prev)>0) upward++; }
  prev=c.asc;
}
ok("Aszendent laeuft vorwaerts", upward===steps, upward+" von "+steps+" Schritten");

// Sonne in Haus 10 gegen Mittag (Ganzzeichen, grobe Lage)
print("\nMittagshoroskop Muenchen 21.06.2025: ASC "+mit.asc.toFixed(2)+"  MC "+mit.mc.toFixed(2));
Astro.ORDER.forEach(function(n){var p=mit.planets[n];
  print("   "+n+"  "+p.lon.toFixed(3)+"  Haus "+p.house+(p.retrograde?"  R":""));});
print(fails===0?"\nALLE TESTS BESTANDEN":"\n"+fails+" TESTS FEHLGESCHLAGEN");
function T(jd){return (jd-2451545.0)/36525.0;}
var norm=function(x){return ((x%360)+360)%360;};
/* Unabhaengige Referenz: klassische Sonnenreihe (Meeus, niedrige Genauigkeit) */
function sunRef(t){var r=Math.PI/180,
 L0=norm(280.46646+36000.76983*t+0.0003032*t*t), M=r*norm(357.52911+35999.05029*t-0.0001537*t*t);
 return norm(L0+(1.914602-0.004817*t-0.000014*t*t)*Math.sin(M)
   +(0.019993-0.000101*t)*Math.sin(2*M)+0.000289*Math.sin(3*M));}
var worst=0,worstD="";
for(var y=1900;y<=2060;y+=1){ for(var mo=1;mo<=12;mo+=3){
  var t=T(Astro.julianDay(y,mo,15,12));
  var d=Math.abs(Astro.arc(Astro.lonOf('Sonne',t)-sunRef(t)));
  if(d>worst){worst=d;worstD=y+"-"+mo;}
}}
print("Sonne gegen klassische Reihe, 1900-2060: groesste Abweichung "+(worst*3600).toFixed(1)+" Bogensekunden ("+worst.toFixed(5)+" Grad) bei "+worstD);
print(worst<0.02 ? "ok  Sonne bestaetigt" : "FEHLT Sonne");

var t0=T(Astro.julianDay(2000,1,1,12));
print("Sonne J2000: eigene Rechnung "+Astro.lonOf('Sonne',t0).toFixed(4)+"  Referenz "+sunRef(t0).toFixed(4));

/* Planeten: Rueckläufigkeitsphasen 2025 gegen bekannte Daten pruefen */
function retroAt(p,y,m,d){var c=Astro.chart({year:y,month:m,day:d,hour:12,minute:0,tz:0,lat:0,lon:0});
 return c.planets[p].retrograde;}
var cases=[
 ["Merkur",2025,3,20,true],["Merkur",2025,4,20,false],["Merkur",2025,7,25,true],["Merkur",2025,11,20,true],
 ["Venus",2025,3,15,true],["Venus",2025,8,15,false],
 ["Mars",2025,1,15,true],["Mars",2025,4,15,false],
 ["Jupiter",2024,11,15,true],["Jupiter",2025,3,15,false],
 ["Saturn",2025,8,15,true],["Saturn",2025,3,15,false]];
var f=0;
cases.forEach(function(c){var r=retroAt(c[0],c[1],c[2],c[3]);
 var good=(r===c[4]); if(!good)f++;
 print((good?"ok    ":"FEHLT ")+c[0]+" "+c[1]+"-"+c[2]+"-"+c[3]+"  rueckläufig="+r+" erwartet="+c[4]);});
print(f===0?"\nALLE PLANETENPHASEN STIMMEN":"\n"+f+" ABWEICHUNGEN");
var W=Wuerden, fails=0;
function ok(l,c,i){ if(!c){fails++;print("FEHLT  "+l+"   "+i);} else print("ok     "+l+"   "+i); }
function sum(e){return e.score;}

/* Handgerechnete Faelle der wesentlichen Wuerden */
// Sonne 20 Grad Loewe, Tagesgeburt: Domizil 5 + Triplizitaet Feuer/Tag 3 = 8
var e1=W.essential('Sonne',4,20,true);
ok("Sonne 20 Löwe (Tag) = 8", sum(e1)===8, "erhalten "+sum(e1)+"  "+JSON.stringify(e1.rows));
// Saturn 21 Grad Waage, Tag: Erhoehung 4 + Triplizitaet Luft/Tag 3 = 7
var e2=W.essential('Saturn',6,21,true);
ok("Saturn 21 Waage (Tag) = 7", sum(e2)===7, "erhalten "+sum(e2)+"  "+JSON.stringify(e2.rows));
// Mars 10 Grad Krebs: Fall -4, Wasser-Triplizitaet Mars +3 = -1
var e3=W.essential('Mars',3,10,true);
ok("Mars 10 Krebs = -1", sum(e3)===-1, "erhalten "+sum(e3)+"  "+JSON.stringify(e3.rows));
// Merkur 15 Grad Jungfrau, Tag: Domizil 5 + Erhoehung 4 + Terminus? Jungfrau Me7,V17 -> 15 ist Venus
//   Gesicht Jungfrau 2. = Venus -> also 9
var e4=W.essential('Merkur',5,15,true);
ok("Merkur 15 Jungfrau = 9", sum(e4)===9, "erhalten "+sum(e4)+"  "+JSON.stringify(e4.rows));
// Mond 5 Grad Steinbock, Nacht: Steinbock ist dem Krebs gegenueber, also Exil -5;
//   Erde-Nacht-Triplizitaet gehoert dem Mond, +3 -> zusammen -2
var e5=W.essential('Mond',9,5,false);
ok("Mond 5 Steinbock (Nacht) = -2", sum(e5)===-2, "erhalten "+sum(e5)+"  "+JSON.stringify(e5.rows));
// Peregrin: Jupiter 25 Grad Stier, Tag -> keine Wuerde, kein Exil -> -5
var e6=W.essential('Jupiter',1,25,true);
ok("Jupiter 25 Stier peregrin = -5", sum(e6)===-5, "erhalten "+sum(e6)+"  "+JSON.stringify(e6.rows));
// Exil ohne doppelte Strafe: Mars 5 Grad Waage, Tag -> Exil -5, sonst nichts, kein Peregrin
var e7=W.essential('Mars',6,5,true);
ok("Mars 5 Waage = -5 ohne Peregrin", sum(e7)===-5 && !e7.rows.some(function(r){return r[0]==='Peregrin';}),
   "erhalten "+sum(e7)+"  "+JSON.stringify(e7.rows));

/* Tafeln auf Vollstaendigkeit pruefen */
var tOk=true;
for(var s=0;s<12;s++){ var t=W.TERMS[s], last=0, tot={};
  if(t.length!==5) tOk=false;
  t.forEach(function(x){ if(x[1]<=last) tOk=false; last=x[1]; tot[x[0]]=1; });
  if(last!==30) tOk=false;
  if(Object.keys(tot).length!==5) tOk=false;  /* fuenf verschiedene Planeten je Zeichen */
}
ok("Aegyptische Termini vollstaendig", tOk, "12 Zeichen, je 5 Termini bis 30 Grad");
ok("36 Gesichter", W.FACES.length===36 && W.FACES[0]==='Mars' && W.FACES[35]==='Mars',
   "erstes "+W.FACES[0]+", letztes "+W.FACES[35]);

/* Jeder Planet muss in genau 2 Zeichen Domizil haben (Sonne und Mond in einem) */
var counts={};
W.DOMICILE.forEach(function(p){counts[p]=(counts[p]||0)+1;});
ok("Domizile korrekt verteilt",
   counts['Sonne']===1&&counts['Mond']===1&&counts['Merkur']===2&&counts['Venus']===2&&
   counts['Mars']===2&&counts['Jupiter']===2&&counts['Saturn']===2, JSON.stringify(counts));

/* Gesamtdurchlauf mit einem echten Horoskop */
var ch=Astro.chart({year:1990,month:5,day:14,hour:9,minute:30,tz:2,lat:48.137,lon:11.575});
var j=W.judge(ch);
print("\nProbehoroskop 14.05.1990 09:30 München — ASC "+ch.asc.toFixed(2)+", "+(ch.isDay?"Tag":"Nacht"));
ch.order.forEach(function(n){var r=j.planets[n];
 print("  "+n.padEnd(8)+" "+r.degInSign.toFixed(1).padStart(5)+" "+r.signName.padEnd(11)+
   " H"+String(r.house).padStart(2)+"  wesentl "+String(r.essential.score).padStart(3)+
   "  zufaellig "+String(r.accidental.score).padStart(3)+"  gesamt "+String(r.total).padStart(3)+
   "  "+r.verdict.label);});
print("Schwaechste drei: "+j.weakest.join(", "));
print(fails===0?"\nALLE WUERDEN-TESTS BESTANDEN":"\n"+fails+" FEHLGESCHLAGEN");
