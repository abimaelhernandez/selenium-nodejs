const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');
const { User, Password } = require('.env');

// Optional width, height options for window created
const width = 640;
const height = 480;
// Alterative options objects for Firefox or Chrome
// I had to use the setBinary(firefox.Channel.NIGHTLY) because of the firefox I'm running
let optionsFF = new firefox.Options().setBinary(firefox.Channel.NIGHTLY);
// Chrome options are untested. The most recent version of chromedriver only supports Chrome v75
// which is the Chrome Developer Edition
let optionsCH = new chrome.Options().headless();

(async function example() {
  let driver = await new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(optionsFF)
    .build();
  try {
    await driver.get(
      'https://accounts.thinkful.com/login?_next=https://lark.thinkful.com/available-students/'
    );
    // These By.id selectors work fine.
    await driver.findElement(By.id('LoginInput')).sendKeys(User);
    await driver.findElement(By.id('LoginPassword')).sendKeys(Password);
    await driver.findElement(By.css('button[type="submit"]')).click();
    // Modal loads after sign in. Tried dismissing it by clicking app. Doesn't work.
    await driver
      .wait(until.elementLocated(By.id('app')), 2000)
      .findElement(By.id('app'))
      .click();
    // Access the main react-app. Also doesn't work. Maybe because of the modal.
    const element = await driver
      .wait(until.elementLocated(By.id('react-app')), 5000)
      .findElement(By.id('react-app'));

    if (element.text === 'There are no students available right now') {
      console.log('0');
    } else {
      console.log('Students found');
    }
  } catch (err) {
    console.error(err);
    driver.quit();
  } finally {
    driver.quit();
  }
})();
