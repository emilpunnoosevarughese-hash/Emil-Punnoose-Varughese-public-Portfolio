const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));
  
  try {
    await page.goto('http://localhost:5173/speclab/compatibility', { waitUntil: 'networkidle0' });
    const html = await page.evaluate(() => document.getElementById('root').innerHTML);
    console.log('Root HTML length:', html.length);
    if (html.length < 500) {
      console.log('Root HTML:', html);
    }
  } catch (e) {
    console.log('Nav error:', e);
  }
  await browser.close();
})();
