const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.toString());
  });

  await page.goto('http://localhost:3000/ja/champions/Wukong', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  
  const content = await page.content();
  if (content.includes('Minified React error')) {
    console.log('REACT ERROR 300 FOUND IN HTML');
  } else if (content.includes('Application error')) {
    console.log('APPLICATION ERROR FOUND IN HTML');
  } else {
    console.log('PAGE RENDERED OK, TITLE:', await page.title());
  }
  
  await browser.close();
})();
