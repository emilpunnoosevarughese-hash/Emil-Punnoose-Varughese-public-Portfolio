const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/speclab/compatibility', { waitUntil: 'networkidle0' });
  const bg = await page.evaluate(() => {
    const headers = document.querySelectorAll('header');
    if (headers.length < 2) return 'not enough headers found';
    return window.getComputedStyle(headers[1]).backgroundColor;
  });
  console.log('SpecLabShell Header bg:', bg);
  await browser.close();
})();
