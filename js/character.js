import{mood}from'./attributes.js';
// Replace these paths with new photographs or illustrations; missing states reuse base.
export const characterImages={base:'assets/carlos.png',happy:null,hungry:null,dirty:null,tired:null,sick:null,bored:null,sleeping:null};
export const quotes=['Silêncio, por favor… meu coração está lendo.','Isso merece uma anotação na margem!','Devolva o livro até a data indicada. E volte para um café!','Você é meu capítulo favorito de hoje.','Um livro aberto é um abraço esperando acontecer.','Psiu… carinho liberado na biblioteca.'];
export function renderCharacter(state,items){
 const m=mood(state);document.querySelector('#room').className='room '+m.id;
 document.querySelector('#portrait').src=characterImages[m.id]||characterImages.base;
 document.querySelector('#mood-label').textContent=m.label;
 document.querySelector('#state-badge').textContent=m.id==='happy'?'DE BEM COM A VIDA':m.label.toUpperCase();
 document.querySelector('#sleep-label').textContent=state.sleeping?'Acordar':'Dormir';
 const layer=document.querySelector('#outfit-layer');layer.replaceChildren();
 for(const [slot,id]of Object.entries(state.equipped)){const item=items.find(x=>x.id===id);if(!item||!state.owned.includes(id))continue;const el=document.createElement('span');el.className='wear '+slot;el.textContent=item.emoji;el.title=item.name;layer.append(el);}
 const effect=document.querySelector('#effect-layer');if(!effect.dataset.temporary)effect.innerHTML=m.effect?`<span class="effect">${m.effect}</span>`:'';
 const deco=document.querySelector('#decoration-layer');deco.replaceChildren();for(const id of state.decorations){const item=items.find(x=>x.id===id);if(!item||!state.owned.includes(id))continue;const el=document.createElement('span');el.className='room-decoration';el.textContent=item.emoji;deco.append(el);}
 return m;
}
export function say(text){document.querySelector('#speech').textContent=text;}
export function react(kind='heart'){
 const c=document.querySelector('#character');c.classList.remove('bounce');void c.offsetWidth;c.classList.add('bounce');setTimeout(()=>c.classList.remove('bounce'),650);
 const e=document.querySelector('#effect-layer');e.dataset.temporary='1';e.innerHTML=kind==='bath'?'<span class="bath-bubbles">🫧 🦆</span>':`<span class="effect">${kind==='heart'?'💕':kind}</span>`;
 clearTimeout(react.timer);react.timer=setTimeout(()=>{delete e.dataset.temporary;e.replaceChildren();},2400);
}
export function fillShelves(){const colors=['#8e9b7a','#bb8768','#737e72','#c3ad7a','#667e7b','#b9ad8e','#a66d55','#e0ce9d'];document.querySelectorAll('.shelf').forEach((s,k)=>{for(let row=0;row<3;row++){const r=document.createElement('div');r.className='shelf-row';for(let i=0;i<7;i++){const b=document.createElement('div');b.className='spine';b.style.cssText=`--height:${37+(i*11+row*7+k*3)%26}px;--width:${10+(i*3)%8}px;--color:${colors[(i+row*3+k)%colors.length]};--tilt:${i===5?-8:0}deg`;r.append(b);}s.append(r);}});}
