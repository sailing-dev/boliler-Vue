const {getBrowser} = require('./saucelabs/setup');
const webdriver = require('selenium-webdriver');
const assert = require('assert');

let capabilities = [{browserName: 'firefox'}, {browserName: 'chrome'}];

for (let capability in capabilities) {
  describe('open browser:' + capabilities[capability].browserName, function () {
    let browser = null;

    before(function () {
      browser = getBrowser(capabilities[capability]);
      browser.get('http://localhost:8050/de/about');
    });

    after(function () {
      return browser.quit();
    });

    it('check headline text', async () => {
      const el = await browser.wait(webdriver.until.elementLocated(webdriver.By.css('h1')));
      const txt = await el.getText();
      assert.equal(txt, 'nachricht 12');
    });

    it('check headline text (test)', async () => {
      const el = await browser.wait(webdriver.until.elementLocated(webdriver.By.css('h1')));
      const txt = await el.getText();
      assert.equal(txt, 'nachricht 123');
    });
  });
}
