import{extras,available}from'./catalog.js';
export const foods=[
{id:'coffee',name:'Café coado',emoji:'☕',price:8,effects:{energy:22,food:8},description:'+22 energia · +8 fome'},
{id:'cheese',name:'Pão de queijo',emoji:'🧀',price:12,effects:{food:30,fun:5},description:'+30 fome · +5 diversão'},
{id:'biscuit',name:'Biscoito de polvilho',emoji:'🥨',price:9,effects:{food:22,fun:5},description:'+22 fome · +5 diversão'},
{id:'apple',name:'Maçã fresquinha',emoji:'🍎',price:10,effects:{food:25,health:8,fun:4},description:'+25 fome · +8 saúde · +4 diversão'},
{id:'cake',name:'Bolo de rolo',emoji:'🍰',price:16,effects:{food:35,fun:12},description:'+35 fome · +12 diversão'},
{id:'tea',name:'Chá de camomila',emoji:'🍵',price:0,effects:{health:100,energy:8},description:'Cura o Caju · sempre grátis'},
{id:'cookie',name:'Cookie Decimal 000',emoji:'🍪',price:18,effects:{food:22,energy:30,fun:6},description:'+22 fome · +30 energia · +6 diversão'}];
export const items=[
{id:'bow',name:'Gravata borboleta',emoji:'🎀',category:'Roupas',slot:'neck',price:65},
{id:'glasses',name:'Óculos de leitura',emoji:'👓',category:'Roupas',slot:'glasses',price:80},
{id:'tweed',name:'Suéter de tweed',emoji:'🧥',category:'Roupas',slot:'body',price:110},
{id:'beret',name:'Boina literária',emoji:'🎓',category:'Roupas',slot:'hat',price:90},
{id:'vest',name:'Colete de bibliotecário',emoji:'🦺',category:'Roupas',slot:'body',price:100},
{id:'cardigan',name:'Cardigã mostarda',emoji:'👔',category:'Roupas',slot:'body',price:120},
{id:'explorer',name:'Chapéu de explorador',emoji:'🤠',category:'Roupas',slot:'hat',price:3,rare:true},
{id:'raincoat',name:'Capa de chuva',emoji:'🧥',category:'Roupas',slot:'body',price:135},
{id:'pajamas',name:'Pijama de estantes',emoji:'👕',category:'Roupas',slot:'body',price:4,rare:true},
{id:'magnify',name:'Lupa de pesquisador',emoji:'🔎',category:'Acessórios',slot:'hand',price:70},
{id:'pen',name:'Caneta-tinteiro',emoji:'🖋️',category:'Acessórios',slot:'hand',price:2,rare:true},
{id:'bookmark',name:'Marcador de página',emoji:'🔖',category:'Acessórios',slot:'hand',price:50},
{id:'scarf',name:'Lenço de leitura',emoji:'🧣',category:'Acessórios',slot:'neck',price:65},
{id:'watch',name:'Relógio de bolso',emoji:'⏱️',category:'Acessórios',slot:'hand',price:3,rare:true},
{id:'bookshelf',name:'Estante de clássicos',emoji:'📚',category:'Decoração',price:100},
{id:'armchair',name:'Poltrona de leitura',emoji:'🛋️',category:'Decoração',price:130},
{id:'lamp',name:'Abajur aconchegante',emoji:'💡',category:'Decoração',price:75},
{id:'rug',name:'Tapete de histórias',emoji:'🟫',category:'Decoração',price:85},
{id:'map',name:'Mapa antigo',emoji:'🗺️',category:'Decoração',price:2,rare:true},
{id:'globe',name:'Globo de aventuras',emoji:'🌍',category:'Decoração',price:110},
{id:'ladder',name:'Escada de biblioteca',emoji:'🪜',category:'Decoração',price:125},...extras];
export function purchase(state,item){if(!available(item)||(!item.consumable&&state.owned.includes(item.id)))return false;const key=item.rare?'markers':'coins';if(state[key]<item.price)return false;state[key]-=item.price;if(item.consumable)state.inventory[item.id]=Math.min(999,(state.inventory[item.id]||0)+1);else state.owned.push(item.id);return true;}
export function equip(state,item){if(!state.owned.includes(item.id))return;if(item.category==='Decoração'){if(state.decorations.includes(item.id))state.decorations=state.decorations.filter(x=>x!==item.id);else state.decorations.push(item.id);}else if(state.equipped[item.slot]===item.id)delete state.equipped[item.slot];else state.equipped[item.slot]=item.id;}
