"""Full new-feature flows, four extra games, local mic lifecycle and offline shell."""
import json,time
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--autoplay-policy=no-user-gesture-required'])
 context=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,permissions=['microphone'],accept_downloads=True)
 page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.add_init_script('''if(navigator.mediaDevices){const real=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);window.micRequests=0;navigator.mediaDevices.getUserMedia=async opts=>{window.micRequests++;const stream=await real(opts);window.testStream=stream;return stream;};}''')
 page.goto('http://127.0.0.1:3000');page.wait_for_selector('.stat');page.get_by_role('button',name='Entendi!',exact=True).click()
 # Seed a rich save before app initialization, without racing pagehide's autosave.
 page.add_init_script('''if(!sessionStorage.getItem('seeded-expansion')){const s=JSON.parse(localStorage.getItem('caju-biblioteca-v1'));s.coins=3000;s.markers=20;s.world.mess=4;s.world.notes=3;s.world.createdAt=Date.now()-8*604800000;localStorage.setItem('caju-biblioteca-v1',JSON.stringify(s));sessionStorage.setItem('seeded-expansion','1');}''')
 page.reload();page.wait_for_selector('.stat')
 def saved():return page.evaluate('JSON.parse(localStorage.getItem("caju-biblioteca-v1"))')
 def close():page.locator('#close-modal').click()
 def shop(cat,name):
  page.locator('[data-action=shop]').click();page.get_by_role('button',name=cat,exact=True).click();page.get_by_role('button',name=name,exact=False).click();close()
 def start(name):
  page.locator('[data-action=play]').click();page.get_by_role('button',name=name,exact=False).click();page.locator('#start-game').click()
 assert page.evaluate('window.micRequests')==0
 for name in ['Petiscos dos pets','Papel velho para traça','Borracha de margens','Elixir de boas histórias']:shop('Suprimentos',name)
 page.locator('#feature-pets').click()
 for i in range(3):page.get_by_role('button',name='Adotar',exact=False).first.click()
 assert len(saved()['pets'])==3;print('Pets adopted',flush=True)
 page.locator('#modal-body').get_by_role('button',name='Alimentar',exact=False).first.click()
 assert saved()['pets']['owl']['food']==100
 page.get_by_role('button',name='Usar laço',exact=False).first.click()
 assert saved()['pets']['owl']['outfit']=='bow'
 close();assert page.locator('.room-pet').count()==3
 page.locator('#feature-clean').click();page.locator('#tidy').click();page.locator('#erase-notes').click();page.locator('#rejuvenate').click();close()
 assert saved()['world']['mess']<1 and saved()['world']['notes']<1
 assert saved()['world']['rejuvenation']>=4
 shop('Penteados','Cabelo ondulado');shop('Cores de cabelo','Prata da biblioteca');shop('Fantasias','Pirata de mapas')
 page.locator('[data-action=wardrobe]').click();page.locator('#outfit-name').fill('Meu look de aventuras');page.locator('#save-outfit').click();assert len(saved()['favorites'])==1;assert page.locator('.outfit-preview').count()==1;close()
 print('Supplies, cleaning, hair, costumes and favorites passed',flush=True)
 # Additional games: each reaches a result and records a diary entry.
 start('Pesca de letras')
 for _ in range(6):
  letter=page.locator('#fish-target').inner_text();page.locator(f'[data-letter="{letter}"]').tap(force=True)
 assert '6 / 6' in page.locator('.result').inner_text();close()
 start('Páginas rasgadas')
 for pos in range(6):
  if page.locator('.result').count():break
  pieces=page.locator('.page-piece');order=pieces.evaluate_all('(nodes)=>nodes.map(n=>Number(n.dataset.fragment))')
  if order[pos]!=pos:
   pieces.nth(pos).click();page.locator('.page-piece').nth(order.index(pos)).click()
 assert '6 / 6' in page.locator('.result').inner_text();close()
 start('Ritmo do carimbo')
 for _ in range(8):
  page.wait_for_function('''()=>{const el=document.querySelector('#rhythm-dot');if(!el)return false;const x=parseFloat(el.style.left);return x>42&&x<58;}''')
  page.locator('#stamp-button').click()
  page.wait_for_timeout(430)
 page.wait_for_selector('.result',timeout=12000);assert '8' in page.locator('.result').inner_text();close()
 start('Corrida do carrinho');page.locator('#cart-left').click();page.locator('#cart-right').click();page.wait_for_selector('.result',timeout=25000);close()
 assert saved()['gamesPlayed']==4;print('Four new games completed',flush=True)
 page.locator('#feature-diary').click();assert page.locator('.diary-list li').count()>=4;close()
 # Discover a real book and verify missions / personal shelf.
 start('Um livro. Uma palavra.')
 for _ in range(5):
  title=page.locator('.quiz-cover strong').inner_text();answer=page.evaluate('''async title=>{const {books}=await import('./js/books.js');return books.find(b=>b.title===title).answer;}''',title)
  page.get_by_role('button',name=answer,exact=True).click();page.locator('#next-book').click()
 close();assert len(saved()['collection'])==5
 page.locator('#feature-collection').click();assert page.locator('.collection-book:not(.locked)').count()==5;assert page.locator('.collection-book.locked').count()==25;close()
 page.locator('#feature-missions').click();page.get_by_role('button',name='Receber',exact=True).first.click();assert 'read' in saved()['missions']['claimed'];close()
 # Separate settings and backup download/import.
 page.locator('#feature-settings').click();page.locator('#setting-dark').check();page.locator('#setting-largeText').check();page.locator('#setting-music').check();page.locator('#setting-volume').fill('0.3')
 assert page.locator('body').evaluate('(el)=>el.classList.contains("dark-mode")&&el.classList.contains("large-text")')
 with page.expect_download() as d:page.locator('#export-save').click()
 path=d.value.path();assert json.load(open(path))['state']['favorites'][0]['name']=='Meu look de aventuras'
 page.locator('#import-save').set_input_files({'name':'bad.txt','mimeType':'text/plain','buffer':b'nope'});assert 'válido' in page.locator('#backup-status').inner_text()
 page.locator('#import-save').set_input_files(str(path));page.locator('#confirm-import').click();assert 'sucesso' in page.locator('#backup-status').inner_text();close()
 print('Collection, missions and backup round trip passed',flush=True)
 # Microphone is never requested automatically. Actual MediaRecorder uses Chromium's fake device.
 page.locator('#feature-voice').click();assert page.evaluate('window.micRequests')==0
 page.locator('#record-voice').click();page.wait_for_function('window.testStream&&window.testStream.active');page.wait_for_timeout(1300);page.locator('#stop-voice').click()
 page.wait_for_function('window.testStream.getTracks().every(t=>t.readyState==="ended")')
 page.wait_for_selector('.voice-portrait.speaking',timeout=10000)
 assert page.evaluate('window.micRequests')==1
 page.locator('#delete-voice').click();assert page.locator('#replay-voice').is_disabled()
 page.locator('#disable-mic').click();assert not saved()['settings']['voice'];close()
 # Offline new navigation uses the service-worker app shell, including the portrait and modules.
 page.evaluate('navigator.serviceWorker.ready.then(()=>true)');page.wait_for_function('navigator.serviceWorker.controller!==null')
 page.reload();page.wait_for_selector('.stat');context.set_offline(True);page.reload();page.wait_for_selector('.stat');assert page.locator('#portrait').evaluate('(el)=>el.complete&&el.naturalWidth>0')
 page.locator('#feature-pets').click();assert page.locator('.pet-card').count()==3;close()
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.screenshot(path='/tmp/caju-expanded-mobile.png',full_page=True)
 assert not errors,errors
 print(json.dumps({'extra_games_completed':4,'pets':3,'collection':5,'favorites':True,'backup_import_export':True,'local_recording_playback':True,'microphone_tracks_stopped':True,'offline_reload':True,'mobile_overflow':False}))
 b.close()
