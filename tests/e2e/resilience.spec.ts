import { expect, test } from '@playwright/test'

test.beforeEach(({page})=>{page.on('pageerror',error=>{throw error})})

test('stale agenda editors cannot overwrite another tab and mobile editors precede results',async({page,context})=>{
  await page.setViewportSize({width:390,height:844})
  await page.goto('/en/agenda/?new=1')
  await page.getByRole('textbox',{name:'Title',exact:true}).fill('Shared reading')
  await page.getByRole('textbox',{name:'Your note',exact:true}).fill('Original note')
  await page.getByRole('button',{name:'Save',exact:true}).click()
  await page.getByRole('button',{name:'Edit',exact:true}).click()
  const editor=page.locator('#agenda-editor')
  const row=page.getByRole('article')
  expect((await editor.boundingBox())!.y).toBeLessThan((await row.boundingBox())!.y)
  await page.getByRole('textbox',{name:'Your note',exact:true}).fill('Older editor draft')
  const second=await context.newPage()
  await second.goto('/en/agenda/')
  await second.getByRole('button',{name:'Edit',exact:true}).click()
  await second.getByRole('textbox',{name:'Your note',exact:true}).fill('Newer work in another tab')
  await second.getByRole('button',{name:'Save',exact:true}).click()
  await expect(row).toContainText('Newer work in another tab')
  await page.getByRole('button',{name:'Save',exact:true}).click()
  await expect(editor.getByRole('alert')).toContainText('changed in another tab')
  await expect(page.getByRole('textbox',{name:'Your note',exact:true})).toHaveValue('Older editor draft')
  await expect(row).toContainText('Newer work in another tab')
  await second.close()
})

test('temporary agenda saves can be retried and unsafe UTF-8 imports are atomic',async({page})=>{
  await page.goto('/en/agenda/?new=1')
  await page.getByRole('textbox',{name:'Title',exact:true}).fill('Temporary work')
  await page.evaluate(()=>{
    const original=Storage.prototype.setItem
    Object.defineProperty(window,'restoreStorage',{value:()=>{Storage.prototype.setItem=original},configurable:true})
    Storage.prototype.setItem=function(key,value){if(key==='swi-agenda-v1')throw new DOMException('Full','QuotaExceededError');original.call(this,key,value)}
  })
  await page.getByRole('button',{name:'Save',exact:true}).click()
  await expect(page.locator('.wb-agenda-info')).toContainText('Temporary session')
  await page.evaluate(()=>{(window as unknown as {restoreStorage:()=>void}).restoreStorage()})
  await page.getByRole('button',{name:'Retry saving',exact:true}).click()
  await page.reload()
  await expect(page.getByRole('article')).toContainText('Temporary work')
  const before=await page.evaluate(()=>localStorage.getItem('swi-agenda-v1'))
  await page.getByLabel('Import agenda file').setInputFiles([
    {name:'valid.md',mimeType:'text/markdown',buffer:Buffer.from('# Valid note')},
    {name:'invalid.txt',mimeType:'text/plain',buffer:Buffer.from([0xc3,0x28])},
  ])
  await expect(page.getByRole('main').getByRole('alert')).toContainText('Import failed')
  expect(await page.evaluate(()=>localStorage.getItem('swi-agenda-v1'))).toBe(before)
})

test('recipe drafts survive language switches and reloads without duplicating agenda plans',async({page})=>{
  await page.goto('/en/recipes/bees/')
  await page.getByRole('textbox',{name:'Your task',exact:true}).fill('Evaluate these architectures against the same acceptance tests.')
  await page.getByRole('spinbutton',{name:'Agent count',exact:true}).fill('11')
  await page.getByRole('spinbutton',{name:/Total token budget/}).fill('18007')
  await page.getByRole('navigation',{name:'Language',exact:true}).getByRole('link',{name:'TR',exact:true}).click()
  await expect(page.getByRole('spinbutton',{name:'Agent sayısı',exact:true})).toHaveValue('11')
  await page.reload()
  await expect(page.getByRole('textbox',{name:'Görevin',exact:true})).toHaveValue('Evaluate these architectures against the same acceptance tests.')
  await page.getByRole('button',{name:'Görev paketini hazırla',exact:true}).click()
  await page.getByRole('button',{name:'JSON',exact:true}).click()
  const pkg=JSON.parse(await page.locator('.wb-code').innerText())
  expect(pkg.budget.aggregateTokenLimit).toBe(18007)
  expect(pkg.agents).toHaveLength(11)
  await page.getByRole('button',{name:'Deney planını gündeme ekle',exact:true}).click()
  await expect(page.getByRole('button',{name:'Gündemde',exact:true})).toBeDisabled()
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('swi-agenda-v1')!).entries.length)).toBe(1)
})

test('invalid category parameters fall back and agenda filters survive language switching',async({page})=>{
  for(const category of ['__proto__','constructor','toString']) {
    await page.goto(`/en/atlas/?category=${category}`)
    await expect(page.locator('.wb-dossier-row')).toHaveCount(8)
    await expect(page.getByRole('button',{name:'All',exact:true})).toHaveAttribute('aria-pressed','true')
  }
  await page.goto('/en/agenda/?status=reading&q=notes')
  await expect(page.getByRole('searchbox',{name:'Search my agenda'})).toHaveValue('notes')
  await page.getByRole('navigation',{name:'Language',exact:true}).getByRole('link',{name:'TR',exact:true}).click()
  await expect(page.getByRole('searchbox',{name:'Gündemimde ara'})).toHaveValue('notes')
  await expect(page.getByRole('button',{name:'Okunuyor',exact:true})).toHaveAttribute('aria-pressed','true')
  await page.getByRole('button',{name:'Filtreleri temizle',exact:true}).click()
  await expect(page).toHaveURL(/\/tr\/agenda\/$/)
})

test('theme changes propagate to a second open tab',async({page,context})=>{
  await page.goto('/en/')
  const second=await context.newPage()
  await second.goto('/en/research/')
  await page.getByRole('button',{name:'Use dark theme',exact:true}).click()
  await expect(second.locator('html')).toHaveAttribute('data-theme','dark')
  await second.getByRole('button',{name:'Use light theme',exact:true}).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme','light')
  await second.close()
})

test('zoomed graphs keep edge nodes reachable and reset their scroll position',async({page})=>{
  await page.goto('/en/graph/')
  await page.getByRole('button',{name:'Zoom in',exact:true}).click()
  await page.getByRole('button',{name:'Zoom in',exact:true}).click()
  const viewport=page.getByRole('region',{name:'Graph viewport',exact:true})
  expect(await viewport.evaluate(element=>element.scrollWidth>element.clientWidth)).toBe(true)
  const lastNode=page.locator('svg [role="button"]').last()
  await lastNode.focus()
  await page.keyboard.press('Enter')
  await expect(lastNode).toHaveAttribute('aria-pressed','true')
  await expect(page).toHaveURL(/entity=artificial-agent-coordination/)
  await expect(lastNode).toBeInViewport()
  await page.getByRole('button',{name:'Reset view',exact:true}).click()
  expect(await viewport.evaluate(element=>({left:element.scrollLeft,top:element.scrollTop}))).toEqual({left:0,top:0})
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBe(0)
})
