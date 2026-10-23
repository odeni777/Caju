"""Player selection, legacy migration, save isolation, two tabs and offline."""
import json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':390,'height':844},accept_downloads=True)
 page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:3000');page.wait_for_selector('#profile-picker[open]')
 assert page.locator('#profile-list button').count()==1
 assert page.evaluate('localStorage.getItem("caju-biblioteca-v1")') is None
 page.locator('[data-player="main"]').click()
 assert page.locator('#player-name').inner_text()=='Meu Caju'
 def close():page.locator('#close-modal').click()
 def chooser():page.locator('#player-button').click()
 def create(name):
  chooser();page.locator('#new-profile-name').fill(name);page.locator('#create-profile-form button').click()
 def current():return page.evaluate('sessionStorage.getItem("caju-current-player")')
 def state(id=None):
  return page.evaluate('''id=>JSON.parse(localStorage.getItem(id==='main'?'caju-biblioteca-v1':'caju-biblioteca-v1:player:'+id))''',id or current())
 def switch(id):chooser();page.locator(f'[data-player="{id}"]').click()
 # Existing main progress is preserved, Alice's purchases never spend Bob's money.
 page.locator('[data-action=shop]').click();page.get_by_role('button',name='Gravata borboleta',exact=False).click();close()
 assert state('main')['coins']==175
 create('Alice');alice=current();assert alice!='main';assert state()['coins']==240
 page.locator('[data-action=food]').click();page.get_by_role('button',name='Pão de queijo',exact=False).click()
 assert state()['coins']==228 and len(state()['diary'])==1
 page.wait_for_timeout(1900)
 create('Beto');bob=current();assert bob not in ['main',alice];assert state()['coins']==240;assert state()['owned']==[];assert state()['diary']==[]
 switch('main');assert 'bow' in state()['owned'];assert state()['coins']==175
 switch(alice);assert state()['coins']==228;assert len(state()['diary'])==1
 chooser();page.locator('#current-profile-name').fill('Alice Leitora');page.locator('#rename-profile-form button').click();page.locator('#close-profiles').click();assert current()==alice;assert page.locator('#player-name').inner_text()=='Alice Leitora'
 page.reload();page.wait_for_selector('.stat');assert not page.locator('#profile-picker').is_visible();assert current()==alice
 # Duplicate name errors stay in the chooser and no new state is created.
 chooser();page.locator('#new-profile-name').fill('beto');page.locator('#create-profile-form button').click();assert 'Já existe' in page.locator('#profile-status').inner_text();assert page.locator('#profile-list button').count()==3;page.locator('#close-profiles').click()
 # Export belongs to Alice. Import into Bob changes Bob only, never Alice or main.
 page.locator('#feature-settings').click()
 with page.expect_download() as download:page.locator('#export-save').click()
 backup=download.value.path();export=json.load(open(backup));assert export['player']=='Alice Leitora';assert export['state']['coins']==228
 close();switch(bob);page.locator('#feature-settings').click();page.locator('#import-save').set_input_files(str(backup));page.locator('#confirm-import').click();assert state()['coins']==228;close()
 assert state('main')['coins']==175;assert state(alice)['coins']==228
 # Another tab starts with a chooser, and its current profile stays independent.
 other=context.new_page();other.on('pageerror',lambda e:errors.append(str(e)));other.goto('http://127.0.0.1:3000');other.wait_for_selector('#profile-picker[open]');other.locator(f'[data-player="{alice}"]').click()
 page.locator('[data-action=shop]').click();page.get_by_role('button',name='Gravata borboleta',exact=False).click();close()
 assert state(bob)['coins']==163;assert state(alice)['coins']==228
 other.locator('[data-action=food]').click();other.get_by_role('button',name='Maçã fresquinha',exact=False).click()
 assert state(alice)['coins']==218;assert state(bob)['coins']==163;assert state('main')['coins']==175
 # Refresh and offline both keep this tab on Bob.
 page.evaluate('navigator.serviceWorker.ready');page.wait_for_function('navigator.serviceWorker.controller!==null');context.set_offline(True);page.reload();page.wait_for_selector('.stat');assert current()==bob;assert state()['coins']==163
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.screenshot(path='/tmp/caju-profiles-mobile.png',full_page=True)
 chooser();page.screenshot(path='/tmp/caju-player-picker.png');page.locator('#close-profiles').click()
 page.set_viewport_size({'width':320,'height':780});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 assert not errors,errors
 print(json.dumps({'profiles':3,'legacy_preserved':True,'separate_inventory_and_diary':True,'rename':True,'backup_per_player':True,'tabs_isolated':True,'offline':True,'mobile_320px':True}))
 browser.close()
