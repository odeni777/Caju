export const SAVE_KEY='caju-biblioteca-v1';
export const statKeys=['food','hygiene','energy','fun','health'];
export function localDay(now=Date.now()){const d=new Date(now);return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;}
export function freshState(now=Date.now()){return {version:1,stats:{food:78,hygiene:92,energy:65,fun:84,health:96},coins:240,markers:3,owned:[],equipped:{},decorations:[],sleeping:false,lastSeen:now,day:localDay(now),rituals:[],dailyClaimed:false,achievements:[],gamesPlayed:0,sound:false};}
export function normalize(raw,now=Date.now()){
 const base=freshState(now);if(!raw||raw.version!==1)return base;
 for(const key of statKeys){const v=raw.stats?.[key];if(Number.isFinite(v))base.stats[key]=Math.min(100,Math.max(0,v));}
 for(const key of ['coins','markers','gamesPlayed'])if(Number.isFinite(raw[key]))base[key]=Math.max(0,Math.floor(raw[key]));
 for(const key of ['owned','decorations','rituals','achievements'])if(Array.isArray(raw[key]))base[key]=[...new Set(raw[key].filter(v=>typeof v==='string'))];
 if(raw.equipped&&typeof raw.equipped==='object'&&!Array.isArray(raw.equipped))base.equipped=Object.fromEntries(Object.entries(raw.equipped).filter(([k,v])=>['hat','neck','body','hand','glasses'].includes(k)&&typeof v==='string'));
 for(const key of ['sleeping','sound','dailyClaimed'])if(typeof raw[key]==='boolean')base[key]=raw[key];
 if(Number.isFinite(raw.lastSeen))base.lastSeen=Math.min(now,raw.lastSeen);
 if(typeof raw.day==='string')base.day=raw.day;
 return base;
}
// localStorage can be unavailable in private contexts. Gameplay remains usable in memory.
export function load(){try{return normalize(JSON.parse(localStorage.getItem(SAVE_KEY)));}catch{return freshState();}}
export function save(state){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));return true;}catch{return false;}}
