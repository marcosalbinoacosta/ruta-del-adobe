'use strict';
/* =========================================================
   RUTA DEL ADOBE · motor de la expedición
   ========================================================= */
const $ = id => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const W = 3600, H = 2500, OX = 300, OY = 250;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;

/* ---------- Trazado de la ruta (Tinogasta → Fiambalá) ---------- */
const PTS0 = [[420,1770],[560,1690],[700,1660],[820,1560],[930,1470],[1060,1480],[1160,1410],[1230,1310],[1360,1250],[1450,1190],[1520,1120],[1560,1050],[1680,1010],[1800,960],[1900,870],[1990,760],[2120,720],[2230,610],[2300,520],[2360,470],[2470,430],[2570,330]];
const PTS = PTS0.map(([x,y]) => [x + OX, y + OY]);

/* ---------- Contenido (basado en la presentación) ---------- */
const stops = [
 {name:'Tinogasta', short:'Tinogasta', pt:0, image:'world', caption:'VALLE DE ABAUCÁN', tag:'PUNTO DE PARTIDA', town:'Tinogasta, Catamarca', title:'El viaje empieza acá', desc:'Seguí la línea punteada hacia Fiambalá. Atravesá los adobes que flotan en el aire y ganá un sello en cada parada.'},
 {name:'Oratorio de los Orquera', short:'Orquera', pt:3, image:'orquera', town:'El Puesto', icon:'chapel',
  desc:'Bajo los árboles de El Puesto, una pequeña capilla conserva la memoria de una familia y de todo un pueblo.',
  loc:'El Puesto, departamento Tinogasta, Catamarca. Se encuentra dentro del recorrido de la Ruta del Adobe, sobre el corredor de la Ruta Nacional 60.',
  story:'En El Puesto, el Oratorio de los Orquera reúne la escala íntima de una capilla familiar y la historia de la comunidad. Sus muros de tierra y su estructura de madera permiten acercarse a las técnicas constructivas tradicionales del valle. Una parada para detenerse, observar y escuchar a quienes cuidan este patrimonio.',
  detail:'Mirá cómo la tierra y la madera conviven en la construcción. El adobe se moldea con tierra, agua y fibras naturales, y se seca al sol.',
  tip:'Consultá la apertura antes de ir. Pedí autorización para fotografiar el interior.',
  query:'Oratorio de los Orquera El Puesto Catamarca',
  quiz:{q:'El adobe es el gran protagonista de esta ruta. ¿Cómo se seca cada bloque?', o:['En un horno de leña','Al sol','Con fuego de algarrobo'], a:1, ok:'¡Exacto! Tierra, agua y fibras naturales, moldeadas y secadas al sol.'}},
 {name:'Iglesia Nuestra Señora de Andacollo', short:'Andacollo', pt:6, image:'andacollo', town:'La Falda', icon:'towers',
  desc:'Dos torres, una fachada de adobe y las montañas como telón de fondo. Una presencia imposible de ignorar.',
  loc:'La Falda, departamento Tinogasta, Catamarca. Se encuentra a la vera de la Ruta Nacional 60.',
  story:'En La Falda, la Iglesia Nuestra Señora de Andacollo es reconocida por sus características constructivas tradicionales. Su fachada con dos torres adapta las formas arquitectónicas al material del lugar: la tierra es estructura y también expresión.',
  detail:'Buscá las dos torres y las pilastras de la fachada: el lenguaje arquitectónico se interpreta con adobe.',
  tip:'Respetá los espacios de culto. Los accesos pueden incluir superficies irregulares.',
  query:'Iglesia Nuestra Señora de Andacollo La Falda Catamarca',
  quiz:{q:'¿Qué distingue a la fachada de Nuestra Señora de Andacollo?', o:['Una cúpula de vidrio','Dos torres de adobe','Un campanario de piedra'], a:1, ok:'¡Muy bien! Sus dos torres la vuelven inconfundible a la vera de la RN 60.'}},
 {name:'Mayorazgo de Anillaco', short:'Mayorazgo', pt:9, image:'mayorazgo', town:'Anillaco', icon:'house',
  desc:'Una antigua residencia revela otra manera de habitar y organizar la vida en el valle.',
  loc:'Anillaco, departamento Tinogasta, Catamarca. Es uno de los principales conjuntos históricos de la Ruta del Adobe.',
  story:'El Mayorazgo de Anillaco y su capilla son considerados uno de los conjuntos históricos más importantes de la zona. Su arquitectura permite conocer una dimensión residencial y productiva del pasado colonial, más allá de los espacios religiosos. Recorrerlo con guía ayuda a interpretar las construcciones y su relación con el territorio.',
  detail:'El mayorazgo estaba vinculado a la organización de la propiedad y la herencia en la época colonial.',
  tip:'Combiná la visita con la Capilla del Rosario, en el mismo conjunto. Consultá las áreas habilitadas.',
  query:'Mayorazgo de Anillaco Catamarca',
  quiz:{q:'Además de lo religioso, ¿qué nos muestra el Mayorazgo de Anillaco?', o:['La vida residencial y productiva de la época colonial','Una antigua estación de tren','Un fuerte de frontera'], a:0, ok:'¡Correcto! Es uno de los principales conjuntos históricos de la ruta.'}},
 {name:'Capilla Nuestra Señora del Rosario', short:'El Rosario', pt:11, image:'rosario', town:'Anillaco', icon:'bell',
  desc:'La sencillez del exterior guarda un patrimonio religioso y artesanal de enorme valor.',
  loc:'Anillaco, departamento Tinogasta, Catamarca. Se encuentra junto al conjunto histórico del Mayorazgo de Anillaco.',
  story:'La Capilla Nuestra Señora del Rosario integra el conjunto patrimonial de Anillaco. Su interior invita a prestar atención a los materiales, las imágenes religiosas y las soluciones artesanales. Junto al Mayorazgo, permite comprender la vida colonial en esta zona de Catamarca.',
  detail:'La capilla se fecha en 1712. Su altar de barro es uno de los detalles que distingue esta visita.',
  tip:'El acceso depende de la apertura del sitio. No toques altares, imágenes ni superficies históricas.',
  query:'Capilla Nuestra Señora del Rosario Anillaco Catamarca',
  quiz:{q:'¿Junto a qué conjunto histórico se encuentra la Capilla del Rosario?', o:['La Comandancia de Armas','El Mayorazgo de Anillaco','Las Ruinas de Batungasta'], a:1, ok:'¡Sí! Capilla y Mayorazgo forman el conjunto de Anillaco.'}},
 {name:'Ruinas de Batungasta', short:'Batungasta', pt:14, image:'watungasta', town:'Zona de Anillaco', icon:'ruins',
  desc:'El viaje retrocede aún más: vestigios de un poblado prehispánico en medio del paisaje.',
  loc:'Zona de Anillaco, departamento Tinogasta, Catamarca. Se encuentran en las cercanías del recorrido y constituyen un importante sitio arqueológico de la región.',
  story:'Las Ruinas de Batungasta (también llamadas Watungasta) permiten reconocer la profundidad de la historia del valle, anterior a las construcciones coloniales. Vinculadas al patrimonio prehispánico y al antiguo Qhapaq Ñan, son parte esencial de la Ruta del Adobe. Sus vestigios requieren una visita especialmente cuidadosa.',
  detail:'Batungasta y Watungasta son dos nombres utilizados para el mismo sitio arqueológico.',
  tip:'Seguí únicamente los sectores habilitados. No camines sobre estructuras ni retires fragmentos. Priorizá una visita guiada.',
  query:'Ruinas de Batungasta Catamarca',
  quiz:{q:'Las Ruinas de Batungasta están vinculadas a un antiguo camino. ¿Cuál?', o:['El Camino Real colonial','La Ruta Nacional 40','El Qhapaq Ñan, el camino inca'], a:2, ok:'¡Exacto! Patrimonio prehispánico ligado al Qhapaq Ñan.'}},
 {name:'Iglesia de San Pedro', short:'San Pedro', pt:19, image:'san-pedro', town:'Fiambalá', icon:'church',
  desc:'Muros claros, madera de algarrobo y una silueta que pertenece al paisaje desde el siglo XVIII.',
  loc:'Fiambalá, departamento Tinogasta, Catamarca. Es uno de los principales edificios históricos del recorrido y se encuentra en el centro de la localidad.',
  story:'La Iglesia de San Pedro de Fiambalá fue construida en el siglo XVIII y tiene un gran valor arquitectónico y religioso. Su arquitectura colonial conserva una fuerte relación con los materiales del valle: adobe, madera y cañas. Fue declarada Monumento Histórico Nacional y forma un conjunto con la Comandancia de Armas.',
  detail:'El campanario tiene un remate a cuatro aguas. En el interior se conservan pinturas de la escuela cuzqueña.',
  tip:'Confirmá horarios y condiciones de visita con Turismo de Fiambalá.',
  query:'Iglesia de San Pedro Fiambala Catamarca',
  quiz:{q:'¿En qué siglo se construyó la Iglesia de San Pedro de Fiambalá?', o:['Siglo XVIII','Siglo XX','Siglo XVI'], a:0, ok:'¡Correcto! Siglo XVIII: uno de los edificios de mayor valor del recorrido.'}},
 {name:'Comandancia de Armas', short:'Comandancia', pt:21, image:'comandancia', town:'Fiambalá', icon:'fort',
  desc:'El último capítulo: un antiguo edificio de importancia histórica para Fiambalá.',
  loc:'Fiambalá, departamento Tinogasta, Catamarca. Forma parte del conjunto histórico relacionado con la Iglesia de San Pedro.',
  story:'La Comandancia de Armas de Fiambalá es un antiguo edificio de importancia histórica para la localidad. Completa el conjunto de San Pedro y amplía la mirada hacia los usos civiles y administrativos del patrimonio. Aquí termina el recorrido propuesto, pero el valle tiene muchas otras historias para descubrir.',
  detail:'La Comandancia y la Iglesia de San Pedro pueden conocerse como parte de una misma parada en Fiambalá.',
  tip:'Si tenés otro día, consultá por otros atractivos de Fiambalá. Cada excursión tiene sus propios accesos y condiciones.',
  query:'Comandancia de Armas Fiambala Catamarca',
  quiz:{q:'La Comandancia de Armas forma un conjunto histórico junto a…', o:['La Iglesia de San Pedro','El Oratorio de los Orquera','La Iglesia de Andacollo'], a:0, ok:'¡Muy bien! Comandancia e iglesia se recorren juntas en Fiambalá.'}}
];
const LAST = stops.length - 1;
const plans = {
 half:'Elegí menos paradas: por ejemplo, Oratorio de los Orquera, el conjunto de Anillaco y la Iglesia de San Pedro. Calculá al menos 4 a 5 horas para recorrer con calma.',
 day:'Mañana: salí de Tinogasta y visitá Orquera, Andacollo y el conjunto de Anillaco. Pausa para almorzar. Tarde: Batungasta y cierre en Fiambalá con San Pedro y la Comandancia de Armas. Confirmá todas las aperturas.',
 two:'Día 1: Tinogasta, Orquera, Andacollo y Anillaco, con tiempo para gastronomía regional y artesanías. Día 2: Batungasta, San Pedro y Comandancia, y otros atractivos de Fiambalá según disponibilidad.'
};
const ICONS = {
 chapel:'M-16 16V-2h32V16M-18 -1 0-14 18-1M0-14v-9M-4-19h8M-4 16V6h8v10',
 towers:'M-21 16V-8h9V16M12 16V-8h9V16M-12 16V0h24V16M-21-8l4.5-8 4.5 8M12-8l4.5-8 4.5 8M-4 16V7h8v9',
 house:'M-20 16V-4h40V16ZM-22-4h44M-13 2h7v6h-7zM5 4h8v12',
 bell:'M-8 16V-8h16V16M-10-8 0-19 10-8M-3-3h6v6h-6zM-21 16V3h13M8 3h13v13',
 ruins:'M-22 16h44M-18 16V0h8v6h5V-6h9v10h5V0h7v16',
 church:'M-6 16V-10h12V16M-8-10 0-20 8-10M-3-6h6v5h-6zM-20 16V2h14M6 2h14v14M-2 16V9h4v7',
 fort:'M-20 16V-5h40V16M-20-5v-6h6v6M-6-5v-6h6v6M8-5v-6h6v6M-4 16V5h8v11'
};
const INKS = ['#a3570f','#66753a','#2f6a9a','#9b3b2a','#a3570f','#66753a','#2f6a9a'];

