import{createFeatures}from'./features.js';
import{createMusic}from'./music.js';
import{available}from'./catalog.js';
import{createSound}from'./sound.js';
import{createCare}from'./care.js';
import{actionIcon}from'./icons.js';
import{load,save,statKeys,storageMessage}from'./save.js';
import{advance,changeStats,statMeta,mood,ritual}from'./attributes.js';
import{renderCharacter,say,react,quotes,fillShelves}from'./character.js';
import{foods,items,purchase,equip}from'./shop.js';
import{createMinigames,games}from'./minigames.js';
document.querySelectorAll('[data-action]').forEach(b=>b.querySelector('.action-icon').innerHTML=actionIcon(b.dataset.action));
const state=load();advance(state);const $=s=>document.querySelector(s);const modal=$('#modal'),body=$('#modal-body'),title=$('#modal-title');
let features,storageWarned=false;
const sound=createSound(()=>state.sound,()=>state.settings.volume);
const music=createMusic(()=>state.settings);
function tone(ok=true){sound.play(ok?'success':'error');}
const care=createCare({sound,onBathComplete(){changeStats(state,{hygiene:100,fun:8,health:3});completeRitual('bath');features?.event('bath');render();say('Limpinho! Até a poeira dos clássicos saiu.');react('bath');toast('Banho completo! Caju está limpinho.');},onBathCancel(){say('O sabão fica aqui para quando você quiser continuar.');}});
function persist(){const ok=save(state);$('#save-status').textContent=ok?'✓ Progresso salvo':'⚠ Salvamento indisponível';if(!ok&&!storageWarned){storageWarned=true;toast('Não foi possível salvar neste navegador. Exporte seu progresso em Opções antes de sair.');}if(ok)storageWarned=false;}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('visible'),3200);}
function render(){
 $('#coins').textContent=state.coins.toLocaleString('pt-BR');$('#markers').textContent=state.markers;
 $('#stats').innerHTML=statKeys.map(key=>{const m=statMeta[key],value=Math.round(state.stats[key]);return `<div class="stat" style="--bar:${m.color}"><div class="stat-heading"><span class="stat-symbol">${m.icon}</span><span>${m.name}</span><span class="stat-value">${value}<span style="opacity:.5">/100</span></span></div><div class="bar" role="progressbar" aria-label="${m.name}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}"><span style="width:${value}%"></span></div></div>`;}).join('');
 const m=renderCharacter(state,items);$('#sound').classList.toggle('sound-on',state.sound);$('#sound').setAttribute('aria-label',state.sound?'Desligar sons':'Ligar sons');$('#sound').setAttribute('aria-pressed',String(state.sound));$('#sound').title=state.sound?'Desligar sons':'Ligar sons';
 $('#rituals').innerHTML=[['feed','Um lanchinho para o Caju','Alimentar'],['bath','Um banho bem quentinho','Banho'],['play','Uma partida para se divertir','Brincar']].map(([id,label,action])=>`<div class="ritual ${state.rituals.includes(id)?'done':''}"><span class="ritual-check">${state.rituals.includes(id)?'✓':''}</span><span>${label}</span><small>${action}</small></div>`).join('');
 $('#room-note').textContent=state.sleeping?'Abajur aceso, sonhos de páginas novas.':'Carinho também faz parte da rotina.';features?.render();persist();return m;
}
function completeRitual(id){if(ritual(state,id))toast('Rituais do dia completos! +1 marcador ✧');}
function achievement(id,message){if(state.achievements.includes(id))return;state.achievements.push(id);state.markers++;toast(`Conquista: ${message} · +1 marcador`);}
const mini=createMinigames({body,title,react,say,tone,onBook(book){features.event('book',book);render();},reward(coins,markers,result){state.coins+=coins;state.markers+=markers;state.gamesPlayed++;features.event('result',result);changeStats(state,{fun:25,energy:-4,food:-3});completeRitual('play');if(state.gamesPlayed===1)achievement('first-game','Primeiro capítulo');if(state.gamesPlayed===5)achievement('five-games','Leitor de carteirinha');render();}});
function open(name){features?.close();care.cancelBath();mini.stop();title.textContent=name;body.replaceChildren();if(!modal.open)modal.showModal();}
$('#close-modal').onclick=()=>modal.close();modal.addEventListener('close',()=>{mini.stop();features?.close();});modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close();}});
function awake(){if(!state.sleeping)return true;toast('O Caju está dormindo. Acorde-o antes de brincar ou comer.');return false;}
function foodMenu(){open('Uma pausa gostosa');body.innerHTML='<p>Escolha um carinho em forma de lanche. O chá da casa é sempre por nossa conta.</p><div class="item-grid"></div>';foods.forEach(food=>{const b=document.createElement('button');b.className='item-card';b.innerHTML=`<span class="emoji">${food.emoji}${food.id==='cookie'?'<small>000</small>':''}</span><strong>${food.name}</strong><small>${food.description}</small><span class="price">${food.price?food.price+' moedas':'Grátis · cura a doença'}</span>`;b.onclick=()=>{advance(state);if(!awake())return;if(care.eating){toast('Espere o Caju terminar de mastigar.');return;}if(state.coins<food.price){toast('Faltam moedas. Que tal um minigame?');return;}state.coins-=food.price;changeStats(state,food.effects);completeRitual('feed');features?.event('feed',food);render();say(food.id==='tea'?'Chá, carinho e saúde renovada.':`Hmm… ${food.name.toLowerCase()} e um bom livro!`);modal.close();care.eat(food);toast(`${food.name}: servido com carinho!`);};body.querySelector('.item-grid').append(b);});}
function shopMenu(category='Roupas',wardrobe=false){
 open(wardrobe?'O seu jeito de ser Caju':'Pequenas descobertas');
 body.innerHTML=`<p>${wardrobe?'Use ou retire peças. As combinações favoritas guardam até oito looks.':'Peças raras mudam às segundas. Roupas sazonais seguem o calendário do hemisfério sul. Suprimentos podem ser comprados várias vezes.'}</p><div class="tabs"></div><div class="item-grid"></div>`;
 const categories=['Roupas','Acessórios','Decoração','Penteados','Cores de cabelo','Fantasias','Sazonais','Rotação semanal',...(!wardrobe?['Suprimentos']:[])];
 for(const cat of categories){const b=document.createElement('button');b.textContent=cat;b.classList.toggle('active',cat===category);b.onclick=()=>shopMenu(cat,wardrobe);body.querySelector('.tabs').append(b);}
 const filtered=items.filter(x=>x.category===category&&(wardrobe?state.owned.includes(x.id):available(x)||state.owned.includes(x.id)));
 if(!filtered.length)body.querySelector('.item-grid').innerHTML='<p class="empty">Ainda não há peças aqui. Explore as outras categorias ou volte à loja.</p>';
 for(const item of filtered){const owned=state.owned.includes(item.id),active=item.category==='Decoração'?state.decorations.includes(item.id):state.equipped[item.slot]===item.id;const b=document.createElement('button');b.className='item-card'+(active?' selected':'');b.innerHTML=`<span class="emoji">${item.emoji}</span><strong>${item.name}</strong><small>${item.consumable?`No estoque: ${state.inventory[item.id]||0}`:item.rare?'✧ Coleção rara':item.months?'Disponível nesta estação':'Coleção da biblioteca'}</small><span class="price">${owned?(active?'✓ Em uso · toque para tirar':'Seu · toque para usar'):`${item.price} ${item.rare?'marcadores':'moedas'}`}</span>`;
 b.onclick=()=>{advance(state);if(!owned){if(!purchase(state,item)){toast('Faltam moedas ou marcadores, ou a oferta já terminou.');return;}toast(item.consumable?'Suprimento guardado! Use nos pets ou em Arrumar biblioteca.':`${item.name} agora é seu!`);}if(!item.consumable)equip(state,item);tone();render();shopMenu(category,wardrobe);};body.querySelector('.item-grid').append(b);}
 if(wardrobe)body.append(features.favoritePanel());
}

