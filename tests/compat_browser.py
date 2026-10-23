"""Microphone refusal/unsupported paths, storage failures and narrow layout."""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for failure in ['denied','unsupported','storage']:
  c=b.new_context(viewport={'width':320,'height':780});page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  if failure=='denied':page.add_init_script("navigator.mediaDevices.getUserMedia=()=>Promise.reject(new DOMException('Denied','NotAllowedError'))")
  if failure=='unsupported':page.add_init_script("window.MediaRecorder=undefined")
  if failure=='storage':page.add_init_script("Storage.prototype.setItem=function(){throw new DOMException('Quota','QuotaExceededError')}")
  page.goto('http://127.0.0.1:3000');page.wait_for_selector('.stat');page.get_by_role('button',name='Entendi!',exact=True).click()
  if failure=='storage':
   assert 'indisponível' in page.locator('#save-status').inner_text()
   page.locator('[data-action=bath]').click();page.locator('#cancel-bath').click()
  else:
   page.locator('#feature-voice').click();page.locator('#record-voice').click()
   page.wait_for_function("/não autorizado|não oferece/.test(document.querySelector('#voice-status').textContent)")
   page.locator('#close-modal').click()
  page.locator('#feature-settings').click();page.locator('#setting-largeText').check();page.locator('#setting-dark').check();page.locator('#close-modal').click()
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),failure
  assert not errors,errors
  print(f'{failure}: fallback, continuing gameplay and 320px large-text layout OK',flush=True)
  c.close()
 b.close()
