"""Functional browser smoke test. Requires Python Playwright and Chromium."""
import json
from collections import deque
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1100},device_scale_factor=1)
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.goto('http://127.0.0.1:3000')
    page.wait_for_selector('.stat')
    page.screenshot(path='/tmp/caju-desktop.png',full_page=True)
    assert page.locator('[role=progressbar]').count()==5
    assert page.locator('#portrait').evaluate('(el)=>el.complete && el.naturalWidth>0')
    def close(): page.locator('#close-modal').click()
    def state(): return page.evaluate('JSON.parse(localStorage.getItem("caju-biblioteca-v1"))')
    def start(name):
        page.locator('[data-action=play]').click()
        page.get_by_role('button',name=name,exact=False).click()
        page.locator('#start-game').click()
    page.locator('[data-action=food]').click()
    page.get_by_role('button',name='Pão de queijo',exact=False).click()
    assert state()['stats']['food']>99
    assert state()['coins']==228
    close()
    page.locator('[data-action=bath]').click()
    assert state()['stats']['hygiene']==100
    page.locator('[data-action=sleep]').click()
    assert state()['sleeping']
    assert page.locator('#room').evaluate('(el)=>el.classList.contains("sleeping")')
    page.locator('[data-action=sleep]').click()
    assert not state()['sleeping']
    page.locator('[data-action=shop]').click()
    page.get_by_role('button',name='Gravata borboleta',exact=False).click()
    assert state()['equipped']['neck']=='bow'
    close()
    page.reload()
    page.wait_for_selector('.wear.neck')
    assert state()['coins']==163
    start('Um livro. Uma palavra.')
    for i in range(5):
        title=page.locator('.quiz-cover strong').inner_text()
        answer=page.evaluate('''async (title)=>{const {books}=await import('./js/books.js');return books.find(b=>b.title===title).answer;}''',title)
        page.get_by_role('button',name=answer,exact=True).click()
        page.locator('#next-book').click()
    assert '5 / 5' in page.locator('.result').inner_text()
    assert state()['gamesPlayed']==1
    assert state()['dailyClaimed']
    close()
    start('Organize a estante')
    codes={'Enciclopédia do saber':'000','Introdução à informática':'000','Manual de biblioteconomia':'000','Ética para todos':'100','O mundo das ideias':'100','Psicologia da memória':'100','Religiões do mundo':'200','Mitologia comparada':'200'}
    for i in range(8):
        name=page.locator('#sorting-book').inner_text().split('\n')[0]
        page.locator(f'.shelf-target[data-code="{codes[name]}"]').click()
        page.locator('#next-sort').click()
    assert '8 / 8' in page.locator('.result').inner_text()
    close()
    start('Anotação na margem')
    for word in ['livros','memória','histórias','biblioteca.']:
        page.get_by_role('button',name=word,exact=True).click()
    assert '4 / 4' in page.locator('.result').inner_text()
    close()
    start('Memória de capas')
    known={}
    for i in range(0,12,2):
        cards=page.locator('.memory-card')
        cards.nth(i).click()
        face=cards.nth(i).inner_text()
        known.setdefault(face,[]).append(i)
        cards.nth(i+1).click()
        other=cards.nth(i+1).inner_text()
        known.setdefault(other,[]).append(i+1)
        if face!=other: page.wait_for_timeout(800)
    for indices in known.values():
        if page.locator('.result').count(): break
        a,b=indices
        cards=page.locator('.memory-card')
        if cards.nth(a).is_disabled(): continue
        cards.nth(a).click()
        cards.nth(b).click()
    assert '6 / 6' in page.locator('.result').inner_text()
    close()
    start('Labirinto da biblioteca')
    walls=['0001000','1101010','0000010','0111100','0000101','0110000','0001100']
    q=deque([((0,0),[])])
    seen={(0,0)}
    route=None
    while q:
        (x,y),path=q.popleft()
        if (x,y)==(6,6): route=path;break
        for key,dx,dy in [('ArrowUp',0,-1),('ArrowDown',0,1),('ArrowLeft',-1,0),('ArrowRight',1,0)]:
            a,b=x+dx,y+dy
            if 0<=a<7 and 0<=b<7 and walls[b][a]=='0' and (a,b) not in seen:
                seen.add((a,b));q.append(((a,b),path+[key]))
    assert route
    for key in route: page.keyboard.press(key)
    assert page.locator('.result').count()==1
    assert state()['gamesPlayed']==5
    close()
    before=state()['coins']
    page.reload()
    page.wait_for_selector('.stat')
    assert state()['gamesPlayed']==5
    assert state()['coins']==before
    page.locator('[data-action=wardrobe]').click()
    page.get_by_role('button',name='Gravata borboleta',exact=False).click()
    assert 'neck' not in state()['equipped']
    close()
    page.set_viewport_size({'width':390,'height':844})
    page.screenshot(path='/tmp/caju-mobile.png',full_page=True)
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    for action in ['food','shop','wardrobe']:
        page.locator(f'[data-action={action}]').click()
        assert page.locator('#modal').is_visible()
        close()
    assert not errors,errors
    print(json.dumps({'games_completed':5,'errors':errors,'mobile_overflow':False,'saved_after_reload':True,'screenshots':['/tmp/caju-desktop.png','/tmp/caju-mobile.png']},ensure_ascii=False))
    browser.close()