/* ---------- Estado guardado ---------- */
const store = {
 read(){ try { return JSON.parse(localStorage.getItem('adobe-v3')) || {}; } catch { return {}; } },
 write(){ try { localStorage.setItem('adobe-v3', JSON.stringify({stamps:save.stamps, adobes:[...gotAdobes], checks:save.checks})); return true; } catch { return false; } }
};
const save = Object.assign({stamps:{}, adobes:[], checks:[]}, store.read());
if (typeof save.stamps !== 'object' || Array.isArray(save.stamps)) save.stamps = {};
const gotAdobes = new Set(Array.isArray(save.adobes) ? save.adobes : []);
const stamped = i => Object.hasOwn(save.stamps, i);
const stampCount = () => Object.keys(save.stamps).length;

/* ---------- Utilidades SVG ---------- */
function el(tag, attrs, parent){ const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function catmull(pts){
 let d = `M${pts[0][0]} ${pts[0][1]}`;
 for (let i = 0; i < pts.length - 1; i++){
  const p0 = pts[i-1] || pts[i], p1 = pts[i], p2 = pts[i+1], p3 = pts[i+2] || p2;
  d += `C${(p1[0]+(p2[0]-p0[0])/6).toFixed(1)} ${(p1[1]+(p2[1]-p0[1])/6).toFixed(1)} ${(p2[0]-(p3[0]-p1[0])/6).toFixed(1)} ${(p2[1]-(p3[1]-p1[1])/6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
 }
 return d;
}
function rng(seed){ return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* ---------- Construcción del mapa ---------- */
const route = $('route');
const ROUTE_D = catmull(PTS);
route.setAttribute('d', ROUTE_D);
$('route-done').setAttribute('d', ROUTE_D);
const total = route.getTotalLength();
$('route-done').style.strokeDasharray = `${total} ${total}`;
{ // t de cada parada
 const tmp = el('path', {}, $('defs'));
 stops.forEach(s => { if (s.pt === 0) { s.t = 0; return; } tmp.setAttribute('d', catmull(PTS.slice(0, s.pt + 1))); s.t = Math.min(1, tmp.getTotalLength() / total); });
 stops[LAST].t = 1; tmp.remove();
 stops.forEach(s => { const p = route.getPointAtLength(s.t * total); s.x = p.x; s.y = p.y; });
}
const samples = [];
for (let i = 0; i <= 400; i++) { const p = route.getPointAtLength(i / 400 * total); samples.push([p.x, p.y]); }
function nearestSample(x, y){ let best = 1e12, bi = 0; for (let i = 0; i < samples.length; i += 2){ const dx = samples[i][0]-x, dy = samples[i][1]-y, d = dx*dx+dy*dy; if (d < best){ best = d; bi = i; } } return {d:Math.sqrt(best), i:bi}; }
function tangentAt(i){ const a = samples[Math.max(0,i-2)], b = samples[Math.min(samples.length-1,i+2)]; const dx = b[0]-a[0], dy = b[1]-a[1], l = Math.hypot(dx,dy) || 1; return [dx/l, dy/l]; }

function buildMap(){
 const R = rng(1770);
 const wash = $('layer-wash');
 el('ellipse',{cx:650+OX,cy:620+OY,rx:1000,ry:720,fill:'url(#wash-rose)'},wash);
 el('ellipse',{cx:2450+OX,cy:1420+OY,rx:950,ry:720,fill:'url(#wash-mint)'},wash);
 el('ellipse',{cx:2700+OX,cy:250+OY,rx:600,ry:400,fill:'url(#wash-rose)'},wash);
 el('ellipse',{cx:350+OX,cy:1900+OY,rx:600,ry:380,fill:'url(#wash-mint)'},wash);
 for (let i = 0; i < samples.length; i += 40) el('ellipse',{cx:samples[i][0],cy:samples[i][1],rx:420,ry:300,fill:'url(#wash-sand)'},wash);

 // retícula + marco de mapa antiguo
 const grid = $('layer-grid');
 for (let x = 250; x < W; x += 250) el('path',{d:`M${x} 0V${H}`,stroke:'#7d93a8','stroke-width':2,opacity:.22},grid);
 for (let y = 250; y < H; y += 250) el('path',{d:`M0 ${y}H${W}`,stroke:'#7d93a8','stroke-width':2,opacity:.22},grid);
 el('rect',{x:24,y:24,width:W-48,height:H-48,fill:'none',stroke:'#2f2c28','stroke-width':6},grid);
 el('rect',{x:40,y:40,width:W-80,height:H-80,fill:'none',stroke:'#2f2c28','stroke-width':2},grid);

 // río Abaucán (paralelo a la ruta)
 const riv = [];
 for (let i = 0; i < samples.length; i += 8){ const [tx,ty] = tangentAt(i); const off = 120 + 50*Math.sin(i*.09); riv.push([samples[i][0] + ty*off, samples[i][1] - tx*off]); }
 { const [a,b] = [riv[0], riv[1]]; riv.unshift([a[0]-(b[0]-a[0])*6, a[1]-(b[1]-a[1])*6]); const n = riv.length, c = riv[n-1], d = riv[n-2]; riv.push([c[0]+(c[0]-d[0])*6, c[1]+(c[1]-d[1])*6]); }
 const rd = catmull(riv), river = $('layer-river');
 el('path',{d:rd,fill:'none',stroke:'#a9c7cf','stroke-width':30,'stroke-linecap':'round',opacity:.55},river);
 el('path',{d:rd,fill:'none',stroke:'#5f8ea3','stroke-width':6,'stroke-linecap':'round'},river);
 const rl = riv[9], rl2 = riv[10];
 const rt = el('text',{x:rl[0],y:rl[1]-22,class:'map-label','font-size':26,fill:'#4d7a90','text-anchor':'middle',transform:`rotate(${Math.atan2(rl2[1]-rl[1],rl2[0]-rl[0])*180/Math.PI} ${rl[0]} ${rl[1]})`},river);
 rt.textContent = 'RÍO ABAUCÁN';

 // camino (RN 60)
 const road = $('layer-road');
 el('path',{d:ROUTE_D,fill:'none',stroke:'#9c8466','stroke-width':26,'stroke-linecap':'round'},road);
 el('path',{d:ROUTE_D,fill:'none',stroke:'#f5e9cc','stroke-width':19,'stroke-linecap':'round'},road);
 [70, 230, 330].forEach(i => { const [x,y] = samples[i], [tx,ty] = tangentAt(i); const g = el('g',{transform:`translate(${x - ty*62} ${y + tx*62})`},road);
  el('path',{d:'M-22-24h44v26c0 14-12 22-22 26-10-4-22-12-22-26z',fill:'#fbf9f3',stroke:'#2f2c28','stroke-width':4},g);
  const t = el('text',{y:6,'text-anchor':'middle','font-size':22,'font-family':'Special Elite, monospace',fill:'#2f2c28'},g); t.textContent = '60'; });

 // montañas a mano
 const mts = [];
 for (let gy = 80; gy < H + 60; gy += 62) for (let gx = 60; gx < W + 40; gx += 74){
  const x = gx + (R()-.5)*50, y = gy + (R()-.5)*40;
  const {d, i} = nearestSample(x, y);
  if (d < 210) continue;
  if (R() > clamp((d - 210) / 230, 0, 1) * .92) continue;
  if (x < 700 && y < 360) continue; // cartela
  if (x > W - 420 && y > H - 440) continue; // rosa de los vientos
  const [tx,ty] = tangentAt(i), side = (tx*(y - samples[i][1]) - ty*(x - samples[i][0])) > 0 ? 1 : -1;
  const s = 26 + R()*26 + Math.min(46, (d - 210) / 9);
  mts.push({x, y, w:s*(.9 + R()*.5), h:s*(1.1 + R()*.7), side});
 }
 mts.sort((a,b) => a.y - b.y);
 const layer = $('layer-mountains');
 const frag = document.createDocumentFragment();
 for (const m of mts){
  const {x,y,w,h} = m, west = m.side < 0;
  const fill = west ? '#f0d3be' : '#dfe3c4', shade = west ? '#cf9a80' : '#a6b383';
  const g = el('g',{},frag);
  el('path',{d:`M${x-w} ${y}Q${x-w*.5} ${y-h*.55} ${x} ${y-h}Q${x+w*.45} ${y-h*.5} ${x+w} ${y}Z`,fill},g);
  el('path',{d:`M${x} ${y-h}Q${x+w*.45} ${y-h*.5} ${x+w} ${y}L${x+w*.18} ${y}Q${x+w*.12} ${y-h*.5} ${x} ${y-h}Z`,fill:shade},g);
  el('path',{d:`M${x-w} ${y}Q${x-w*.5} ${y-h*.55} ${x} ${y-h}Q${x+w*.45} ${y-h*.5} ${x+w} ${y}`,class:'m-ink'},g);
  let hd = '';
  for (let k = 1; k <= 3; k++){ const fx = x + w*(.2 + k*.17), fy = y - h*(.62 - k*.17); hd += `M${fx.toFixed(1)} ${fy.toFixed(1)}l${(-w*.12).toFixed(1)} ${(h*.16).toFixed(1)}`; }
  el('path',{d:hd,class:'m-hatch'},g);
 }
 layer.appendChild(frag);

 // pueblos: casitas de adobe y arboledas
 const towns = $('layer-towns');
 stops.forEach((s, si) => {
  for (let k = 0; k < 22; k++){
   const a = R()*Math.PI*2, r = 70 + R()*170, x = s.x + Math.cos(a)*r, y = s.y + Math.sin(a)*r;
   if (nearestSample(x,y).d < 34 || (y < s.y && y > s.y - 150 && Math.abs(x - s.x) < 60)) continue;
   if (k < 7){ const w = 26 + R()*18, h = 18 + R()*10;
    el('rect',{x:x-w/2,y:y-h,width:w,height:h,fill:'#d9a679',stroke:'#5a4636','stroke-width':2.5},towns);
    el('rect',{x:x-w/2-3,y:y-h-4,width:w+6,height:5,fill:'#b98457',stroke:'#5a4636','stroke-width':2},towns);
    el('rect',{x:x-3,y:y-9,width:6,height:9,fill:'#5a4636'},towns);
   } else { const r2 = 7 + R()*7;
    el('circle',{cx:x,cy:y,r:r2,fill:si % 2 ? '#93a462' : '#8a9a55',stroke:'#5e6b3c','stroke-width':2},towns);
   }
  }
 });

 // rótulos
 const labels = $('layer-labels');
 const label = (txt, x, y, size, rot = 0, extra = {}) => { const t = el('text',Object.assign({x,y,class:'map-label','font-size':size,'text-anchor':'middle',transform:`rotate(${rot} ${x} ${y})`},extra),labels); t.textContent = txt; return t; };
 const off = (i, d) => { const [x,y] = samples[i], [tx,ty] = tangentAt(i); return [x - ty*d, y + tx*d, Math.atan2(ty,tx)*180/Math.PI]; };
 { const [x,y,a] = off(200, 250); label('VALLE DE ABAUCÁN', x, y, 46, a, {opacity:.55}); }
 label('SIERRA DE FIAMBALÁ', 2380+OX, 1300+OY, 50, -32, {opacity:.5});
 label('← HACIA LA CORDILLERA DE LOS ANDES', 560+OX, 640+OY, 32, -32, {opacity:.5});
 label('CATAMARCA · ARGENTINA', W/2, H-70, 28, 0, {opacity:.6});
 const townLabel = (txt, s, d) => { const i = Math.round(s.t*400); const [tx,ty] = tangentAt(i); const t = el('text',{x:s.x - ty*d, y:s.y + tx*d + 10, class:'town-label','text-anchor':'middle'},labels); t.textContent = txt; };
 townLabel('TINOGASTA', stops[0], 120); townLabel('EL PUESTO', stops[1], 130); townLabel('LA FALDA', stops[2], 130);
 { const a = stops[3], b = stops[4]; const t = el('text',{x:(a.x+b.x)/2 + 180, y:(a.y+b.y)/2 + 40, class:'town-label','text-anchor':'middle'},labels); t.textContent = 'ANILLACO'; }
 { const a = stops[6], b = stops[7]; const t = el('text',{x:(a.x+b.x)/2 + 40, y:(a.y+b.y)/2 + 150, class:'town-label','text-anchor':'middle'},labels); t.textContent = 'FIAMBALÁ'; }

 // cartela + rosa de los vientos
 const deco = $('layer-deco');
 const c = el('g',{transform:'translate(80 80) rotate(-1.5)'},deco);
 el('rect',{width:540,height:220,fill:'#fbf9f3',stroke:'#2f2c28','stroke-width':4},c);
 el('rect',{x:10,y:10,width:520,height:200,fill:'none',stroke:'#2f2c28','stroke-width':1.5},c);
 const t1 = el('text',{x:270,y:82,'text-anchor':'middle','font-size':56,'font-family':'Special Elite, monospace',fill:'#2f2c28','letter-spacing':6},c); t1.textContent = 'RUTA DEL ADOBE';
 const t2 = el('text',{x:270,y:122,'text-anchor':'middle','font-size':22,'font-family':'Special Elite, monospace',fill:'#5f574d'},c); t2.textContent = 'Departamento Tinogasta · Catamarca';
 el('path',{d:'M120 160h300',stroke:'#2f2c28','stroke-width':3},c);
 [120,195,270,345,420].forEach((x,k) => { el('path',{d:`M${x} 152v16`,stroke:'#2f2c28','stroke-width':3},c); if (k < 4 && k % 2 === 0) el('rect',{x,y:156,width:75,height:8,fill:'#2f2c28'},c); });
 const t3 = el('text',{x:270,y:196,'text-anchor':'middle','font-size':17,'font-family':'Special Elite, monospace',fill:'#5f574d'},c); t3.textContent = 'mapa ilustrado · no apto para navegación';
 const cr = el('g',{transform:`translate(${W-230} ${H-240})`},deco);
 el('circle',{r:118,fill:'#fbf9f3',stroke:'#2f2c28','stroke-width':3,opacity:.9},cr);
 el('circle',{r:100,fill:'none',stroke:'#2f2c28','stroke-width':1.5,'stroke-dasharray':'4 6'},cr);
 el('path',{d:'M0-96 16-16 96 0 16 16 0 96-16 16-96 0-16-16Z',fill:'#e6b3a1',stroke:'#2f2c28','stroke-width':3,'stroke-linejoin':'round'},cr);
 el('path',{d:'M0-96 16-16 0 0ZM96 0 16 16 0 0ZM0 96-16 16 0 0ZM-96 0-16-16 0 0Z',fill:'#2f2c28',opacity:.75},cr);
 const n = el('text',{y:-128,'text-anchor':'middle','font-size':34,'font-family':'Special Elite, monospace',fill:'#2f2c28'},cr); n.textContent = 'N';
}

/* ---------- Pines con foto (como en la presentación) ---------- */
const pins = [];
function buildPins(){
 const layer = $('layer-pins'), defs = $('defs');
 stops.forEach((s, i) => {
  const g = el('g',{class:'pin',transform:`translate(${s.x} ${s.y})`,role:'button',tabindex:'-1','aria-label':s.name},layer);
  if (i === 0){
   el('circle',{r:26,fill:'#b9d4bf',stroke:'#2f2c28','stroke-width':5},g);
   el('circle',{r:9,fill:'#2f2c28'},g);
   const lg = el('g',{class:'pin-label',transform:'translate(0 40)'},g);
   el('rect',{x:-62,y:0,width:124,height:36},lg);
   const t = el('text',{x:0,y:26,'text-anchor':'middle'},lg); t.textContent = 'SALIDA';
   pins.push(g); return;
  }
  el('circle',{class:'pin-ring',cx:0,cy:-82,r:52},g);
  const body = el('g',{class:'pin-body'},g);
  el('ellipse',{cx:6,cy:2,rx:18,ry:6,fill:'rgba(47,44,40,.25)'},body);
  el('path',{d:'M0 0C-12-22-48-42-48-82A48 48 0 1 1 48-82C48-42 12-22 0 0Z',fill:'#3a3631',stroke:'#1f1d1a','stroke-width':2},body);
  const cp = el('clipPath',{id:`pc${i}`},defs); el('circle',{cx:0,cy:-82,r:39},cp);
  el('image',{href:`assets/${s.image}.webp`,x:-39,y:-121,width:78,height:78,preserveAspectRatio:'xMidYMid slice','clip-path':`url(#pc${i})`},body);
  el('circle',{cx:0,cy:-82,r:39,fill:'none',stroke:'#fbf9f3','stroke-width':4},body);
  const nb = el('g',{transform:'translate(36 -122)'},body);
  el('circle',{r:17,fill:'#c8701e',stroke:'#2f2c28','stroke-width':3},nb);
  const nt = el('text',{y:7,'text-anchor':'middle','font-size':20,'font-family':'Special Elite, monospace',fill:'#fff'},nb); nt.textContent = i;
  const ck = el('g',{class:'pin-check',transform:'translate(-36 -122)'},body);
  el('circle',{r:17,fill:'#66753a',stroke:'#2f2c28','stroke-width':3},ck);
  el('path',{d:'M-7 0l5 5 9-10',fill:'none',stroke:'#fff','stroke-width':4,'stroke-linecap':'round','stroke-linejoin':'round'},ck);
  const w = s.short.length * 14 + 30;
  const lg = el('g',{class:'pin-label',transform:'translate(0 14) rotate(-2)'},g);
  el('rect',{x:-w/2,y:0,width:w,height:36},lg);
  const t = el('text',{x:0,y:26,'text-anchor':'middle'},lg); t.textContent = s.short.toUpperCase();
  pins.push(g);
 });
 pins.forEach((p, i) => p.addEventListener('click', () => { if (state !== 'play') return; if (arrived === i && i > 0) openPlace(i); else flyTo(i); }));
}

/* ---------- Adobes coleccionables ---------- */
const adobes = [];
function buildAdobes(){
 const layer = $('layer-adobes');
 let id = 0;
 for (let s = 0; s < LAST; s++) for (const f of [.27,.5,.73]){
  const t = lerp(stops[s].t, stops[s+1].t, f), p = route.getPointAtLength(t * total);
  const g = el('g',{class:'adobe',transform:`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`},layer);
  el('circle',{class:'halo',r:34,fill:'url(#glow)'},g);
  const b = el('g',{class:'brick'},g);
  el('rect',{x:-19,y:-12,width:38,height:24,rx:3,fill:'#c8701e',stroke:'#2f2c28','stroke-width':3.5},b);
  el('path',{d:'M-19 0h38M-6-12v12M7 0v12',stroke:'#2f2c28','stroke-width':2.5},b);
  const a = {id, t, g, x:p.x, y:p.y, got:gotAdobes.has(id)};
  if (a.got) g.classList.add('got');
  adobes.push(a); id++;
 }
 $('adobe-total').textContent = adobes.length;
}

/* ---------- Sellos de tinta ---------- */
function stampSVG(i, date){
 const s = stops[i], ink = INKS[i - 1], id = `sp${i}-${Math.random().toString(36).slice(2,7)}`;
 return `<svg class="stamp-svg" viewBox="-64 -64 128 128" role="img" aria-label="Sello ${s.name}"><g filter="url(#ink-rough)" fill="none" stroke="${ink}" color="${ink}">
 <circle r="60" stroke-width="4"/><circle r="53" stroke-width="1.5"/><circle r="33" stroke-width="1.5"/>
 <path id="${id}" d="M-43 0a43 43 0 1 1 86 0a43 43 0 1 1-86 0"/>
 <text font-family="Special Elite, monospace" font-size="11.5" fill="${ink}" stroke="none" letter-spacing="1"><textPath href="#${id}" textLength="262" lengthAdjust="spacingAndGlyphs">RUTA DEL ADOBE ✦ ${s.short.toUpperCase()} ✦ Nº 0${i} ✦</textPath></text>
 <g transform="translate(0 -4) scale(.95)" stroke-width="2.6" stroke-linejoin="round"><path d="${ICONS[s.icon]}"/></g>
 <text y="26" text-anchor="middle" font-family="Special Elite, monospace" font-size="8" fill="${ink}" stroke="none">${date || ''}</text></g></svg>`;
}
document.body.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="ink-rough"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.5 1.55" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter></svg>`);

/* ---------- Sonido (sintetizado, sin archivos) ---------- */
const audio = {
 ctx:null, master:null, wind:null, on:false, musicTimer:0, step:0,
 init(){
  if (this.ctx) return true;
  const A = window.AudioContext || window.webkitAudioContext; if (!A) return false;
  const c = this.ctx = new A(); this.master = c.createGain(); this.master.gain.value = 0; this.master.connect(c.destination);
  const buf = c.createBuffer(1, c.sampleRate * 3, c.sampleRate), d = buf.getChannelData(0); let b = 0;
  for (let i = 0; i < d.length; i++){ b = (b + (Math.random()*2-1)*.02) / 1.02; d[i] = b * 3.5; }
  const src = c.createBufferSource(); src.buffer = buf; src.loop = true;
  const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 700;
  this.wind = c.createGain(); this.wind.gain.value = .05; src.connect(f).connect(this.wind).connect(this.master); src.start();
  this.noiseBuf = buf; return true;
 },
 async set(on){
  if (on && !this.init()) { toast('El sonido no está disponible en este navegador.'); return; }
  this.on = on; if (!this.ctx) return;
  if (on) await this.ctx.resume();
  this.master.gain.setTargetAtTime(on ? .9 : 0, this.ctx.currentTime, .3);
  clearInterval(this.musicTimer); if (on) this.musicTimer = setInterval(() => this.music(), 520);
  $('sound').setAttribute('aria-pressed', String(on)); $('sound').setAttribute('aria-label', on ? 'Silenciar sonido' : 'Activar sonido');
 },
 tone(freq, dur, type = 'sine', vol = .06, when = 0, slide){
  if (!this.on) return; const c = this.ctx, t = c.currentTime + when, o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur); o.connect(g).connect(this.master); o.start(t); o.stop(t + dur + .05);
 },
 noise(dur, freq, vol, type = 'lowpass'){
  if (!this.on) return; const c = this.ctx, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime;
  s.buffer = this.noiseBuf; f.type = type; f.frequency.value = freq; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  s.connect(f).connect(g).connect(this.master); s.start(t, Math.random()*2); s.stop(t + dur + .05);
 },
 music(){
  if (!this.on || state !== 'play' || document.querySelector('dialog[open]')) return;
  const scale = [293.7, 349.2, 392, 440, 523.3, 587.3]; const pat = [0,2,4,2,3,1,5,4];
  this.step++; if (this.step % 8 === 0) this.tone(146.8, 3.6, 'triangle', .022);
  if (Math.random() < .55) this.tone(scale[pat[this.step % 8]] * (Math.random() < .2 ? 2 : 1), 1.1, 'triangle', .018);
 },
 blip(){ this.tone(880, .12, 'square', .03, 0, 1500); this.tone(1320, .18, 'triangle', .04, .07); },
 chime(){ [523,659,784,1046].forEach((f,i) => this.tone(f, .8, 'triangle', .045, i*.09)); },
 stamp(){ this.noise(.22, 380, .9); this.tone(95, .3, 'sine', .35, 0, 45); },
 wrong(){ this.tone(180, .25, 'sawtooth', .04, 0, 120); },
 key(){ this.noise(.03, 2400, .25, 'highpass'); },
 whoosh(){ this.noise(.7, 900, .25, 'bandpass'); },
 fanfare(){ [392,523,659,784,1046].forEach((f,i) => this.tone(f, i === 4 ? 1.6 : .3, 'square', .035, i*.13)); }
};

