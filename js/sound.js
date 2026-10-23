// Procedural Web Audio effects: no external downloads or autoplay permission needed.
export function createSound(isEnabled){
 let context;const voices=new Set();
 function unlock(){if(!isEnabled())return null;try{context??=new(window.AudioContext||window.webkitAudioContext)();if(context.state==='suspended')context.resume().catch(()=>{});return context;}catch{return null;}}
 function note(ctx,freq,start,duration,volume=.045,type='sine',end=freq){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,start);o.frequency.exponentialRampToValueAtTime(Math.max(20,end),start+duration);g.gain.setValueAtTime(.001,start);g.gain.linearRampToValueAtTime(volume,start+.015);g.gain.exponentialRampToValueAtTime(.001,start+duration);o.connect(g);g.connect(ctx.destination);voices.add(o);o.onended=()=>{voices.delete(o);o.disconnect();g.disconnect();};o.start(start);o.stop(start+duration+.02);}
 function noise(ctx,start,duration){const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=buffer;filter.type='bandpass';filter.frequency.value=1600;filter.Q.value=.6;g.gain.setValueAtTime(.001,start);g.gain.linearRampToValueAtTime(.035,start+.03);g.gain.exponentialRampToValueAtTime(.001,start+duration);src.connect(filter);filter.connect(g);g.connect(ctx.destination);voices.add(src);src.onended=()=>{voices.delete(src);src.disconnect();filter.disconnect();g.disconnect();};src.start(start);src.stop(start+duration+.01);}
 function play(name){const ctx=unlock();if(!ctx)return;const t=ctx.currentTime;
 if(name==='eat'){for(let i=0;i<3;i++){noise(ctx,t+i*.38,.12);note(ctx,160,t+i*.38,.13,.025,'triangle',90);}}
 else if(name==='drink'){for(let i=0;i<3;i++)note(ctx,330+i*70,t+i*.23,.18,.035,'sine',140);}
 else if(name==='scrub'){noise(ctx,t,.16);note(ctx,650,t,.11,.018,'sine',1050);}
 else if(name==='bath'){noise(ctx,t,.7);[700,950,1200].forEach((f,i)=>note(ctx,f,t+i*.15,.22,.025));}
 else if(name==='sleep'){[523,440,349,262].forEach((f,i)=>note(ctx,f,t+i*.2,.45,.03));}
 else if(name==='wake'){[262,330,392,523].forEach((f,i)=>note(ctx,f,t+i*.13,.3,.035));}
 else if(name==='pet'){[440,660,880].forEach((f,i)=>note(ctx,f,t+i*.09,.18,.028));}
 else if(name==='error')note(ctx,220,t,.2,.035,'sine',150);
 else [523,784].forEach((f,i)=>note(ctx,f,t+i*.1,.2));
 }
 function mute(){for(const voice of voices){try{voice.stop();}catch{}}voices.clear();}
 return{play,unlock,mute,get status(){return context?.state||'not-started';}};
}
