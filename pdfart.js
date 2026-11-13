/* Moi Tracker - PDF artwork: function-specific borders + cover illustrations (pure inline SVG, no external files) */
(function(){
const R=n=>Math.round(n*100)/100;
const GR='#2f7d4f',GR2='#4f9d63',SK='#f0c39b',SK2='#dca473',HAIR='#2a1a14';

/* ---------- small flower / leaf primitives ---------- */
const leaf=(x,y,s,a,c)=>`<path d="M0 0Q${R(s*.5)} ${R(-s*.42)} ${s} 0Q${R(s*.5)} ${R(s*.42)} 0 0Z" fill="${c||GR}" transform="translate(${x} ${y}) rotate(${a})"/>`;
function rose(x,y,r,c,d){
  return `<g transform="translate(${x} ${y})"><circle r="${r}" fill="${d}"/>`+
  [0,72,144,216,288].map(a=>`<circle cx="0" cy="${R(-r*.52)}" r="${R(r*.5)}" fill="${c}" stroke="${d}" stroke-width="${R(r*.07)}" transform="rotate(${a})"/>`).join('')+
  `<circle r="${R(r*.46)}" fill="${c}" stroke="${d}" stroke-width="${R(r*.07)}"/><path d="M${R(-r*.2)} ${R(-r*.05)}a${R(r*.24)} ${R(r*.24)} 0 1 1 ${R(r*.3)} ${R(r*.2)}" fill="none" stroke="${d}" stroke-width="${R(r*.09)}" stroke-linecap="round"/></g>`;
}
function marigold(x,y,r,c1,c2){
  c1=c1||'#fbaa1a';c2=c2||'#d9650b';
  let s=`<g transform="translate(${x} ${y})"><circle r="${r}" fill="${c2}"/>`;
  for(let i=0;i<14;i++)s+=`<ellipse cx="0" cy="${R(-r*.6)}" rx="${R(r*.27)}" ry="${R(r*.42)}" fill="${c1}" stroke="${c2}" stroke-width="${R(r*.05)}" transform="rotate(${i*360/14})"/>`;
  for(let i=0;i<9;i++)s+=`<ellipse cx="0" cy="${R(-r*.32)}" rx="${R(r*.19)}" ry="${R(r*.28)}" fill="#ffd25a" transform="rotate(${i*40+10})"/>`;
  return s+`<circle r="${R(r*.17)}" fill="${c2}"/></g>`;
}
function lily(x,y,r){
  let s=`<g transform="translate(${x} ${y})">`;
  for(let i=0;i<6;i++)s+=`<path d="M0 0Q${R(r*.55)} ${R(-r*.45)} 0 ${-r}Q${R(-r*.55)} ${R(-r*.45)} 0 0Z" fill="#fff" stroke="#c9a227" stroke-width="${R(r*.06)}" transform="rotate(${i*60})"/><path d="M0 ${R(-r*.1)}V${R(-r*.7)}" stroke="#e9dca8" stroke-width="${R(r*.05)}" transform="rotate(${i*60})"/>`;
  for(let i=0;i<5;i++)s+=`<circle cx="0" cy="${R(-r*.28)}" r="${R(r*.07)}" fill="#c9a227" transform="rotate(${i*72})"/>`;
  return s+'</g>';
}
function lotus(x,y,r,c1,c2){
  c1=c1||'#f48fb1';c2=c2||'#c2185b';
  const p=(a,k,f)=>`<path d="M0 0Q${R(r*.55*k)} ${R(-r*.5*k)} 0 ${R(-r*k)}Q${R(-r*.55*k)} ${R(-r*.5*k)} 0 0Z" fill="${f}" stroke="${c2}" stroke-width="${R(r*.05)}" transform="rotate(${a})"/>`;
  return `<g transform="translate(${x} ${y})">`+p(-62,.9,'#f8bbd0')+p(62,.9,'#f8bbd0')+p(-32,1,c1)+p(32,1,c1)+p(0,1.05,'#fce4ec')+`<circle cy="${R(-r*.1)}" r="${R(r*.12)}" fill="#f9c74f"/></g>`;
}
function jasmine(x,y,r){let s=`<g transform="translate(${x} ${y})">`;for(let i=0;i<5;i++)s+=`<ellipse cx="0" cy="${R(-r*.55)}" rx="${R(r*.32)}" ry="${R(r*.55)}" fill="#fff" stroke="#e5dcc3" stroke-width="${R(r*.07)}" transform="rotate(${i*72})"/>`;return s+`<circle r="${R(r*.18)}" fill="#f2c94c"/></g>`}
const star5=(x,y,r,f)=>{let p='';for(let i=0;i<10;i++){const a=Math.PI/5*i-Math.PI/2,rr=i%2?r*.42:r;p+=(i?'L':'M')+R(x+Math.cos(a)*rr)+' '+R(y+Math.sin(a)*rr)}return `<path d="${p}Z" fill="${f}"/>`};
const heart=(x,y,s,f)=>`<path d="M0 ${R(s*.35)}C${R(-s*.9)} ${R(-s*.3)} ${R(-s*.45)} ${R(-s*.8)} 0 ${R(-s*.35)}C${R(s*.45)} ${R(-s*.8)} ${R(s*.9)} ${R(-s*.3)} 0 ${R(s*.35)}Z" fill="${f}" transform="translate(${x} ${y})"/>`;
const star8=(x,y,r,f,st,sw)=>`<g transform="translate(${x} ${y})" fill="${f}" stroke="${st}" stroke-width="${sw||.5}"><rect x="${-r}" y="${-r}" width="${2*r}" height="${2*r}"/><rect x="${-r}" y="${-r}" width="${2*r}" height="${2*r}" transform="rotate(45)"/></g>`;
const BAL=['#ef4444','#f59e0b','#3b82f6','#22c55e','#a855f7','#ec4899'];
function balloon(x,y,r,c){return `<path d="M${x} ${R(y+r*1.25)}q${R(r*.35)} ${R(r*.9)} ${R(-r*.2)} ${R(r*1.9)}" fill="none" stroke="#9ca3af" stroke-width=".35"/><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${R(r*1.2)}" fill="${c}"/><path d="M${R(x-r*.3)} ${R(y+r*1.2)}l${R(r*.3)} ${R(r*.35)}l${R(r*.3)} ${R(-r*.35)}z" fill="${c}"/><ellipse cx="${R(x-r*.38)}" cy="${R(y-r*.45)}" rx="${R(r*.2)}" ry="${R(r*.35)}" fill="#fff" opacity=".45" transform="rotate(25 ${R(x-r*.38)} ${R(y-r*.45)})"/>`}

/* ---------- border style per function ---------- */
const STYLE={h_wed:'rose',c_wed:'rose',g_engage:'rose',g_recept:'rose',g_anniv:'rose',h_mani:'marigold',h_valai:'rose',
  h_manjal:'lotus',h_kadhu:'lotus',h_peyar:'lotus',h_kumba:'marigold',g_house:'marigold',
  c_bapt:'lily',c_comm:'lily',c_house:'lily',m_nikah:'arabesque',m_walima:'arabesque',m_aqiqa:'arabesque',m_sunnath:'arabesque',m_house:'arabesque',
  g_bday:'balloon',g_shop:'star'};
function styleOf(f,grp){
  if(STYLE[f.type])return STYLE[f.type];
  if(f.type==='marriage')return 'rose';
  if(f.type==='custom'||!f.type){ if(f.couple)return 'rose'; }
  return {gHindu:'marigold',gChr:'lily',gMus:'arabesque',gGen:'star'}[grp]||'marigold';
}

function cluster(st,TH){
  const G=TH.g,M=TH.m;
  const L=[leaf(5,5,26,45),leaf(5,5,21,18),leaf(5,5,21,72),leaf(9,9,16,0,GR2),leaf(9,9,16,90,GR2),leaf(14,14,30,45,GR2)].join('');
  const dots=(a)=>a.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${G}"/>`).join('');
  if(st==='rose')return L+rose(14,14,6.6,'#e11d48','#9f1239')+rose(27,8.6,4.4,'#fb7185','#be123c')+rose(8.6,27,4.4,'#fb7185','#be123c')+rose(32,18,3,'#f9a8d4','#be185d')+rose(18,32,3,'#f9a8d4','#be185d')+dots([[38,9,1.1],[9,38,1.1],[36,26,.9],[26,36,.9]]);
  if(st==='marigold')return L+marigold(14,14,6.8)+marigold(27,8.6,4.5,'#ffc83d','#e07a10')+marigold(8.6,27,4.5,'#ffc83d','#e07a10')+marigold(32,18,3,'#fb923c','#c2410c')+marigold(18,32,3,'#fb923c','#c2410c')+dots([[38,9,1.1],[9,38,1.1]]);
  if(st==='lotus')return L+lotus(15,16,8.5)+lotus(28,9.5,5)+lotus(9.5,28,5)+dots([[36,16,1],[16,36,1],[38,9,1.1],[9,38,1.1]]);
  if(st==='lily')return [leaf(5,5,28,45,'#5b8f4a'),leaf(5,5,22,20,'#6fa35a'),leaf(5,5,22,70,'#6fa35a'),leaf(10,10,18,0,'#5b8f4a'),leaf(10,10,18,90,'#5b8f4a')].join('')+lily(14,14,8)+lily(28,9,4.8)+lily(9,28,4.8)+`<circle cx="34" cy="20" r="1.5" fill="${G}"/><circle cx="20" cy="34" r="1.5" fill="${G}"/><circle cx="38" cy="10" r="1.1" fill="${G}"/><circle cx="10" cy="38" r="1.1" fill="${G}"/>`;
  if(st==='arabesque')return `<path d="M2 2H36M2 2V36" stroke="${G}" stroke-width="1.2" fill="none"/>`+[14,21,28,35].map((r,i)=>`<path d="M2 ${2+r}A${r} ${r} 0 0 0 ${2+r} 2" fill="none" stroke="${i%2?M:G}" stroke-width="${i%2?.6:1}"/>`).join('')+star8(13,13,6.2,M,G,.8)+star8(13,13,3,G,M,.4)+star8(29,6.5,2.2,G,M,.3)+star8(6.5,29,2.2,G,M,.3)+dots([[23,23,1.3],[36,12,.9],[12,36,.9]]);
  if(st==='balloon')return [`<path d="M8 8l8 20M8 8l18 10M8 8l-1 22" stroke="#9ca3af" stroke-width=".35" fill="none"/>`,balloon(9,26,4.6,BAL[0]),balloon(18,19,4.4,BAL[1]),balloon(26,12,4.2,BAL[2]),balloon(30,24,3.6,BAL[3]),balloon(20,32,3.4,BAL[4])].join('')+star5(34,6,2.2,G)+star5(6,36,2.2,G)+`<circle cx="36" cy="14" r=".8" fill="${BAL[5]}"/><circle cx="14" cy="38" r=".8" fill="${BAL[0]}"/>`;
  return `<path d="M3 18Q10 10 18 3" stroke="${G}" stroke-width="1" fill="none"/>`+star5(12,12,6.2,G)+star5(25,7,3.4,M)+star5(7,25,3.4,M)+star5(32,16,2.2,G)+star5(16,32,2.2,G)+`<path d="M3 3l10 0M3 3l0 10" stroke="${M}" stroke-width="1.6"/>`;
}
function edge(st,TH,W){
  const G=TH.g,M=TH.m,x0=40,span=W-2*x0,n=Math.max(2,Math.round(span/16)),w=span/n;
  let s='';
  if(['rose','marigold','lotus','lily'].includes(st)){
    s+=`<path d="M${x0} 6${`q${R(w/2)} 14 ${R(w)} 0`.repeat(n)}" fill="none" stroke="${st==='lily'?'#5b8f4a':GR}" stroke-width="1.1"/>`;
    for(let i=0;i<n;i++){
      const cx=x0+w*i+w/2,cy=14;
      s+=leaf(cx-.5,cy-1,5,200,GR2)+leaf(cx+.5,cy-1,5,-20,GR2);
      s+=st==='rose'?rose(cx,cy,2.5,i%2?'#fb7185':'#e11d48',i%2?'#be123c':'#9f1239'):st==='marigold'?marigold(cx,cy,2.5):st==='lotus'?lotus(cx,cy+1,3.4):lily(cx,cy,2.7);
      s+=`<circle cx="${R(x0+w*i)}" cy="6" r="1.1" fill="${G}"/>`;
    }
    s+=`<circle cx="${x0+span}" cy="6" r="1.1" fill="${G}"/>`;
  }else if(st==='arabesque'){
    for(let i=0;i<=n*2;i++){const x=x0+i*w/2;s+=i%2?`<circle cx="${R(x)}" cy="6.2" r="1" fill="${G}"/>`:star8(R(x),6.2,2.1,G,M,.3)}
    s+=`<path d="M${x0} 6.2H${x0+span}" stroke="${M}" stroke-width=".4"/>`;
  }else if(st==='balloon'){
    s+=`<path d="M${x0} 5${`q${R(w/2)} 6 ${R(w)} 0`.repeat(n)}" fill="none" stroke="#6b7280" stroke-width=".5"/>`;
    for(let i=0;i<n;i++){const cx=x0+w*i+w/2,c=BAL[i%BAL.length];s+=`<path d="M${R(cx-3.2)} 7.5L${R(cx+3.2)} 7.5L${R(cx)} 14.2Z" fill="${c}"/>`}
  }else{
    for(let i=0;i<=n*2;i++){const x=x0+i*w/2;s+=i%2?`<circle cx="${R(x)}" cy="6.2" r=".9" fill="${M}"/>`:star5(R(x),6.2,2.6,G)}
  }
  return s;
}
/* full-page decorative frame, drawn on a 194 x 275 mm canvas */
function frame(f,grp,TH){
  const W=194,H=275,st=styleOf(f,grp),rx=st==='arabesque'?6:st==='lily'?1.5:2;
  const c=cluster(st,TH),e=edge(st,TH,W);
  const cl=`<g>${c}</g><g transform="translate(${W} 0) scale(-1 1)">${c}</g><g transform="translate(0 ${H}) scale(1 -1)">${c}</g><g transform="translate(${W} ${H}) scale(-1 -1)">${c}</g>`;
  const ed=`<g>${e}</g><g transform="translate(0 ${H}) scale(1 -1)">${e}</g>`;
  return `<svg class="frs" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">`+
  `<defs><radialGradient id="rg" cx="50%" cy="46%" r="52%"><stop offset="0" stop-color="${TH.s}" stop-opacity=".95"/><stop offset=".7" stop-color="${TH.s}" stop-opacity=".25"/><stop offset="1" stop-color="${TH.bg}" stop-opacity="0"/></radialGradient></defs>`+
  `<rect width="${W}" height="${H}" fill="${TH.bg}"/><ellipse cx="${W/2}" cy="${H*.47}" rx="${W*.52}" ry="${H*.4}" fill="url(#rg)"/>`+
  `<rect x="1.4" y="1.4" width="${W-2.8}" height="${H-2.8}" rx="${rx}" fill="none" stroke="${TH.m}" stroke-width="1.7"/>`+
  `<rect x="4.2" y="4.2" width="${W-8.4}" height="${H-8.4}" rx="${rx}" fill="none" stroke="${TH.g}" stroke-width=".8"/>`+
  `<rect x="6.4" y="6.4" width="${W-12.8}" height="${H-12.8}" rx="${rx}" fill="none" stroke="${TH.m}" stroke-width=".35" stroke-dasharray="1.2 1.2" opacity=".6"/>`+
  ed+cl+`</svg>`;
}

/* ---------- cover illustrations (viewBox 0 0 120 90) ---------- */
const face=(x,y,r,skin)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${skin||SK}"/><circle cx="${R(x-r*.36)}" cy="${R(y+r*.05)}" r="${R(r*.09)}" fill="#2b1b17"/><circle cx="${R(x+r*.36)}" cy="${R(y+r*.05)}" r="${R(r*.09)}" fill="#2b1b17"/><path d="M${R(x-r*.3)} ${R(y+r*.38)}Q${x} ${R(y+r*.7)} ${R(x+r*.3)} ${R(y+r*.38)}" fill="none" stroke="#8a3b2a" stroke-width=".7" stroke-linecap="round"/><circle cx="${R(x-r*.58)}" cy="${R(y+r*.32)}" r="${R(r*.17)}" fill="#f28b82" opacity=".55"/><circle cx="${R(x+r*.58)}" cy="${R(y+r*.32)}" r="${R(r*.17)}" fill="#f28b82" opacity=".55"/>`;
const ground=(c)=>`<ellipse cx="60" cy="83" rx="50" ry="5" fill="${c||'#000'}" opacity=".12"/>`;
const petals=()=>[[20,84],[34,86],[46,85],[74,86],[88,84],[100,86],[58,87]].map(([x,y],i)=>`<ellipse cx="${x}" cy="${y}" rx="1.6" ry=".9" fill="${i%2?'#f9a8d4':'#fb7185'}" transform="rotate(${i*30} ${x} ${y})"/>`).join('');
function arch(TH,flower){
  const g=TH.g,m=TH.m;
  let s=`<path d="M14 84V30Q60 -6 106 30V84" fill="none" stroke="${g}" stroke-width="3.4"/><path d="M14 84V30Q60 -6 106 30V84" fill="none" stroke="${m}" stroke-width="1" stroke-dasharray="2 2"/>`;
  for(let i=0;i<9;i++){const t=i/8,x=14+92*t,y=30-(Math.sin(Math.PI*t))*26+(t<.1||t>.9?0:0);s+=flower(x,R(y+1),3.2,i)}
  [26,40,80,94].forEach(x=>{const y=30-Math.sin(Math.PI*(x-14)/92)*25;s+=`<path d="M${x} ${R(y+3)}V${R(y+14+(x%7))}" stroke="#fff" stroke-width="1.3" stroke-dasharray="1.1 .9" opacity=".9"/>`});
  return s;
}
const flR=(x,y,r,i)=>rose(x,y,r,i%2?'#fb7185':'#e11d48',i%2?'#be123c':'#9f1239');
const flM=(x,y,r)=>marigold(x,y,r);
const flL=(x,y,r)=>lily(x,y,r*1.15);
const garland=(x,y,rx,ry,c)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="${c||'#e11d48'}" stroke-width="1.9" stroke-dasharray="1.2 .8" stroke-linecap="round"/>`;

function groomInd(x,y,old){
  return `<path d="M${x-11} ${y-27}h22l3.5 27h-29z" fill="#fff8e6" stroke="#d9b45a" stroke-width=".6"/><rect x="${x-14.5}" y="${y-4}" width="29" height="4" fill="#c9972e"/><path d="M${x-8} ${y-27}l-1 27M${x+8} ${y-27}l1 27" stroke="#ecd9a6" stroke-width=".5"/>`+
  `<path d="M${x-10.5} ${y-49}q10.5-4 21 0l1.6 24h-24.2z" fill="#fff1c4" stroke="#d9b45a" stroke-width=".5"/><path d="M${x-10.5} ${y-49}l6-1.2l13 25l-6.5 1.2z" fill="#8a1538"/>`+
  `<rect x="${x-14.5}" y="${y-48}" width="5.2" height="19" rx="2.6" fill="#fff1c4" stroke="#d9b45a" stroke-width=".4"/><rect x="${x+9.3}" y="${y-48}" width="5.2" height="19" rx="2.6" fill="#fff1c4" stroke="#d9b45a" stroke-width=".4"/><circle cx="${x-12}" cy="${y-28}" r="2.6" fill="${SK}"/><circle cx="${x+12}" cy="${y-28}" r="2.6" fill="${SK}"/>`+
  `<rect x="${x-3}" y="${y-53}" width="6" height="5" fill="${SK2}"/>`+face(x,y-60,9)+
  `<path d="M${x-9.4} ${y-61}a9.4 9.4 0 0 1 18.8 0q-4-5-9.4-5.2q-5.400 .2-9.400 5.200z" fill="${old?'#cfcfd6':HAIR}"/>`+(old?`<path d="M${x-4} ${y-55.5}q4 2.4 8 0" stroke="#cfcfd6" stroke-width="1.6" fill="none" stroke-linecap="round"/>`:`<path d="M${x-3.5} ${y-55.5}q3.500 1.600 7 0" stroke="${HAIR}" stroke-width="1.1" fill="none"/>`)+
  `<circle cx="${x}" cy="${y-64.200}" r=".9" fill="#c1121f"/>`+garland(x,y-47,10.8,4.6);
}
function brideInd(x,y,old){
  return `<path d="M${x-13} ${y-44}q13-5 26 0l7 44h-40z" fill="#c1121f"/><path d="M${x-13} ${y-44}q13-5 26 0l-3 33q-12-8-24-17z" fill="#8a1538" opacity=".85"/><rect x="${x-20}" y="${y-4}" width="40" height="4" fill="#e3b341"/><path d="M${x-15} ${y-20}l30 0" stroke="#e3b341" stroke-width=".8" stroke-dasharray="2 1.2"/>`+
  `<path d="M${x-9} ${y-46}q9-3 18 0l.8 6q-9.800 3-19.600 0z" fill="#e3b341"/>`+
  `<rect x="${x-13.5}" y="${y-47}" width="4.800" height="17" rx="2.4" fill="#c1121f"/><rect x="${x+8.700}" y="${y-47}" width="4.800" height="17" rx="2.4" fill="#c1121f"/><circle cx="${x-11.100}" cy="${y-30}" r="2.500" fill="${SK}"/><circle cx="${x+11.100}" cy="${y-30}" r="2.500" fill="${SK}"/>`+
  `<rect x="${x-2.800}" y="${y-52}" width="5.600" height="5" fill="${SK2}"/><path d="M${x-8.200} ${y-61}a8.800 8.800 0 0 1 17.600 0v4.500q-8.800-2-17.600 0z" fill="${old?'#cfcfd6':HAIR}"/><circle cx="${x+9.200}" cy="${y-62}" r="3.600" fill="${old?'#cfcfd6':HAIR}"/>`+face(x,y-58,8.2)+
  `<path d="M${x-8.400} ${y-62}q8.400-6.600 16.800 0q-8.400-3-16.800 0z" fill="${old?'#cfcfd6':HAIR}"/>`+[-8,-5.500,-3,5,7.500,10].map((d,i)=>`<circle cx="${R(x+d*.95+(d>0?2.500:-.5))}" cy="${R(y-66+Math.abs(d)*.35)}" r="1.150" fill="#fff"/>`).join('')+
  `<circle cx="${x}" cy="${y-61.500}" r=".95" fill="#c1121f"/><circle cx="${x-8.400}" cy="${y-54}" r="1.100" fill="#e3b341"/><circle cx="${x+8.400}" cy="${y-54}" r="1.100" fill="#e3b341"/>`+garland(x,y-45.500,10.200,4.400,'#f43f5e')+`<path d="M${x-6} ${y-48.500}q6 4.500 12 0" fill="none" stroke="#e3b341" stroke-width=".8"/>`;
}
function groomChr(x,y){
  return `<path d="M${x-9} ${y-27}h8.500v27h-9zM${x+.5} ${y-27}h8.500v27h-9z" fill="#1f2a44"/><rect x="${x-10}" y="${y-2.500}" width="9.800" height="2.500" rx="1" fill="#111"/><rect x="${x+.200}" y="${y-2.500}" width="9.800" height="2.500" rx="1" fill="#111"/>`+
  `<path d="M${x-11} ${y-49}q11-4 22 0l1.800 24h-25.600z" fill="#1f2a44"/><path d="M${x-4.500} ${y-49.500}l4.500 15 4.500-15z" fill="#fff"/><path d="M${x-4.500} ${y-49.500}l4.500 15-7-12zM${x+4.500} ${y-49.500}l-4.500 15 7-12z" fill="#16203a"/><path d="M${x-3} ${y-46.500}l3 1.800 3-1.800v3.600l-3-1.800-3 1.800z" fill="#c1121f"/>`+
  `<rect x="${x-15}" y="${y-48}" width="5.400" height="19" rx="2.700" fill="#1f2a44"/><rect x="${x+9.600}" y="${y-48}" width="5.400" height="19" rx="2.700" fill="#1f2a44"/><circle cx="${x-12.300}" cy="${y-28}" r="2.600" fill="${SK}"/><circle cx="${x+12.300}" cy="${y-28}" r="2.600" fill="${SK}"/>`+
  `<rect x="${x-3}" y="${y-53}" width="6" height="5" fill="${SK2}"/>`+face(x,y-60,9)+`<path d="M${x-9.500} ${y-61}a9.500 9.500 0 0 1 19 0q-5-6.500-10-5q-4-.8-9 5z" fill="#4a2f1f"/>`;
}
function brideChr(x,y){
  return `<path d="M${x-9} ${y-45}q9-3 18 0l3 12q14 6 18 33h-60q4-27 18-33z" fill="#fff" stroke="#d9dbe6" stroke-width=".6"/><path d="M${x-26} ${y-4}q26 6 52 0" fill="none" stroke="#e5e7f0" stroke-width=".8"/><path d="M${x-14} ${y-24}q14 5 28 0" fill="none" stroke="#e5e7f0" stroke-width=".6"/>`+
  `<rect x="${x-3}" y="${y-52}" width="6" height="5" fill="${SK2}"/><path d="M${x-9} ${y-47}q-9 22 -11 40q-6 4-9 2q4-26 12-44z" fill="#fff" opacity=".55" stroke="#d9dbe6" stroke-width=".4"/>`+
  `<path d="M${x-8.500} ${y-61}a8.800 8.800 0 0 1 17.600 0v6q-8.800-2-17.600 0z" fill="#6b3a1e"/>`+face(x,y-58,8.200)+`<path d="M${x-8.400} ${y-62}q8.400-6.600 16.800 0q-8.400-3-16.800 0z" fill="#6b3a1e"/>`+
  `<rect x="${x-8}" y="${y-68}" width="16" height="2.200" rx="1.100" fill="#e3b341"/><path d="M${x-9} ${y-67}q-3 24 -2 52M${x+9} ${y-67}q3 24 2 52" fill="none" stroke="#e5e7f0" stroke-width=".6"/>`+
  `<circle cx="${x-12}" cy="${y-30}" r="2.500" fill="${SK}"/>`+[0,1,2].map(i=>rose(x+3+i*3.200,y-30+(i%2)*2,2.600,i%2?'#fb7185':'#e11d48','#9f1239')).join('')+leaf(x+5,y-27,5,60)+leaf(x+9,y-27,5,110);
}
function couple(TH,o){
  o=o||{};const chr=o.style==='chr',old=!!o.old;
  let s=arch(TH,chr?flL:flR);
  s+=ground(TH.m)+petals();
  s+=chr?groomChr(42,82)+brideChr(78,82):groomInd(42,82,old)+brideInd(78,82,old);
  s+=heart(60,30,5,'#f43f5e')+heart(52,22,3,'#fb7185')+heart(69,23,3.400,'#f9a8d4');
  if(old)s+=`<circle cx="60" cy="14" r="7.500" fill="${TH.g}" stroke="${TH.m}" stroke-width=".8"/><text x="60" y="17.400" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="8.500" fill="${TH.m}">60</text>`;
  return s;
}
function rings(TH){
  return `<circle cx="60" cy="42" r="34" fill="${TH.s}" opacity=".7"/>`+
  `<circle cx="50" cy="46" r="16" fill="none" stroke="#e3b341" stroke-width="4.500"/><circle cx="50" cy="46" r="16" fill="none" stroke="#fff3c4" stroke-width="1" opacity=".8"/>`+
  `<circle cx="70" cy="46" r="16" fill="none" stroke="#c9972e" stroke-width="4.500"/><circle cx="70" cy="46" r="16" fill="none" stroke="#fff3c4" stroke-width="1" opacity=".8"/>`+
  `<path d="M60 22l5 5-5 7-5-7z" fill="#bfe9ff" stroke="#6bb6e8" stroke-width=".8"/><path d="M55 27h10M60 22v12" stroke="#fff" stroke-width=".5"/>`+
  heart(60,10,6,'#f43f5e')+heart(30,18,4,'#fb7185')+heart(91,18,4,'#f9a8d4')+
  rose(40,74,5.500,'#e11d48','#9f1239')+rose(60,78,6.500,'#fb7185','#be123c')+rose(80,74,5.500,'#e11d48','#9f1239')+leaf(30,76,10,190)+leaf(90,76,10,-10)+leaf(48,80,8,170,GR2)+leaf(72,80,8,10,GR2);
}
function cradle(TH,badge){
  let s=`<path d="M10 10H110" stroke="#8a5a2b" stroke-width="3" stroke-linecap="round"/><path d="M26 10L30 52M94 10L90 52M30 10L30 52M90 10L90 52" stroke="#c9972e" stroke-width=".9"/>`;
  s+=[32,44,56,68,80,92].map((x,i)=>`<path d="M${x} 10v${5+(i%2)*3}" stroke="#fff" stroke-width="1.2" stroke-dasharray="1 .8"/>${star5(x,R(18+(i%2)*3.5),2.4,i%2?'#f9c74f':'#fb7185')}`).join('');
  s+=`<path d="M22 50H98Q98 80 60 80Q22 80 22 50Z" fill="#b8742f"/><path d="M26 58Q60 70 94 58M30 66Q60 76 90 66" fill="none" stroke="#e0a45c" stroke-width="1"/><rect x="19" y="46" width="82" height="6" rx="3" fill="#e3b341" stroke="#b8862a" stroke-width=".5"/>`;
  s+=`<path d="M28 52Q60 34 92 52Q60 60 28 52Z" fill="#fbcfe8"/><path d="M28 52Q60 60 92 52" fill="none" stroke="#f472b6" stroke-width=".8"/>`;
  s+=`<circle cx="60" cy="40" r="11" fill="${SK}"/><path d="M49.500 38a10.500 10.500 0 0 1 21 0q-10.500-6-21 0z" fill="${TH.g}"/><path d="M54 41.500q2.200 1.800 4 0M62 41.500q2.200 1.800 4 0" stroke="#2b1b17" stroke-width="1" fill="none" stroke-linecap="round"/><path d="M57.500 46q2.500 2 5 0" stroke="#8a3b2a" stroke-width=".9" fill="none" stroke-linecap="round"/><circle cx="53" cy="45" r="2.100" fill="#f28b82" opacity=".55"/><circle cx="67" cy="45" r="2.100" fill="#f28b82" opacity=".55"/>`;
  s+=`<ellipse cx="60" cy="84" rx="42" ry="4" fill="#000" opacity=".1"/>`;
  s+=marigold(14,76,5)+marigold(106,76,5)+leaf(14,76,10,200)+leaf(106,76,10,-20)+rose(25,82,3.200,'#fb7185','#be123c')+rose(95,82,3.200,'#fb7185','#be123c');
  if(badge==='m')s+=`<path d="M105 28a10 10 0 1 0 0 18a8 8 0 1 1 0-18z" fill="${TH.g}"/>${star5(106,26,3,TH.g)}`;
  else s+=heart(104,30,6,'#f9a8d4')+heart(16,30,5,'#fb7185');
  return s;
}
function girl(TH){
  const x=60,y=80;
  let s=`<ellipse cx="60" cy="81" rx="40" ry="7" fill="${TH.s}" stroke="${TH.g}" stroke-width=".7"/>`+
  [...Array(14)].map((_,i)=>`<circle cx="${R(60+Math.cos(i*Math.PI/7)*30)}" cy="${R(81+Math.sin(i*Math.PI/7)*4.6)}" r="1" fill="${i%2?TH.m:'#fff'}"/>`).join('');
  // lamps
  const lamp=lx=>`<path d="M${lx} 80V54" stroke="#c9972e" stroke-width="2.200"/><ellipse cx="${lx}" cy="80" rx="5" ry="1.800" fill="#c9972e"/><path d="M${lx-4.500} 54h9l-1.500-4h-6z" fill="#e3b341"/><path d="M${lx} 49q-3-4 0-9q3 5 0 9z" fill="#ff9d1a"/><path d="M${lx} 48q-1.200-2 0-4q1.200 2 0 4z" fill="#ffe27a"/>`;
  s+=lamp(18)+lamp(102);
  s+=`<path d="M${x-14} ${y-26}h28l5 26h-38z" fill="#1f9d6b"/><path d="M${x-19} ${y-4}h38v4h-38z" fill="#e3b341"/><path d="M${x-16} ${y-14}h32" stroke="#e3b341" stroke-width=".8" stroke-dasharray="2 1.200"/>`+
  `<path d="M${x-10} ${y-46}q10-4 20 0l1 20h-22z" fill="#c1121f"/><path d="M${x-10} ${y-46}l7-1l14 22-7 1z" fill="#f59e0b"/>`+
  `<rect x="${x-14}" y="${y-45}" width="5" height="17" rx="2.500" fill="#c1121f"/><rect x="${x+9}" y="${y-45}" width="5" height="17" rx="2.500" fill="#c1121f"/>`+
  `<path d="M${x-12} ${y-29}l-6 -4M${x+12} ${y-29}l6 -4" stroke="${SK}" stroke-width="3.200" stroke-linecap="round"/>`+
  `<path d="M${x-18} ${y-33}q18 22 36 0" fill="none" stroke="#e11d48" stroke-width="2.600" stroke-dasharray="1.300 .8" stroke-linecap="round"/>`+
  `<rect x="${x-2.800}" y="${y-51}" width="5.600" height="5" fill="${SK2}"/><path d="M${x-8.800} ${y-58}a8.800 8.800 0 0 1 17.600 0v3q-8.800-3-17.600 0z" fill="${HAIR}"/><path d="M${x+7} ${y-60}q8 8 4 30q-3 4-4 0q2-14-3-24z" fill="${HAIR}"/>`+face(x,y-56,8.400)+
  `<path d="M${x-8.600} ${y-60}q8.600-6.500 17.200 0q-8.600-3.500-17.200 0z" fill="${HAIR}"/>`+[0,1,2,3,4].map(i=>jasmine(x+9.500+i*.6,y-58+i*5,1.500)).join('')+`<circle cx="${x}" cy="${y-60}" r=".9" fill="#c1121f"/>`+
  lotus(x-24,y-6,6)+lotus(x+24,y-6,6)+leaf(x-30,y-3,9,190)+leaf(x+30,y-3,9,-10);
  s+=heart(30,30,4,'#fb7185')+heart(90,26,4,'#f9a8d4')+star5(40,16,2.500,TH.g)+star5(82,14,2.500,TH.g);
  return s;
}
function mother(TH){
  const x=60,y=80;
  let s=`<circle cx="60" cy="46" r="38" fill="${TH.s}" opacity=".7"/>`+ground(TH.m);
  s+=`<path d="M${x-13} ${y-30}h26l5 30h-36z" fill="#1f9d6b"/><rect x="${x-18}" y="${y-4}" width="36" height="4" fill="#e3b341"/>`+
  `<path d="M${x-11} ${y-47}q11-4 22 0l2 22q-13 10-26 0z" fill="#2fb87d"/><path d="M${x-11} ${y-47}l7-1.200l14 25-7 1.200z" fill="#e3b341"/><ellipse cx="${x}" cy="${y-24}" rx="10" ry="9.500" fill="#2fb87d" stroke="#1f9d6b" stroke-width=".8"/><path d="M${x-5} ${y-24}q5 4 10 0" fill="none" stroke="#1f9d6b" stroke-width=".7"/>`;
  s+=`<path d="M${x-11} ${y-44}l-10 -10M${x+11} ${y-44}l10 -10" stroke="${SK}" stroke-width="4" stroke-linecap="round"/><circle cx="${x-21.500}" cy="${y-55}" r="3.200" fill="${SK}"/><circle cx="${x+21.500}" cy="${y-55}" r="3.200" fill="${SK}"/>`;
  const bg=['#ef4444','#22c55e','#f59e0b','#3b82f6','#a855f7','#ef4444'];
  [-1,1].forEach(sd=>{bg.forEach((c,i)=>{s+=`<rect x="${R(x+sd*(15.500+i*1.700)-1)}" y="${R(y-55-i*1.500-(sd<0?0:0))}" width="2" height="6.500" rx="1" fill="${c}" transform="rotate(${sd*-40} ${R(x+sd*(15.500+i*1.700))} ${R(y-52)})" opacity=".95"/>`})});
  s+=`<rect x="${x-2.800}" y="${y-52}" width="5.600" height="5" fill="${SK2}"/><path d="M${x-8.800} ${y-60}a8.800 8.800 0 0 1 17.600 0v3q-8.800-3-17.600 0z" fill="${HAIR}"/><circle cx="${x}" cy="${y-71}" r="4.500" fill="${HAIR}"/>`+face(x,y-57,8.400)+`<path d="M${x-8.600} ${y-61}q8.600-6.500 17.200 0q-8.600-3.500-17.200 0z" fill="${HAIR}"/><circle cx="${x}" cy="${y-61}" r=".9" fill="#c1121f"/>`+[-6,-3,0,3,6].map((d,i)=>jasmine(x+d,y-70.500-(i%2)*.8,1.700)).join('');
  s+=`<path d="M${x-15} ${y-40}q15 18 30 0" fill="none" stroke="#f43f5e" stroke-width="2.600" stroke-dasharray="1.300 .8" stroke-linecap="round"/>`;
  s+=rose(26,72,5,'#fb7185','#be123c')+rose(94,72,5,'#fb7185','#be123c')+leaf(20,74,9,200)+leaf(100,74,9,-20)+marigold(34,78,3.600)+marigold(86,78,3.600)+heart(28,28,4,'#fb7185')+heart(94,24,4,'#f9a8d4')+star5(40,14,2.400,TH.g)+star5(80,12,2.400,TH.g);
  return s;
}
function gopuram(TH){
  const M=TH.m,G=TH.g;
  let s=`<circle cx="60" cy="40" r="38" fill="${TH.s}" opacity=".8"/><g stroke="${G}" stroke-width=".7" opacity=".6">${[...Array(16)].map((_,i)=>{const a=i*Math.PI/8;return `<path d="M60 40L${R(60+Math.cos(a)*44)} ${R(40+Math.sin(a)*44)}"/>`}).join('')}</g>`;
  const cols=['#b8452a','#c9972e','#b8452a','#d9a441','#b8452a','#c9972e','#b8452a'];
  let y=80;
  s+=`<rect x="22" y="${y-6}" width="76" height="6" fill="#d9c7a1" stroke="${M}" stroke-width=".5"/>`;
  for(let i=0;i<7;i++){
    const w=56-i*7,h=8.5,yy=y-6-(i+1)*h;
    s+=`<rect x="${R(60-w/2)}" y="${R(yy)}" width="${w}" height="${h}" fill="${cols[i]}" stroke="${M}" stroke-width=".5"/><path d="M${R(60-w/2-2.500)} ${R(yy)}h${w+5}l-1.500-2.200h${-(w+2)}z" fill="${G}" stroke="${M}" stroke-width=".4"/>`;
    const n=Math.max(1,Math.floor(w/9));for(let k=0;k<n;k++)s+=`<rect x="${R(60-w/2+(k+.5)*w/n-1.300)}" y="${R(yy+2)}" width="2.600" height="4.600" rx="1.300" fill="#fff3c4" opacity=".9"/>`;
  }
  s+=`<rect x="53" y="${y-6-3*8.5+0}" width="0" height="0"/><path d="M52 ${y-6}v-12q8-8 16 0v12z" fill="#4a1d12" stroke="${G}" stroke-width=".7"/>`;
  const ty=y-6-7*8.5;
  s+=`<path d="M52 ${ty}l8-6 8 6z" fill="${G}" stroke="${M}" stroke-width=".5"/>`+[-6,0,6].map(d=>`<path d="M${60+d} ${ty-5}v-3.500" stroke="${M}" stroke-width=".6"/><ellipse cx="${60+d}" cy="${ty-9.500}" rx="2.200" ry="3.200" fill="${G}" stroke="${M}" stroke-width=".5"/>`).join('');
  s+=`<path d="M60 ${ty-13}l3 -4-3-3-3 3z" fill="#ffd25a"/><path d="M60 ${ty-13}v-8" stroke="${M}" stroke-width=".6"/><path d="M60 ${ty-21}l5 2-5 2z" fill="#e11d48"/>`;
  [[14,78],[106,78]].forEach(([px,py],i)=>{s+=`<path d="M${px} ${py}V${py-22}" stroke="#7a5a2b" stroke-width="2"/>`+[0,40,80,120,160,200,240,280,320].map(a=>`<path d="M${px} ${py-22}q${Math.cos(a*Math.PI/180)*9} ${Math.sin(a*Math.PI/180)*5-4} ${Math.cos(a*Math.PI/180)*13} ${Math.sin(a*Math.PI/180)*8+3}" stroke="${GR}" stroke-width="1.800" fill="none" stroke-linecap="round"/>`).join('')});
  s+=marigold(30,82,3.500)+marigold(90,82,3.500)+marigold(44,84,3)+marigold(76,84,3)+star5(24,22,2.600,G)+star5(96,18,2.600,G);
  return s;
}
function church(TH){
  const M=TH.m,G=TH.g;
  let s=`<circle cx="60" cy="42" r="36" fill="${TH.s}" opacity=".9"/>`;
  s+=`<rect x="22" y="48" width="76" height="32" fill="#fdfbf5" stroke="${M}" stroke-width=".8"/><path d="M18 48L60 32 102 48z" fill="${M}"/><path d="M18 48L60 32" stroke="${G}" stroke-width=".6"/>`;
  s+=`<rect x="47" y="24" width="26" height="56" fill="#fdfbf5" stroke="${M}" stroke-width=".8"/><path d="M45 24L60 6 75 24z" fill="${M}"/><path d="M60 -2v13M55 3.500h10" stroke="${G}" stroke-width="2" stroke-linecap="round"/>`;
  s+=`<circle cx="60" cy="35" r="5.500" fill="#bfe0ff" stroke="${G}" stroke-width="1"/><path d="M60 29.500v11M54.500 35h11M56 31l8 8M64 31l-8 8" stroke="${G}" stroke-width=".6"/>`;
  s+=`<path d="M53 80V62q7-9 14 0v18z" fill="#5a3a22" stroke="${G}" stroke-width=".8"/><path d="M60 62v18" stroke="${G}" stroke-width=".5"/>`;
  [[30],[40],[80],[90]].forEach(([wx])=>{s+=`<path d="M${wx-3} 68V57q3-5 6 0v11z" fill="#9ec9ff" stroke="${G}" stroke-width=".7"/>`});
  s+=`<path d="M46 80h28v3H46zM42 83h36v3H42z" fill="#e5dcc6" stroke="${M}" stroke-width=".4"/>`;
  s+=`<g transform="translate(86 20)"><path d="M0 8q-9 -3 -16 -9q8 -2 12 1q-3-6-1-9q6 5 7 11q4-6 10-6q-3 6-8 10q-1 3-4 2z" fill="#fff" stroke="#9aa5b8" stroke-width=".6"/><path d="M-16 -1q-5 2-9 0" stroke="#7aa35a" stroke-width="1" fill="none"/><path d="M-22 -3l3-1M-22 -1l3 0" stroke="#7aa35a" stroke-width="1"/></g>`;
  s+=lily(18,82,5)+lily(102,82,5)+leaf(12,83,10,190,'#5b8f4a')+leaf(108,83,10,-10,'#5b8f4a')+star5(24,18,2.400,G)+star5(100,40,2.400,G);
  return s;
}
function mosque(TH){
  const M=TH.m,G=TH.g;
  let s=`<circle cx="60" cy="46" r="38" fill="${TH.s}" opacity=".9"/>`+[[22,16],[96,12],[104,30],[16,36],[44,8],[78,8]].map(([x,y],i)=>star5(x,y,i%2?1.600:2.300,G)).join('');
  s+=`<path d="M92 14a11 11 0 1 0 0 20a8.800 8.800 0 1 1 0-20z" fill="${G}" transform="translate(-30 -2) scale(.8)"/>`;
  const minaret=(x)=>`<rect x="${x-4}" y="30" width="8" height="50" fill="#fbf7ec" stroke="${M}" stroke-width=".7"/><rect x="${x-5.500}" y="42" width="11" height="3" fill="${G}"/><rect x="${x-5.500}" y="56" width="11" height="3" fill="${G}"/><path d="M${x-4} 30q4-12 8 0z" fill="${M}"/><path d="M${x} 20v-7" stroke="${G}" stroke-width=".8"/><circle cx="${x}" cy="12.500" r="1.200" fill="${G}"/><path d="M${x-1} 36q1 3 2 0v5h-2z" fill="${M}" opacity=".6"/>`;
  s+=minaret(20)+minaret(100);
  s+=`<rect x="30" y="50" width="60" height="30" fill="#fbf7ec" stroke="${M}" stroke-width=".7"/><path d="M38 50a22 22 0 0 1 44 0z" fill="${M}" stroke="${G}" stroke-width=".7"/><path d="M60 28v-8" stroke="${G}" stroke-width="1"/><path d="M62.500 14a4 4 0 1 0 0 8a3.200 3.200 0 1 1 0-8z" fill="${G}"/>`;
  s+=`<path d="M32 50a8 8 0 0 1 14-4v4z" fill="${G}"/><path d="M88 50a8 8 0 0 0-14-4v4z" fill="${G}"/>`;
  s+=`<path d="M52 80V64q8-12 16 0v16z" fill="#143d2e" stroke="${G}" stroke-width=".8"/>`+[38,78].map(x=>`<path d="M${x-3.500} 74V64q3.500-6 7 0v10z" fill="#143d2e" stroke="${G}" stroke-width=".7"/>`).join('')+`<path d="M60 54l2 3 3 .4-2.300 2 .7 3-3.400-1.800-3.400 1.800.7-3-2.300-2 3-.4z" fill="${G}"/>`;
  s+=`<path d="M10 80h100v3H10z" fill="#d9d2bf"/>`+star8(30,86,2,G,M,.3)+star8(90,86,2,G,M,.3);
  return s;
}
function house(TH,badge){
  const M=TH.m,G=TH.g;
  let s=`<circle cx="60" cy="42" r="37" fill="${TH.s}" opacity=".85"/><circle cx="96" cy="14" r="7" fill="#ffd25a"/>`+[0,45,90,135,180,225,270,315].map(a=>`<path d="M96 14l${R(Math.cos(a*Math.PI/180)*11)} ${R(Math.sin(a*Math.PI/180)*11)}" stroke="#ffd25a" stroke-width=".8"/>`).join('');
  s+=`<rect x="26" y="44" width="68" height="36" fill="#fff4e0" stroke="${M}" stroke-width=".8"/><path d="M20 46L60 18 100 46z" fill="#c2452d" stroke="${M}" stroke-width=".8"/>`+[0,1,2,3].map(i=>`<path d="M${30+i*3.200} ${43+i*-2.2}L${90-i*3.200} ${43+i*-2.2}" stroke="#a63a25" stroke-width=".5" transform="translate(0 ${i*0})"/>`).join('')+`<rect x="84" y="20" width="6" height="12" fill="#a63a25"/>`;
  s+=`<rect x="50" y="56" width="20" height="24" rx="1.500" fill="#6b3a1e" stroke="${G}" stroke-width=".8"/><path d="M60 56v24M50 68h20" stroke="${G}" stroke-width=".5"/><circle cx="66" cy="69" r="1" fill="${G}"/>`;
  s+=`<path d="M48 55h24" stroke="${GR}" stroke-width="1.400"/>`+[...Array(8)].map((_,i)=>`<path d="M${50+i*3.200} 55l-1.500 5 3 0z" fill="${i%2?GR2:GR}"/>`).join('');
  [[34],[78]].forEach(([wx])=>{s+=`<rect x="${wx}" y="54" width="12" height="12" fill="#9ec9ff" stroke="${G}" stroke-width=".8"/><path d="M${wx+6} 54v12M${wx} 60h12" stroke="${G}" stroke-width=".5"/>`});
  if(badge==='cross')s+=`<path d="M60 22v10M55.500 26h9" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`;
  else if(badge==='crescent')s+=`<path d="M63 22a5 5 0 1 0 0 9a4 4 0 1 1 0-9z" fill="#ffe08a"/>`;
  else s+=`<path d="M60 36q-3-3-3-6a3 3 0 0 1 6 0q0 3-3 6z" fill="#ffd25a" opacity=".95"/>`;
  s+=`<path d="M12 82q48 7 96 0" stroke="${M}" stroke-width=".6" fill="none"/>`;
  s+=`<ellipse cx="60" cy="84" rx="20" ry="3.600" fill="${TH.s}" stroke="${G}" stroke-width=".6"/>`+[...Array(8)].map((_,i)=>`<circle cx="${R(60+Math.cos(i*Math.PI/4)*12)}" cy="${R(84+Math.sin(i*Math.PI/4)*2.200)}" r=".9" fill="${i%2?M:'#fff'}"/>`).join('');
  s+=`<path d="M16 80V56" stroke="#7a5a2b" stroke-width="2"/>`+[0,50,100,150,200,250,300].map(a=>`<path d="M16 56q${R(Math.cos(a*Math.PI/180)*8)} ${R(Math.sin(a*Math.PI/180)*4-4)} ${R(Math.cos(a*Math.PI/180)*12)} ${R(Math.sin(a*Math.PI/180)*7+3)}" stroke="${GR}" stroke-width="1.800" fill="none" stroke-linecap="round"/>`).join('');
  s+=marigold(100,82,3.600)+marigold(108,80,3)+marigold(20,84,3)+star5(30,24,2.400,G)+heart(106,52,4,'#fb7185')+balloon(104,34,3.800,BAL[0])+balloon(111,38,3.400,BAL[2]);
  return s;
}
function shop(TH){
  const M=TH.m,G=TH.g;
  let s=`<circle cx="60" cy="44" r="38" fill="${TH.s}" opacity=".85"/>`;
  s+=`<rect x="22" y="30" width="76" height="50" fill="#fff6e8" stroke="${M}" stroke-width=".8"/><rect x="22" y="22" width="76" height="9" rx="1.500" fill="${M}"/>`;
  for(let i=0;i<8;i++)s+=`<path d="M${22+i*9.500} 31h9.500v1q-4.750 6-9.500 0z" fill="${i%2?'#fff':'#e11d48'}" stroke="#e5d9c8" stroke-width=".3"/><rect x="${22+i*9.500}" y="22" width="9.500" height="9" fill="${i%2?'#fff':'#e11d48'}" opacity=".95"/>`;
  s+=`<rect x="34" y="8" width="52" height="12" rx="2" fill="${G}" stroke="${M}" stroke-width=".8"/>`+star5(44,14,3,'#fff')+star5(76,14,3,'#fff')+`<path d="M52 14h16" stroke="${M}" stroke-width="1.200" stroke-dasharray="2 1.400"/>`;
  s+=`<rect x="28" y="44" width="30" height="22" fill="#cfe6ff" stroke="${G}" stroke-width=".8"/><path d="M28 55h30M43 44v22" stroke="${G}" stroke-width=".5"/><rect x="31" y="49" width="6" height="6" fill="#fb7185"/><rect x="40" y="48" width="5" height="7" fill="#f59e0b"/><rect x="48" y="50" width="7" height="5" fill="#22c55e"/><rect x="31" y="59" width="8" height="5" fill="#a855f7"/><rect x="43" y="58" width="6" height="6" fill="#3b82f6"/>`;
  s+=`<rect x="66" y="40" width="22" height="40" rx="1.500" fill="#6b3a1e" stroke="${G}" stroke-width=".8"/><rect x="69" y="44" width="16" height="9" fill="#fff3c4"/><text x="77" y="51.200" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="6.200" fill="${M}">OPEN</text><circle cx="72" cy="66" r="1" fill="${G}"/>`;
  s+=`<path d="M10 74q50 8 100 0" fill="none" stroke="#e11d48" stroke-width="3.500"/><path d="M10 74q50 8 100 0" fill="none" stroke="#fff" stroke-width=".6" stroke-dasharray="2 2"/>`+`<path d="M60 78l-7 5 4 2 3-4 3 4 4-2z" fill="#e11d48"/><circle cx="60" cy="78" r="2" fill="#be123c"/>`;
  s+=`<g transform="translate(94 76) rotate(-20)" fill="none" stroke="#6b7280" stroke-width="1.100"><path d="M0 0l12-8M0 0l12 8"/><circle cx="-2" cy="-3" r="2.600" stroke="#e11d48"/><circle cx="-2" cy="3" r="2.600" stroke="#e11d48"/></g>`;
  s+=balloon(12,40,4.400,BAL[0])+balloon(20,30,4,BAL[1])+balloon(108,40,4.400,BAL[2])+balloon(100,30,4,BAL[3])+marigold(16,82,3.600)+marigold(106,84,3.600)+star5(60,3,2.600,G);
  return s;
}
function cake(TH){
  let s=`<circle cx="60" cy="46" r="38" fill="${TH.s}" opacity=".85"/>`;
  s+=balloon(14,34,5.400,BAL[0])+balloon(24,22,5,BAL[1])+balloon(106,34,5.400,BAL[2])+balloon(96,22,5,BAL[4])+balloon(34,14,4.200,BAL[3])+balloon(86,13,4.200,BAL[5]);
  s+=`<rect x="26" y="62" width="68" height="20" rx="3" fill="#f9a8d4" stroke="#be185d" stroke-width=".6"/><path d="M26 66q5 7 10 0q5 7 10 0q5 7 10 0q5 7 10 0q5 7 10 0q5 7 10 0q4 6 8 0v-4h-68z" fill="#fff"/><rect x="36" y="46" width="48" height="17" rx="3" fill="#fcd34d" stroke="#b45309" stroke-width=".6"/><path d="M36 50q4.800 7 9.600 0q4.800 7 9.600 0q4.800 7 9.600 0q4.800 7 9.600 0q4.800 7 9.600 0v-3h-48z" fill="#fff"/><rect x="46" y="32" width="28" height="15" rx="3" fill="#f472b6" stroke="#be185d" stroke-width=".6"/><path d="M46 36q4.700 6 9.300 0q4.700 6 9.300 0q4.700 6 9.300 0v-3h-28z" fill="#fff"/>`;
  s+=[52,60,68].map((x,i)=>`<rect x="${x-1.200}" y="22" width="2.400" height="10" fill="${['#60a5fa','#f59e0b','#34d399'][i]}"/><path d="M${x} 21q-2.600-3.600 0-7.500q2.600 3.900 0 7.500z" fill="#ff9d1a"/><path d="M${x} 20q-1-1.600 0-3.200q1 1.600 0 3.200z" fill="#ffe27a"/>`).join('');
  s+=`<circle cx="30" cy="62" r="2" fill="#e11d48"/><circle cx="90" cy="62" r="2" fill="#e11d48"/><circle cx="60" cy="46" r="2" fill="#e11d48"/>`+[...Array(7)].map((_,i)=>`<circle cx="${32+i*9.500}" cy="76" r="1.400" fill="${BAL[i%6]}"/>`).join('');
  s+=`<rect x="8" y="70" width="16" height="12" fill="#60a5fa"/><rect x="14" y="70" width="4" height="12" fill="#fcd34d"/><path d="M16 70q-5-6-8-2q3 5 8 2zM16 70q5-6 8-2q-3 5-8 2z" fill="#fcd34d"/><rect x="96" y="72" width="16" height="10" fill="#a78bfa"/><rect x="102" y="72" width="4" height="10" fill="#fff"/><path d="M104 72q-5-6-8-2q3 5 8 2zM104 72q5-6 8-2q-3 5-8 2z" fill="#fff"/>`;
  s+=star5(44,10,2.200,TH.g)+star5(78,6,2.200,TH.g)+star5(110,58,2,TH.g)+star5(10,56,2,TH.g);
  return s;
}
function kalasam(TH){
  const M=TH.m,G=TH.g;
  let s=`<circle cx="60" cy="44" r="38" fill="${TH.s}" opacity=".85"/>`;
  const lamp=lx=>`<path d="M${lx} 80V50" stroke="#c9972e" stroke-width="2.400"/><ellipse cx="${lx}" cy="81" rx="6" ry="2" fill="#c9972e"/><path d="M${lx-5.500} 50h11l-2-5h-7z" fill="#e3b341"/><path d="M${lx} 44q-3.400-4.600 0-10q3.400 5.400 0 10z" fill="#ff9d1a"/><path d="M${lx} 43q-1.300-2.200 0-4.600q1.300 2.400 0 4.600z" fill="#ffe27a"/>`;
  s+=lamp(20)+lamp(100);
  s+=[-40,-22,0,22,40].map((a,i)=>leaf(60,36,i%2?24:28,-90+a,i%2?GR2:GR)).join('');
  s+=`<ellipse cx="60" cy="32" rx="7" ry="8.500" fill="#8a5a2b"/><path d="M56 28q4 4 8 0M60 25v8" stroke="#6b4420" stroke-width=".6" fill="none"/>`;
  s+=`<path d="M48 42h24l-1 5q9 4 9 15q0 14-20 14t-20-14q0-11 9-15z" fill="#d98a3d" stroke="#a5651f" stroke-width=".8"/><ellipse cx="60" cy="42.500" rx="12.500" ry="2.600" fill="#e3b341"/><path d="M44 58q16 6 32 0" fill="none" stroke="#fff3c4" stroke-width=".9"/><path d="M42 64q18 7 36 0" fill="none" stroke="#c1121f" stroke-width="1"/><circle cx="60" cy="54" r="3.200" fill="#c1121f"/><path d="M60 50.500v7M56.500 54h7" stroke="#fff3c4" stroke-width=".6"/>`;
  s+=lotus(60,84,12,'#f48fb1','#c2185b')+lotus(38,84,7)+lotus(82,84,7)+leaf(26,84,10,190)+leaf(94,84,10,-10)+marigold(30,66,3.200)+marigold(90,66,3.200)+star5(30,16,2.500,G)+star5(90,12,2.500,G)+heart(100,30,4,'#fb7185');
  return s;
}

const ART={couple:couple,rings:rings,cradle:cradle,girl:girl,mother:mother,gopuram:gopuram,church:church,mosque:mosque,house:house,shop:shop,cake:cake,kalasam:kalasam};
const MAP={h_wed:['couple'],c_wed:['couple',{style:'chr'}],g_engage:['rings'],g_recept:['couple'],g_anniv:['couple'],h_mani:['couple',{old:1}],
  h_manjal:['girl'],h_valai:['mother'],h_kadhu:['cradle'],h_peyar:['cradle'],h_kumba:['gopuram'],
  c_bapt:['church'],c_comm:['church'],c_house:['house','cross'],m_nikah:['mosque'],m_walima:['mosque'],m_aqiqa:['cradle','m'],m_sunnath:['cradle','m'],m_house:['house','crescent'],
  g_bday:['cake'],g_house:['house'],g_shop:['shop']};
function art(f,grp,TH,couple){
  let m=MAP[f.type];
  if(!m&&f.type==='marriage')m=MAP.h_wed;
  if(!m)m=couple?['couple']:[{gHindu:'kalasam',gChr:'church',gMus:'mosque',gGen:'kalasam'}[grp]||'kalasam'];
  const fn=ART[m[0]],body=fn(TH,m[1]);
  return `<svg class="art" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}
window.MoiArt={frame:frame,art:art,styleOf:styleOf,leaf:leaf,rose:rose,marigold:marigold,lily:lily,lotus:lotus};
})();
