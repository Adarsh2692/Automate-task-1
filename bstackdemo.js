require("chromedriver");
require("geckodriver");

let {By, Builder, Key, until, Capability} = require("selenium-webdriver");
const prompt = require("prompt-sync")({ sigint: true });

let localDevice = prompt("Run the tests on your device? (yes or no) : ");
let parallel_status = "no";
let browser = "chrome";

if (localDevice === "no")
    parallel_status = prompt("Run parallel configurations? (yes or no) : ");
else
    browser = prompt("On what browser do you want to run your test? (chrome or firefox) : ");

var capability1 = {
    "os" : "Windows",
    "os_version" : "10",
    "browserName" : "Firefox",
    "browser_version" : "latest",
    "project" : "Bstack Demo test",
    "name" : "Bstack Demo test",
    "browserstack.local" : "false",
    "browserstack.networkLogs" : "true",
    "browserstack.selenium_version" : "3.14.0",
}

const capability2 = [
    {
        'device' : 'Samsung Galaxy S22 Ultra',
        'realMobile' : 'true',
        'os_version' : '12.0',
        'browserName' : 'android',
        'build': 'BStack demo',
        'name': 'Parallel test 1',
        "browserstack.networkLogs" : true
    },
    {
        'os_version': 'Monterey',
        'browserName': 'Chrome',
        'browser_version': 'latest',
        'os': 'OS X',
        'build': 'BStack demo',
        'name': 'Parallel test 2',
        "browserstack.networkLogs" : true
      }
]

async function test(capability) {
    let driver;

    if (localDevice === "no") {
      driver = new Builder()
                     .usingServer(`https://${process.env.browserstack_user}:${process.env.browserstack_key}@hub.browserstack.com/wd/hub`)
                     .withCapabilities(capability)
                     .build();
    }else {
      driver = new Builder().forBrowser(browser).build();
    }

    try {
        await driver.get("https://bstackdemo.com/signin");

        await driver.findElement(By.js('return document.getElementById("username")')).click();

        await driver.findElement(By.js('return document.getElementById("react-select-2-option-0-0")')).click();

        await driver.findElement(By.js('return document.getElementById("password")')).click();

        await driver.findElement(By.js('return document.getElementById("react-select-3-option-0-0")')).click();

        await driver.findElement(By.js('return document.getElementById("login-btn")')).click();

        let names = await driver.wait(until.elementsLocated(By.className('shelf-item__title')));
        let i = 0, p = 0;

        await names.map(async (product) => {
            let txt = await product.getText();

            if (txt === "iPhone 12")
                p = i;
            
            i++;
        })

        let cart = await driver.findElements(By.className("shelf-item__buy-btn"));

        await cart[p].click();

        await driver.findElement(By.js('return document.querySelector("#__next > div > div > div.float-cart.float-cart--open > div.float-cart__content > div.float-cart__footer > div.buy-btn")')).click();

        await driver.wait(until.elementLocated(By.id("firstNameInput")));

        await driver.findElement({id : "firstNameInput"}).sendKeys("abc");

        await driver.findElement({id : "lastNameInput"}).sendKeys("pqr");

        await driver.findElement({id : "addressLine1Input"}).sendKeys("address");

        await driver.findElement({id : "provinceInput"}).sendKeys("xyz");

        await driver.findElement({id : "postCodeInput"}).sendKeys("123");

        await driver.findElement({id : "checkout-shipping-continue"}).click();

        await driver.wait(until.elementLocated(By.id("confirmation-message")));

        let message = await driver.findElement(By.id("confirmation-message"));

        console.log(await message.getText());

        await driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Yaay! my sample test passed"}}');

    } catch (err) {
        console.log(err.message)
        await driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Oops! my sample test failed"}}');
    }

    setTimeout(() => {
        driver.quit();
    }, 3000);
}

if (parallel_status === "no")
    test(capability1);
else {
    capability2.map((capability) => {
        test(capability)
    })
}