/* ---------- Estado del juego ---------- */
let state = 'loading';              // loading | title | intro | play
let vw = innerWidth, vh = innerHeight, mobile = vw <= 720;
let p = 0, target = 0, tween = null, prevP = 0;
let zoom = 1, baseZoom = 1, camX = 0, camY = 0;
let introCam = null;                // {x,y,z} cámara cinematográfica
let arrived = 0, film = false, filmTimer = 0, angle = 0, angleTarget = 0, dir = 1, lastTime = 0, idleTimer = 0, hintTimer = 0;
let pendingEnding = false, dialogIndex = 1;

function computeBase(){
 vw = innerWidth; vh = innerHeight; mobile = vw <= 720;
 const minZ = Math.max(vw / W, vh / H);
 baseZoom = Math.max(minZ * 1.05, mobile ? Math.max(vw / 820, vh / 1450) : Math.max(vw / 1750, vh / 1150));
}
function anchor(){ return mobile ? [vw * .5, vh * .34] : [vw * .6, vh * .47]; }

function flyTo(i, cb){
 i = clamp(i, 0, LAST);
 const to = stops[i].t, dist = Math.abs(to - p);
 if (dist < .0005 && !tween){ target = to; if (cb) cb(); return; }
 tween = {from:p, to, start:performance.now(), dur:reduceMotion ? 1 : clamp(dist * 15000, 700, 4800), cb};
 audio.whoosh();
}
function cancelTween(){ tween = null; }
function nextIndex(){ for (let i = 0; i <= LAST; i++) if (stops[i].t > target + .004) return i; return LAST; }
function prevIndex(){ for (let i = LAST; i >= 0; i--) if (stops[i].t < target - .004) return i; return 0; }

