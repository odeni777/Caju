import{localDay,statKeys}from'./save.js';
export const statMeta={food:{name:'Fome',icon:'♨',color:'#c59b68'},hygiene:{name:'Higiene',icon:'♧',color:'#89a8a2'},energy:{name:'Energia',icon:'ϟ',color:'#c5af65'},fun:{name:'Diversão',icon:'☺',color:'#a494b2'},health:{name:'Saúde',icon:'♡',color:'#8aa27a'}};
export function changeStats(state,effects){for(const key of statKeys)state.stats[key]=Math.max(0,Math.min(100,state.stats[key]+(effects[key]||0)));}
// At most 4 hours of absence count. Caju never dies; tea always remains free.
export function advance(state,now=Date.now()){
 const minutes=Math.min(240,Math.max(0,(now-state.lastSeen)/60000));
 const s=state.stats;
 changeStats(state,{food:-minutes*.12,hygiene:-minutes*.08,energy:minutes*(state.sleeping?1.3:-.1),fun:-minutes*.1,health:((s.food<20||s.hygiene<20||s.energy<10)?-minutes*.1:0)});
 state.coins+=Math.floor(now/120000)-Math.floor((now-minutes*60000)/120000);
 state.lastSeen=now;
 if(state.day!==localDay(now)){state.day=localDay(now);state.rituals=[];state.dailyClaimed=false;}
}
export function mood(state){
 if(state.sleeping)return {id:'sleeping',label:'Sonhando com histórias',speech:'Zzz… só mais um capítulo nos sonhos.',effect:'💤'};
 if(state.stats.health<25)return {id:'sick',label:'Precisando de um chazinho',speech:'Um chá de camomila faz milagres…',effect:'🌡️'};
 if(state.stats.food<30)return {id:'hungry',label:'Com fome de histórias (e pão)',speech:'Páginas não enchem barriga. Um lanchinho?',effect:'🥐'};
 if(state.stats.hygiene<30)return {id:'dirty',label:'Hora de tirar a poeira',speech:'Acho que abracei uma estante empoeirada.',effect:'🫧'};
 if(state.stats.energy<25)return {id:'tired',label:'Só mais cinco minutinhos',speech:'Até bibliotecário precisa fechar os olhos…',effect:'🥱'};
 if(state.stats.fun<30)return {id:'bored',label:'À procura de uma aventura',speech:'Vamos brincar? Prometo não dar multa!',effect:'💭'};
 return {id:'happy',label:'Seu bibliotecário de bolso',speech:'Isso merece uma anotação na margem!',effect:''};
}
export function ritual(state,id){if(!state.rituals.includes(id))state.rituals.push(id);if(['feed','bath','play'].every(x=>state.rituals.includes(x))&&!state.dailyClaimed){state.dailyClaimed=true;state.markers++;return true;}return false;}
