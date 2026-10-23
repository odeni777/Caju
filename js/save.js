export const SAVE_KEY='caju-biblioteca-v1';
export const statKeys=['food','hygiene','energy','fun','health'];
export function localDay(now=Date.now()){const d=new Date(now);return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;}
const safeNumber=(v,fallback,min=0,max=1e9)=>Number.isFinite(v)?Math.min(max,Math.max(min,v)):fallback;
const stringList=v=>Array.isArray(v)?[...new Set(v.filter(x=>typeof x==='string'&&x.length<100))].slice(0,500):[];
export function freshState(now=Date.now()){return {version:1,stats:{food:78,hygiene:92,energy:65,fun:84,health:96},coins:240,markers:3,owned:[],equipped:{},decorations:[],sleeping:false,lastSeen:now,day:localDay(now),rituals:[],dailyClaimed:false,achievements:[],gamesPlayed:0,sound:false,settings:{volume:.5,voice:true,music:false,dark:false,largeText:false,haptics:true},pets:{},inventory:{},favorites:[],missions:{read:0,feed:0,win:0,claimed:[]},counts:{read:0,correct:0},diary:[],collection:{},world:{createdAt:now,rejuvenation:0,mess:0,notes:0,lastAbsence:0},eventsClaimed:[],tutorialDone:false};}
export function normalize(raw,now=Date.now()){
 const base=freshState(now);if(!raw||raw.version!==1)return base;
 for(const key of statKeys){const v=raw.stats?.[key];if(Number.isFinite(v))base.stats[key]=Math.min(100,Math.max(0,v));}
 for(const key of ['coins','markers','gamesPlayed'])if(Number.isFinite(raw[key]))base[key]=Math.max(0,Math.floor(raw[key]));
 for(const key of ['owned','decorations','rituals','achievements'])if(Array.isArray(raw[key]))base[key]=[...new Set(raw[key].filter(v=>typeof v==='string'))];
 if(raw.equipped&&typeof raw.equipped==='object'&&!Array.isArray(raw.equipped))base.equipped=Object.fromEntries(Object.entries(raw.equipped).filter(([k,v])=>['hat','neck','body','hand','glasses','hair','hairColor'].includes(k)&&typeof v==='string'));
 for(const key of ['sleeping','sound','dailyClaimed'])if(typeof raw[key]==='boolean')base[key]=raw[key];
 if(Number.isFinite(raw.lastSeen))base.lastSeen=Math.min(now,raw.lastSeen);
 if(typeof raw.day==='string')base.day=raw.day;
 const slots=['hat','neck','body','hand','glasses','hair','hairColor'];
 const readOutfit=value=>value&&typeof value==='object'?Object.fromEntries(Object.entries(value).filter(([k,v])=>slots.includes(k)&&typeof v==='string'&&v.length<80)):{};
 if(raw.settings&&typeof raw.settings==='object'){for(const k of ['voice','music','dark','largeText','haptics'])if(typeof raw.settings[k]==='boolean')base.settings[k]=raw.settings[k];base.settings.volume=safeNumber(raw.settings.volume,.5,0,1);}
 if(raw.world&&typeof raw.world==='object')for(const k of ['createdAt','rejuvenation','mess','notes','lastAbsence'])base.world[k]=safeNumber(raw.world[k],base.world[k],0,k==='createdAt'?now:k==='rejuvenation'?90:k==='lastAbsence'?1e12:20);
 if(raw.missions&&typeof raw.missions==='object'){for(const k of ['read','feed','win'])base.missions[k]=safeNumber(raw.missions[k],0);base.missions.claimed=stringList(raw.missions.claimed);}
 if(raw.counts&&typeof raw.counts==='object')for(const k of ['read','correct'])base.counts[k]=safeNumber(raw.counts[k],0);
 if(raw.pets&&typeof raw.pets==='object')for(const id of ['owl','cat','moth']){const pet=raw.pets[id];if(pet&&typeof pet==='object')base.pets[id]={food:safeNumber(pet.food,80,0,100),fun:safeNumber(pet.fun,80,0,100),energy:safeNumber(pet.energy,80,0,100),outfit:['none','bow','cap'].includes(pet.outfit)?pet.outfit:'none',owned:stringList(pet.owned)};}
 if(raw.inventory&&typeof raw.inventory==='object')for(const id of ['snack','paper','eraser','care-serum'])base.inventory[id]=Math.floor(safeNumber(raw.inventory[id],0,0,999));
 if(Array.isArray(raw.diary))base.diary=raw.diary.filter(x=>x&&typeof x.text==='string'&&Number.isFinite(x.at)).slice(0,30).map(x=>({text:x.text.slice(0,240),at:safeNumber(x.at,now,0,now)}));
 if(raw.collection&&typeof raw.collection==='object')for(const [key,value]of Object.entries(raw.collection).slice(0,500)){if(key.length<150&&value&&typeof value.word==='string'&&Number.isFinite(value.at))Object.defineProperty(base.collection,key,{value:{word:value.word.slice(0,80),at:safeNumber(value.at,now,0,now)},enumerable:true,writable:true,configurable:true});}
 if(Array.isArray(raw.favorites))base.favorites=raw.favorites.filter(x=>x&&typeof x.name==='string').slice(0,8).map(x=>({name:x.name.slice(0,40),equipped:readOutfit(x.equipped)}));
 base.eventsClaimed=stringList(raw.eventsClaimed);base.tutorialDone=raw.tutorialDone===true;
 return base;
}
// localStorage can be unavailable in private contexts. Gameplay remains usable in memory.
export let storageMessage='';
export function load(key=SAVE_KEY,storage){try{const raw=(storage??globalThis.localStorage).getItem(key);return raw?normalize(JSON.parse(raw)):freshState();}catch{storageMessage='Não foi possível ler o progresso. Você pode jogar e importar uma cópia nas opções.';return freshState();}}
export function parseBackup(text){if(text.length>2000000)throw new Error('Arquivo muito grande. Use um backup do Caju de até 2 MB.');let raw;try{raw=JSON.parse(text);}catch{throw new Error('O arquivo não é um backup válido.');}if(raw?.game==='caju-biblioteca')raw=raw.state;if(!raw||raw.version!==1||!raw.stats||!Number.isFinite(raw.coins)||!Number.isFinite(raw.lastSeen))throw new Error('Este arquivo não contém um progresso válido do Caju.');return normalize(raw);}
export function save(state,key=SAVE_KEY,storage){try{(storage??globalThis.localStorage).setItem(key,JSON.stringify(state));return true;}catch{return false;}}