/* ---------- Nubes ---------- */
const clouds = [];
function buildClouds(){
 const box = $('clouds'); box.replaceChildren(); clouds.length = 0;
 const n = mobile ? 5 : 8, R = rng(42);
 for (let i = 0; i < n; i++){
  const w = (mobile ? 180 : 260) + R() * (mobile ? 160 : 300), d = document.createElement('div');
  d.className = 'cloud'; d.style.width = w + 'px'; d.style.height = w * .55 + 'px'; box.appendChild(d);
  clouds.push({el:d, w, bx:R() * (vw + w * 2), by:R() * (vh + w), par:1.25 + R() * .5, drift:6 + R() * 10});
 }
}

/* ---------- Bucle principal ---------- */
function frame(time){
 requestAnimationFrame(frame);
 const dt = Math.min(50, time - lastTime || 16); lastTime = time;

 if (tween){
  const k = clamp((time - tween.start) / tween.dur, 0, 1);
  target = lerp(tween.from, tween.to, ease(k));
  if (k >= 1){ const cb = tween.cb; tween = null; target = stops.find(s => Math.abs(s.t - target) < 1e-6)?.t ?? target; if (cb) setTimeout(cb, 0); }
 }
 prevP = p;
 p = reduceMotion ? target : p + (target - p) * (1 - Math.exp(-dt / (tween ? 45 : 120)));
 if (Math.abs(p - target) < 1e-5) p = target;

 const L = p * total, pos = route.getPointAtLength(L);
 const a = route.getPointAtLength(Math.max(0, L - 4)), b = route.getPointAtLength(Math.min(total, L + 4));
 if (Math.abs(target - p) > 1e-4) dir = target > p ? 1 : -1;
 angleTarget = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI + 90 + (dir < 0 ? 180 : 0);
 let da = ((angleTarget - angle + 540) % 360) - 180;
 angle += da * (1 - Math.exp(-dt / 140));

 // cercanía a una parada → zoom y altura
 let nearest = 0, dn = 1;
 for (let i = 0; i <= LAST; i++){ const d = Math.abs(stops[i].t - p); if (d < dn){ dn = d; nearest = i; } }
 const near = clamp(1 - dn / .055, 0, 1), nearE = near * near * (3 - 2 * near);

 // cámara
 let zt, cx, cy;
 const [ax, ay] = anchor();
 if (introCam){ zt = introCam.z; zoom = zt; cx = introCam.x; cy = introCam.y; camX = vw / 2 - cx * zoom; camY = vh / 2 - cy * zoom; }
 else {
  zt = baseZoom * (1 + .3 * nearE);
  zoom += (zt - zoom) * (1 - Math.exp(-dt / 380));
  camX = ax - pos.x * zoom; camY = ay - pos.y * zoom;
 }
 const mw = W * zoom, mh = H * zoom;
 camX = mw > vw ? clamp(camX, vw - mw, 0) : (vw - mw) / 2;
 camY = mh > vh ? clamp(camY, vh - mh, 0) : (vh - mh) / 2;
 $('camera').style.transform = `translate3d(${camX.toFixed(2)}px,${camY.toFixed(2)}px,0) scale(${zoom.toFixed(4)})`;

 // avión
 const sx = pos.x * zoom + camX, sy = pos.y * zoom + camY;
 const speed = Math.abs(p - prevP) / dt * 1000;
 const alt = state === 'play' || state === 'intro' ? 1 + .32 * (1 - nearE) + Math.min(.15, speed * 2) : 1.1;
 const bank = clamp(da / 40, -1, 1);
 const bob = reduceMotion ? 0 : Math.sin(time / 420) * 3;
 $('plane-wrap').style.transform = `translate3d(${sx.toFixed(1)}px,${(sy + bob).toFixed(1)}px,0)`;
 $('plane').style.transform = `rotate(${angle.toFixed(1)}deg) scale(${(alt * (1 - Math.abs(bank) * .22)).toFixed(3)},${alt.toFixed(3)})`;
 const so = 14 + 46 * (alt - 1);
 $('plane-shadow').style.transform = `translate(${so}px,${so * 1.2}px) rotate(${angle.toFixed(1)}deg) scale(${(alt * .82).toFixed(3)})`;
 $('plane-wrap').style.opacity = state === 'title' ? 0 : 1;

 // estela + HUD
 $('route-done').style.strokeDashoffset = (total * (1 - p)).toFixed(1);
 if (state === 'play'){
  $('itin-fill').style.width = p * 100 + '%';
  $('itin-plane').style.left = p * 100 + '%';
  $('km').textContent = String(Math.round(p * 55)).padStart(2, '0');
  // adobes
  for (const ad of adobes) if (!ad.got && ((prevP < ad.t && p >= ad.t) || (prevP > ad.t && p <= ad.t))) collectAdobe(ad, sx, sy);
  // llegada
  const isArrived = dn < .006 && Math.abs(target - p) < .003 && !tween;
  const now = isArrived ? nearest : -1;
  if (now !== arrived) setArrived(now);
  if (now < 0){
   let ns = stops[0];
   if (dir > 0) ns = stops.find(s => s.t > p + .001) || stops[LAST];
   else for (const s of stops) if (s.t < p - .001) ns = s;
   $('flying-name').textContent = ns.name;
   $('flying-km').textContent = Math.max(1, Math.round(Math.abs(ns.t - p) * 55)) + ' km';
  }
  if (audio.on && audio.wind) audio.wind.gain.setTargetAtTime(.035 + Math.min(.16, speed * 1.4), audio.ctx.currentTime, .2);
 }

 // nubes (parallax por encima del mapa)
 const cloudOp = (state === 'play' ? 1 - nearE * .75 : 1).toFixed(2);
 $('clouds').style.opacity = cloudOp;
 for (const c of clouds){
  const span = vw + c.w * 2, spanY = vh + c.w;
  const x = ((c.bx + camX * c.par + time / 1000 * c.drift) % span + span) % span - c.w;
  const y = ((c.by + camY * c.par) % spanY + spanY) % spanY - c.w * .5;
  c.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
 }
}