function sleep(){care.stop();advance(state);state.sleeping=!state.sleeping;if(state.sleeping){say('O abajur fica aceso. Boa noite, mundo dos livros.');react('🛏️');care.particles('sleep');}else{say('Aaah… bom dia! Onde eu parei a leitura?');react('🥱');}render();sound.play(state.sleeping?'sleep':'wake');}
function bath(){if(!awake())return;if(care.bathing){toast('Esfregue o sabão no Caju ou use o botão abaixo da sala.');return;}care.startBath();say('Pegue o sabão e esfregue! Sem molhar os livros.');toast('Arraste sobre o Caju para ensaboar.');}
function play(){if(!awake())return;open('Histórias para brincar');mini.menu();}
const actions={food:foodMenu,bath,sleep,play,shop:()=>shopMenu(),wardrobe:()=>shopMenu('Roupas',true)};document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{advance(state);actions[b.dataset.action]();});
$('#decorate').onclick=()=>shopMenu('Decoração');$('#featured-play').onclick=()=>{if(!awake())return;open(games[0].name);mini.intro(games[0]);};
let lastPet=0;$('#character').onclick=()=>{if(care.bathing||care.eating)return;if(state.sleeping){say('Zzz… obrigado pela visita… zzz.');return;}state.world.lastAbsence=0;say(quotes[Math.floor(Math.random()*quotes.length)]);react();sound.play('pet');if(Date.now()-lastPet>3000){changeStats(state,{fun:2});lastPet=Date.now();render();}};
$('#sound').onclick=()=>{state.sound=!state.sound;if(!state.sound)sound.mute();render();tone();toast(state.sound?'Sons suaves ligados':'Sons desligados');};
function help(){open('Bem-vindo à sua biblioteca');body.innerHTML='<p>Este é o <strong>Caju</strong>, seu bibliotecário de bolso inspirado no Carlos Henrique Juvêncio. Os óculos, o cabelo e o retrato foram criados a partir das fotos enviadas.</p><p>Cuide da fome, higiene, energia, diversão e saúde. Alimente e veja o Caju mastigar. No banho, arraste o sabão sobre ele ou use Esfregar sabão. Deixe dormir e descubra histórias nos nove minigames. Toque no Caju para fazer carinho.</p><p>Ganhe moedas jogando ou com o tempo. Marcadores vêm de bons resultados, conquistas e dos três rituais diários. Roupas e decoração compradas ficam no guarda-roupa.</p><p>Ative os sons no botão ♪: cada cuidado tem seu próprio som. O progresso é salvo automaticamente neste navegador. A ausência conta por até quatro horas: o Caju pode adoecer, mas nunca morre. O chá de camomila é grátis e sempre cura.</p><p class="notice">A barra de Fome indica saciedade: quanto mais cheia, mais bem alimentado ele está. O sono recupera energia com o tempo, mesmo com o jogo fechado.</p>';}
$('#help').onclick=help;$('#about').onclick=help;
features=createFeatures({state,open,body,title,render,persist,toast,sound,music,care,items});
fillShelves();render();
if(storageMessage)toast(storageMessage);
const loading=document.querySelector('#loading-screen');Promise.race([document.querySelector('#portrait').decode().catch(()=>{}),new Promise(r=>setTimeout(r,2000))]).then(()=>{loading.classList.add('loaded');setTimeout(()=>loading.remove(),400);});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();window.cajuInstallPrompt=e;});
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>toast('O modo offline não está disponível neste navegador.'));
const initial=mood(state);if(initial.id!=='happy')say(initial.speech);
let lastMood=initial.id;setInterval(()=>{advance(state);const m=render();if(m.id!==lastMood){say(m.speech);lastMood=m.id;}},5000);
function checkpoint(){advance(state);persist();}window.addEventListener('pagehide',checkpoint);document.addEventListener('visibilitychange',()=>{if(document.hidden)checkpoint();else{advance(state);render();}});
