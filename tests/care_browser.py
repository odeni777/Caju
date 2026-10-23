"""Checks fitted outfits, care animations, real audio graph and mouse/touch bathing."""
import json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
 for mobile in [False,True]:
  context=b.new_context(viewport={'width':390 if mobile else 1440,'height':900},has_touch=mobile,is_mobile=mobile)
  page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  # Record actual Web Audio node starts, not calls to a stubbed sound module.
  page.add_init_script('''window.audioStarts=0;for(const klass of [OscillatorNode,AudioBufferSourceNode]){const start=klass.prototype.start;klass.prototype.start=function(...args){window.audioStarts++;return start.apply(this,args);};}''')
  page.goto('http://127.0.0.1:3000');page.wait_for_selector('.stat')
  page.add_init_script('''if(!sessionStorage.getItem('seeded')){const s=JSON.parse(localStorage.getItem('caju-biblioteca-v1'));s.coins=1000;s.owned=['glasses','bow','pajamas','beret'];s.equipped={glasses:'glasses',neck:'bow',body:'pajamas',hat:'beret'};s.stats.hygiene=20;localStorage.setItem('caju-biblioteca-v1',JSON.stringify(s));sessionStorage.setItem('seeded','1');}''');page.reload();page.wait_for_selector('.wear.glasses svg')
  for slot in ['glasses','neck','body','hat']:
   box=page.locator('.wear.'+slot).bounding_box();base=page.locator('#portrait').bounding_box()
   assert all(abs(box[k]-base[k])<1 for k in ['x','y','width','height']),(slot,box,base)
  page.screenshot(path=f'/tmp/caju-outfits-{mobile}.png',full_page=True)
  page.locator('#sound').click()
  assert page.locator('#sound').get_attribute('aria-pressed')=='true'
  page.locator('[data-action=food]').click();page.get_by_role('button',name='Maçã fresquinha',exact=False).click()
  assert not page.locator('#modal').is_visible()
  assert page.locator('#character').evaluate('(el)=>el.classList.contains("eating")')
  assert page.locator('.mouth-animation').evaluate('(el)=>getComputedStyle(el).display')!='none'
  page.wait_for_timeout(450)
  page.screenshot(path=f'/tmp/caju-eating-{mobile}.png')
  page.wait_for_timeout(1450)
  assert not page.locator('#character').evaluate('(el)=>el.classList.contains("eating")')
  page.locator('[data-action=sleep]').click();page.wait_for_timeout(450)
  assert float(page.locator('.eyelids').evaluate('(el)=>getComputedStyle(el).opacity'))==1
  page.screenshot(path=f'/tmp/caju-sleeping-{mobile}.png')
  page.reload();page.wait_for_selector('.stat');page.wait_for_timeout(450)
  assert float(page.locator('.eyelids').evaluate('(el)=>getComputedStyle(el).opacity'))==1
  page.locator('[data-action=sleep]').click();page.wait_for_timeout(450)
  assert float(page.locator('.eyelids').evaluate('(el)=>getComputedStyle(el).opacity'))==0
  page.locator('[data-action=bath]').click()
  assert page.locator('#care-panel').is_visible()
  assert page.evaluate('JSON.parse(localStorage.getItem("caju-biblioteca-v1")).stats.hygiene')<25
  if mobile:
   r=page.locator('#character').bounding_box();x=r['x']+r['width']*.3;y=r['y']+r['height']*.65
   cdp=context.new_cdp_session(page)
   cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
   for i in range(1,9):
    cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+r['width']*.04*i,'y':y}]})
   cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
   assert page.locator('#bath-progress').evaluate('(el)=>el.value')>0
  else:
   r=page.locator('#character').bounding_box();x=r['x']+r['width']*.25;y=r['y']+r['height']*.65
   page.mouse.move(x,y);page.mouse.down()
   for _ in range(3):
    page.mouse.move(x+r['width']*.5,y,steps=10);page.mouse.move(x,y,steps=10)
   page.mouse.up()
   assert page.locator('#bath-progress').evaluate('(el)=>el.value')>50
  while page.locator('#care-panel').is_visible():page.locator('#scrub-button').click()
  assert page.evaluate('JSON.parse(localStorage.getItem("caju-biblioteca-v1")).stats.hygiene')>99
  assert page.evaluate('window.audioStarts')>0
  page.locator('[data-action=bath]').click();page.locator('#cancel-bath').click()
  assert not page.locator('#care-panel').is_visible()
  page.locator('#sound').click();count=page.evaluate('window.audioStarts');page.locator('#character').click();assert page.evaluate('window.audioStarts')==count
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert not errors,errors
  print(json.dumps({'mobile':mobile,'fitted_outfits':True,'eating':True,'sleep_persists':True,'bath':True,'audio':True,'mute':True}))
  context.close()
 b.close()
