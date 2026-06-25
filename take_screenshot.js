const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 1600 });
  
  console.log('Navigating to Aatrox page...');
  await page.goto('http://localhost:3000/ja/champions/Aatrox', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  
  const screenshotPath = path.join(__dirname, 'screenshot_aatrox.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Saved screenshot to', screenshotPath);
  
  await browser.close();
})();