/* ---------- Llegadas y tarjeta ---------- */
function setArrived(i){
 arrived = i;
 pins.forEach((pin, k) => pin.classList.toggle('active', k === i));
 document.querySelectorAll('.itin-stop').forEach((b, k) => { b.classList.toggle('active', k === i); b.setAttribute('aria-current', k === i ? 'step' : 'false'); });
 $('flying-tag').classList.toggle('show', i < 0);
 $('previous').disabled = target <= .001;
 $('next').disabled = target >= .999;
 if (i < 0){ $('stop-card').classList.remove('show'); return; }
 const s = stops[i];
 $('card-photo').src = `assets/${s.image}.webp`;
 $('card-photo').alt = i ? s.name : 'Ilustración del valle de Abaucán';
 $('card-caption').textContent = i ? s.short.toUpperCase() : s.caption;
 $('card-tag').textContent = i ? `PARADA ${String(i).padStart(2,'0')} / 07` : s.tag;
 $('card-place').textContent = i ? `${s.town}, Catamarca` : s.town;
 $('card-title').textContent = i ? s.name : s.title;
 $('card-text').textContent = s.desc;
 $('card-stamp').hidden = !stamped(i);
 $('visit').innerHTML = i === 0 ? 'Despegar <span aria-hidden="true">→</span>' : stamped(i) ? 'Volver a explorar <span aria-hidden="true">✦</span>' : 'Explorar y ganar el sello <span aria-hidden="true">✦</span>';
 const card = $('stop-card'); card.classList.remove('show'); void card.offsetWidth; card.classList.add('show');
 if (i > 0) audio.chime();
}

