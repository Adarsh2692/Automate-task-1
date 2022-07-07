require("chromedriver");

let {By, Builder, Key, until, Capability} = require("selenium-webdriver");
let {browserstack_user, browserstack_key} = require("../store")

// var capabilities = {
//     "os" : "Windows",
//     "os_version" : "10",
//     "browserName" : "Chrome",
//     "browser_version" : "latest",
//     "project" : "Bstack Demo test",
//     "name" : "Bstack Demo test",
//     "browserstack.local" : "false",
//     "browserstack.networkLogs" : "true",
//     "browserstack.selenium_version" : "3.14.0",
//     "browserstack.user" : browserstack_user,
//     "browserstack.key" : browserstack_key
// }

const capabilities = [
    {
        'device' : 'Samsung Galaxy S22 Ultra',
        'realMobile' : 'true',
        'os_version' : '12.0',
        'browserName' : 'android',
        'name': 'BStack-[NodeJS] Sample Test', // test name
        'build': 'BStack demo', // CI/CD job or build name
        "browserstack.networkLogs" : true
    },
    {
        'os_version': 'Monterey',
        'browserName': 'Chrome',
        'browser_version': 'latest',
        'os': 'OS X',
        'build': 'BStack-[NodeJS] Sample Build',
        'name': 'Parallel test 2',
        "browserstack.networkLogs" : true
      }
]

async function test(capability) {
    // let driver = new Builder().forBrowser('chrome').build();
    let driver = new Builder().usingServer(`https://${browserstack_user}:${browserstack_key}@hub.browserstack.com/wd/hub`).withCapabilities(capability).build();


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

    } catch (err) {
        console.log(err.message)
    }

    setTimeout(() => {
        driver.quit();
    }, 3000);
}

capabilities.map((capability) => {
    test(capability)
})