function collectAdobe(ad, sx, sy){
 ad.got = true; gotAdobes.add(ad.id); ad.g.classList.add('got'); store.write();
 $('adobe-count').textContent = gotAdobes.size;
 const st = $('adobe-count').closest('.stat'); st.classList.remove('bump'); void st.offsetWidth; st.classList.add('bump');
 floatText('+1 adobe', sx, sy - 50);
 audio.blip();
 if (gotAdobes.size === adobes.length) setTimeout(() => toast('¡Juntaste todos los adobes del valle! 🧱'), 600);
}
function floatText(txt, x, y){
 const f = document.createElement('div'); f.className = 'float'; f.textContent = txt; f.style.left = x + 'px'; f.style.top = y + 'px';
 $('float-layer').appendChild(f); setTimeout(() => f.remove(), 1200);
}

/* ---------- Modo película ---------- */
function setFilm(on){
 film = on; document.body.classList.toggle('film', on);
 clearTimeout(filmTimer);
 $('play').setAttribute('aria-pressed', String(on));
 $('play').setAttribute('aria-label', on ? 'Pausar modo película' : 'Modo película: vuelo automático');
 const bar = $('film-bar'); bar.style.transition = 'none'; bar.style.width = '0';
 if (on){ if (target >= .999){ p = target = 0; } filmStep(); }
}
function filmStep(){
 if (!film) return;
 const i = nextIndex();
 if (target >= .999){ setFilm(false); if (stampCount() < 7) toast(`Llegaste a Fiambalá. Te faltan ${7 - stampCount()} sellos: entrá a las paradas para ganarlos.`); return; }
 flyTo(i, () => {
  if (!film) return;
  const bar = $('film-bar'); bar.style.transition = 'none'; bar.style.width = '0'; void bar.offsetWidth;
  bar.style.transition = 'width 4.2s linear'; bar.style.width = '100%';
  filmTimer = setTimeout(filmStep, 4300);
 });
}

/* ---------- Página de parada ---------- */
function openPlace(i){
 if (i < 1 || i > LAST) return;
 setFilm(false);
 dialogIndex = i; const s = stops[i];
 $('place-image').src = `assets/${s.image}.webp`; $('place-image').alt = s.name;
 $('place-caption').textContent = s.short.toUpperCase();
 $('place-label').textContent = `PARADA ${String(i).padStart(2,'0')} / 07 · ${s.town.toUpperCase()}`;
 $('place-title').textContent = s.name;
 $('place-loc').textContent = s.loc;
 $('place-story').textContent = s.story;
 $('place-detail').textContent = s.detail;
 $('place-tip').textContent = s.tip;
 $('hotspot-note').textContent = s.detail; $('hotspot-note').hidden = true; $('hotspot').setAttribute('aria-expanded','false');
 $('place-map').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.query)}`;
 $('continue').textContent = i < LAST ? `Seguir volando a ${stops[i+1].short} →` : 'Terminar la expedición →';
 renderQuiz(i);
 renderStampZone(i, false);
 openDialog('place-dialog');
}
function renderQuiz(i){
 const q = stops[i].quiz, box = $('quiz-options'), done = stamped(i);
 $('quiz-q').textContent = q.q; box.replaceChildren();
 $('quiz').classList.toggle('done', done);
 $('quiz-state').textContent = done ? '✓ Sello conseguido' : 'Respondé para ganar el sello';
 $('quiz-feedback').textContent = done ? q.ok : '';
 q.o.forEach((txt, k) => {
  const b = document.createElement('button'); b.type = 'button'; b.textContent = txt;
  if (done){ b.disabled = true; if (k === q.a) b.classList.add('right'); }
  b.addEventListener('click', () => answer(i, k, b));
  box.appendChild(b);
 });
}
function answer(i, k, btn){
 const q = stops[i].quiz;
 if (k !== q.a){ btn.classList.add('wrong'); btn.disabled = true; $('quiz-feedback').textContent = 'Casi… Releé la historia del lugar y probá otra vez.'; audio.wrong(); return; }
 btn.classList.add('right');
 $('quiz-options').querySelectorAll('button').forEach(b => b.disabled = true);
 $('quiz-feedback').textContent = q.ok; $('quiz').classList.add('done'); $('quiz-state').textContent = '✓ Sello conseguido';
 save.stamps[i] = new Date().toLocaleDateString('es-AR', {day:'2-digit', month:'2-digit', year:'numeric'}).replace(/\//g, '·');
 store.write();
 renderStampZone(i, true);
 setTimeout(() => { const d = $('place-dialog'); d.classList.remove('shake'); void d.offsetWidth; d.classList.add('shake'); audio.stamp(); }, 300);
 updateProgressUI();
 const pb = $('passport-open'); pb.classList.remove('bump'); void pb.offsetWidth; pb.classList.add('bump');
 if (stampCount() === 7) pendingEnding = true;
}
function renderStampZone(i, slam){
 const z = $('stamp-zone');
 if (stamped(i)){ z.innerHTML = stampSVG(i, save.stamps[i]); const svg = z.firstElementChild; svg.style.transform = 'rotate(-8deg)'; if (slam) svg.classList.add('slam'); }
 else z.innerHTML = '<div class="stamp-empty">Tu sello te espera.<br>Superá el desafío ★</div>';
}

/* ---------- Pasaporte ---------- */
function rank(n){ return n >= 7 ? 'Leyenda del adobe' : n >= 5 ? 'Guía en formación' : n >= 3 ? 'Caminante' : 'Turista'; }
function updateProgressUI(){
 const n = stampCount();
 $('stamp-count').textContent = `${n}/7`;
 $('adobe-count').textContent = gotAdobes.size;
 pins.forEach((pin, i) => pin.classList.toggle('stamped', stamped(i)));
 document.querySelectorAll('.itin-stop').forEach((b, i) => b.classList.toggle('stamped', stamped(i)));
 if (arrived > 0){ $('card-stamp').hidden = !stamped(arrived); }
}
function renderPassport(){
 const n = stampCount();
 $('pp-stamps').textContent = n; $('pp-adobes').textContent = gotAdobes.size; $('pp-rank').textContent = rank(n);
 $('pp-adobes').nextElementSibling.textContent = `de ${adobes.length} adobes`;
 const grid = $('stamp-grid'); grid.replaceChildren();
 for (let i = 1; i <= LAST; i++){
  const b = document.createElement('button'); b.type = 'button';
  if (stamped(i)){ b.className = 'stamp-slot'; b.innerHTML = stampSVG(i, save.stamps[i]); b.firstElementChild.style.transform = `rotate(${(i * 37 % 24) - 12}deg)`; b.setAttribute('aria-label', `${stops[i].name}: sello conseguido. Volar hasta allí`); }
  else { b.className = 'stamp-slot empty'; b.innerHTML = `<span><b>${i}</b>${stops[i].short}</span>`; b.setAttribute('aria-label', `${stops[i].name}: sin sello. Volar hasta allí`); }
  b.addEventListener('click', () => { closeAll(); flyTo(i); });
  grid.appendChild(b);
 }
 $('passport-status').textContent = n === 7 ? '¡Expedición completa! Te llevás siete historias del valle.' : `${n} de 7 sellos. ${n ? 'El camino continúa…' : 'Tu aventura recién empieza.'}`;
}

/* ---------- Diálogos ---------- */
function openDialog(id){ setFilm(false); const d = $(id); if (!d.open) d.showModal(); }
function closeAll(){ document.querySelectorAll('dialog[open]').forEach(d => d.close()); }
document.querySelectorAll('dialog').forEach(d => {
 d.querySelector('[data-close]').addEventListener('click', () => d.close());
 d.addEventListener('click', e => { if (e.target !== d) return; const r = d.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close(); });
 d.addEventListener('close', () => { if (pendingEnding && !document.querySelector('dialog[open]')){ pendingEnding = false; setTimeout(showEnding, 350); } });
});

function showEnding(){
 const box = $('ending-stamps'); box.innerHTML = '';
 for (let i = 1; i <= LAST; i++){ box.insertAdjacentHTML('beforeend', stampSVG(i, save.stamps[i])); const s = box.lastElementChild; s.style.transform = `rotate(${(i * 37 % 24) - 12}deg)`; s.classList.add('slam'); s.style.animationDelay = (i * .18) + 's'; }
 $('ending-stats').textContent = `7/7 sellos · ${gotAdobes.size}/${adobes.length} adobes · rango: ${rank(7)}`;
 $('ending').hidden = false; audio.fanfare();
 for (let i = 1; i <= LAST; i++) setTimeout(() => audio.stamp(), 300 + i * 180);
}

/* ---------- Entrada: rueda, arrastre, teclado ---------- */
const game = $('game');
function userMoved(){ setFilm(false); cancelTween(); clearTimeout(idleTimer); idleTimer = setTimeout(snap, 420); if (target > .015) hideHint(); }
function snap(){ let best = -1, bd = .035; stops.forEach((s, i) => { const d = Math.abs(s.t - target); if (d < bd){ bd = d; best = i; } }); if (best >= 0) { tween = {from:p, to:stops[best].t, start:performance.now(), dur:reduceMotion ? 1 : 520}; } }
function canPlay(){ return state === 'play' && !document.querySelector('dialog[open]') && $('ending').hidden; }
addEventListener('wheel', e => {
 if (!canPlay()) return;
 e.preventDefault();
 const unit = e.deltaMode === 1 ? 30 : e.deltaMode === 2 ? vh : 1;
 target = clamp(target + (e.deltaY + e.deltaX) * unit * .00028, 0, 1); userMoved();
}, {passive:false});
let drag = null;
game.addEventListener('pointerdown', e => { if (!canPlay() || e.target.closest('button,a,.stop-card,.hud')) return; drag = {x:e.clientX, y:e.clientY, id:e.pointerId}; game.setPointerCapture(e.pointerId); });
game.addEventListener('pointermove', e => {
 if (!drag || e.pointerId !== drag.id) return;
 const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY;
 const d = Math.abs(dx) > Math.abs(dy) ? -dx : -dy;
 target = clamp(target + d * (mobile ? .0016 : .0009), 0, 1); userMoved();
});
const endDrag = e => { if (drag && e.pointerId === drag.id) drag = null; };
game.addEventListener('pointerup', endDrag); game.addEventListener('pointercancel', endDrag);

addEventListener('keydown', e => {
 if (state === 'title' && e.key === 'Enter' && document.activeElement?.tagName !== 'BUTTON'){ e.preventDefault(); startGame(true); return; }
 if (state === 'intro' && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); skipIntro(); return; }
 if (!canPlay() || ['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) return;
 const k = e.key;
 if (['ArrowRight','ArrowDown','PageDown','d','D','s','S'].includes(k)){ e.preventDefault(); setFilm(false); flyTo(nextIndex()); hideHint(); }
 else if (['ArrowLeft','ArrowUp','PageUp','a','A','w','W'].includes(k)){ e.preventDefault(); setFilm(false); flyTo(prevIndex()); }
 else if (k === ' ' && document.activeElement?.tagName !== 'BUTTON'){ e.preventDefault(); setFilm(!film); hideHint(); }
 else if (k === 'Home'){ e.preventDefault(); flyTo(0); }
 else if (k === 'End'){ e.preventDefault(); flyTo(LAST); }
 else if (k === 'Enter' && arrived >= 0 && document.activeElement === document.body){ e.preventDefault(); $('visit').click(); }
});

/* ---------- Botones ---------- */
$('visit').addEventListener('click', () => { if (arrived === 0) flyTo(1); else if (arrived > 0) openPlace(arrived); });
$('next').addEventListener('click', () => { setFilm(false); flyTo(nextIndex()); hideHint(); });
$('previous').addEventListener('click', () => { setFilm(false); flyTo(prevIndex()); });
$('play').addEventListener('click', () => { setFilm(!film); hideHint(); });
$('home').addEventListener('click', () => { setFilm(false); flyTo(0); });
$('continue').addEventListener('click', () => {
 const i = dialogIndex; $('place-dialog').close();
 if (pendingEnding) return; // el cierre dispara el final
 if (i < LAST) flyTo(i + 1);
 else if (stampCount() < 7){ toast(`Te faltan ${7 - stampCount()} sellos. Volvé a las paradas sin sellar.`); renderPassport(); openDialog('passport-dialog'); }
});
$('hotspot').addEventListener('click', () => { const show = $('hotspot-note').hidden; $('hotspot-note').hidden = !show; $('hotspot').setAttribute('aria-expanded', String(show)); });
$('passport-open').addEventListener('click', () => { renderPassport(); openDialog('passport-dialog'); });
$('passport-guide').addEventListener('click', () => { $('passport-dialog').close(); openDialog('guide-dialog'); });
$('menu-guide').addEventListener('click', () => openDialog('guide-dialog'));
$('guide-open').addEventListener('click', () => openDialog('guide-dialog'));
$('about-open').addEventListener('click', () => openDialog('about-dialog'));
$('print').addEventListener('click', () => print());
$('sound').addEventListener('click', () => audio.set(!audio.on));
$('ending-guide').addEventListener('click', () => { $('ending').hidden = true; openDialog('guide-dialog'); });
$('ending-replay').addEventListener('click', () => { $('ending').hidden = true; p = target = 0; flyTo(0); });
let resetArmed = false, resetTimer = 0;
$('reset').addEventListener('click', () => {
 if (!resetArmed){ resetArmed = true; $('reset').textContent = '¿Seguro? Tocá de nuevo para borrar sellos y adobes'; resetTimer = setTimeout(() => { resetArmed = false; $('reset').textContent = 'Reiniciar expedición'; }, 3500); return; }
 clearTimeout(resetTimer); resetArmed = false; $('reset').textContent = 'Reiniciar expedición';
 save.stamps = {}; gotAdobes.clear(); adobes.forEach(a => { a.got = false; a.g.classList.remove('got'); }); store.write();
 updateProgressUI(); closeAll(); p = target = 0; setArrived(-1); toast('Expedición reiniciada. ¡Buen viaje!');
});
document.querySelectorAll('[data-plan]').forEach(b => b.addEventListener('click', () => selectPlan(b.dataset.plan)));
function selectPlan(k){ $('plan-text').textContent = plans[k]; document.querySelectorAll('[data-plan]').forEach(b => { const on = b.dataset.plan === k; b.classList.toggle('selected', on); b.setAttribute('aria-pressed', String(on)); }); }
selectPlan('day');
document.querySelectorAll('#checklist input').forEach((inp, i) => {
 inp.checked = Array.isArray(save.checks) && save.checks.includes(i);
 inp.addEventListener('change', () => { save.checks = [...document.querySelectorAll('#checklist input')].flatMap((x, j) => x.checked ? [j] : []); store.write(); });
});

let toastTimer = 0;
function toast(msg){ clearTimeout(toastTimer); const t = $('toast'); t.textContent = msg; t.classList.add('show'); toastTimer = setTimeout(() => t.classList.remove('show'), 3600); }
if (matchMedia('(pointer: coarse)').matches) $('hint').innerHTML = '<b>Deslizá</b> para volar · tocá ▶ para el modo película';
function hideHint(){ $('hint').classList.add('gone'); }

/* ---------- Itinerario inferior ---------- */
function buildItinerary(){
 const box = $('itin-stops');
 stops.forEach((s, i) => {
  const b = document.createElement('button'); b.className = 'itin-stop'; b.style.left = s.t * 100 + '%';
  b.setAttribute('aria-label', `Volar a ${s.name}`); b.title = s.name;
  const l = document.createElement('span'); l.textContent = s.short; b.appendChild(l);
  b.addEventListener('click', () => { setFilm(false); flyTo(i); hideHint(); });
  box.appendChild(b);
 });
}

/* ---------- Intro cinematográfica ---------- */
let introRun = 0;
const wait = (ms, run) => new Promise(res => setTimeout(() => res(run === introRun), ms));
async function typeCaption(text, run){
 const c = $('caption'); c.classList.add('show'); c.innerHTML = '<span></span><i class="cursor"></i>';
 const span = c.firstChild;
 for (const ch of text){ if (run !== introRun) return false; span.textContent += ch; if (ch !== ' ') audio.key(); await wait(reduceMotion ? 0 : 38, run); }
 return run === introRun;
}
function camTween(to, dur, run){
 return new Promise(res => {
  const from = {...introCam}, start = performance.now();
  const step = now => {
   if (run !== introRun) return res(false);
   const k = clamp((now - start) / dur, 0, 1), e = ease(k);
   introCam = {x:lerp(from.x, to.x, e), y:lerp(from.y, to.y, e), z:lerp(from.z, to.z, e)};
   if (k < 1) requestAnimationFrame(step); else res(true);
  };
  requestAnimationFrame(step);
 });
}
function playCam(){ const [ax, ay] = anchor(); const z = baseZoom * 1.3; let cx = stops[0].x * z, cy = stops[0].y * z; let tx = clamp(ax - cx, vw - W*z, 0), ty = clamp(ay - cy, vh - H*z, 0); return {x:(vw/2 - tx) / z, y:(vh/2 - ty) / z, z}; }
async function runIntro(){
 const run = ++introRun;
 state = 'intro'; document.body.className = 'state-intro'; $('skip').hidden = false;
 p = target = 0;
 const overview = Math.max(vw / W, vh / H) * 1.02;
 introCam = {x:W/2, y:H/2, z:overview};
 if (!(await wait(700, run))) return;
 camTween({x:W/2 - 100, y:H/2 + 60, z:overview * 1.12}, 5200, run);
 if (!(await typeCaption('Departamento Tinogasta. Catamarca, Argentina.', run))) return;
 if (!(await wait(1300, run))) return;
 camTween({x:(stops[0].x + stops[LAST].x)/2, y:(stops[0].y + stops[LAST].y)/2, z:overview * 1.25}, 4200, run);
 if (!(await typeCaption('Siete lugares de adobe. Cincuenta y cinco kilómetros de historia.', run))) return;
 if (!(await wait(1300, run))) return;
 if (!(await typeCaption('Tu misión: visitar cada parada y ganar sus sellos.', run))) return;
 if (!(await wait(700, run))) return;
 audio.whoosh();
 if (!(await camTween(playCam(), 2600, run))) return;
 enterPlay();
}
function skipIntro(){ introRun++; enterPlay(); }
function enterPlay(){
 const pc = playCam(); zoom = pc.z; introCam = null;
 $('caption').classList.remove('show'); $('skip').hidden = true;
 state = 'play'; document.body.className = 'state-play';
 arrived = -2; setArrived(nearestStopIndex());
 clearTimeout(hintTimer); hintTimer = setTimeout(hideHint, 9000);
}
function nearestStopIndex(){ let b = 0; stops.forEach((s, i) => { if (Math.abs(s.t - target) < Math.abs(stops[b].t - target)) b = i; }); return Math.abs(stops[b].t - target) < .006 ? b : -1; }

/* ---------- Pantalla de título ---------- */
function startGame(withIntro){
 if (state !== 'title') return;
 if ($('start-sound').checked) audio.set(true);
 if (withIntro && !reduceMotion) runIntro(); else { p = target = 0; introCam = null; enterPlay(); }
}
$('start').addEventListener('click', () => startGame(true));
$('continue-game').addEventListener('click', () => startGame(false));
$('skip').addEventListener('click', skipIntro);

let titleDrift = 0;
function titleCamLoop(){
 if (state !== 'title') return;
 titleDrift += .0016;
 const z = Math.max(vw / W, vh / H) * 1.35;
 introCam = {x:W/2 + Math.sin(titleDrift) * 380, y:H/2 + Math.cos(titleDrift * .8) * 200, z};
 requestAnimationFrame(titleCamLoop);
}

/* ---------- Carga ---------- */
async function boot(){
 const imgs = ['world','orquera','andacollo','mayorazgo','rosario','watungasta','san-pedro','comandancia'];
 let done = 0;
 const bump = () => { done++; $('loader-bar').style.width = (done / (imgs.length + 1)) * 100 + '%'; };
 await Promise.all([
  ...imgs.map(n => new Promise(r => { const im = new Image(); im.onload = im.onerror = () => { bump(); r(); }; im.src = `assets/${n}.webp`; })),
  Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise(r => setTimeout(r, 2500))]).then(bump)
 ]);
 computeBase();
 buildMap(); buildPins(); buildAdobes(); buildItinerary(); buildClouds(); updateProgressUI();
 const n = stampCount();
 if (n || gotAdobes.size){ $('continue-game').hidden = false; $('continue-game').textContent = `Continuar · ${n}/7 sellos`; }
 state = 'title'; document.body.className = 'state-title';
 titleCamLoop();
 requestAnimationFrame(frame);
}
addEventListener('resize', () => { const wasMobile = mobile; computeBase(); zoom = clamp(zoom, baseZoom * .5, baseZoom * 2); if (wasMobile !== mobile) buildClouds(); });
document.addEventListener('visibilitychange', () => { if (document.hidden){ setFilm(false); audio.ctx?.suspend(); } else if (audio.on) audio.ctx?.resume(); });

/* WebMCP: misma acción que los controles visibles */
if (document.modelContext?.registerTool){ try { Promise.resolve(document.modelContext.registerTool({name:'explore_adobe_stop', title:'Explorar una parada', description:'Vuela a una parada de la Ruta del Adobe (1–7) y abre su página; no responde el desafío.', inputSchema:{type:'object', properties:{stop:{type:'integer', minimum:1, maximum:7}}, required:['stop'], additionalProperties:false}, execute(input){ if (!input || !Number.isInteger(input.stop) || input.stop < 1 || input.stop > 7) throw new Error('La parada debe ser un entero entre 1 y 7.'); if (state !== 'play') skipIntro(); closeAll(); flyTo(input.stop, () => openPlace(input.stop)); return {stop:input.stop, name:stops[input.stop].name}; }})).catch(() => {}); } catch {} }

boot();
