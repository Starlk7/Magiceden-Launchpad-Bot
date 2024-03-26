const { sleep, formatTime, colors, settings } = require('../helper.js');
const { createDriver } = require('../webdriver.js');
const { By, until } = require('selenium-webdriver');

const threads = settings.threads;
const seedPhrases = settings.seedPhrases;

async function btcController(link, seed, headless, network, tNum, sNum){
    try{
        let driver = await createDriver(headless, network, tNum, sNum)
        if(driver){
            let importWallet = await btcImportWallet(driver, seed)
            if(importWallet){
                console.log(colors.green(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Seed was imported to btc wallet!`))
                let page = await btcConnectToPage(driver, link, tNum, sNum)
                if(page){
                    console.log(colors.green(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Wallet is connected, go to check details!`))
                    await btcHandleMint(driver, tNum, sNum)
                }else{
                    console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Wallet is not connected`))
                    driver.quit()
                    return
                }
            }else{
                console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Wallet not imported for some reasons...`))
                driver.quit()
                return
            }
        }else{
            console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] No found driver for ${network}`))
            return
        }
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Error in btcController ${e}`))
        return false
    }
}


async function btcImportWallet(driver, seedPhrase){
    try{

        await driver.get('chrome-extension://idnnbdplmphpflfnlkomgpfbpcgelopg/options.html#/restoreWallet/');
        let splittedSeed = seedPhrase.split(' ')
        let wordsC = splittedSeed.length;
        if(wordsC==24){
            let words24 = await driver.wait(until.elementLocated(By.xpath(`//*[@id="app"]/div[1]/div/div/div[2]/div[1]/button`)), 5000); 
            await words24.click();
        }else if(wordsC==12){
        }else{
            console.log(colors.red(`Error while import seed`))
            return false
        }

        for(let i=0;i<splittedSeed.length;i++){
            let word = await driver.wait(until.elementLocated(By.xpath(`//*[@id="input${i}"]`)), 5000); 
            await word.sendKeys(splittedSeed[i]);
        }
        let continueBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="app"]/div[1]/div/div/div[2]/div[2]/button`)), 5000); 
        await continueBtn.click();

        let pass1 = await driver.wait(until.elementLocated(By.xpath(`//*[@id="app"]/div[1]/div/div/div[2]/div/div[2]/input`)), 5000); 
        await pass1.sendKeys('A82jfp77!32221');

        let savePass = await driver.wait(until.elementLocated(By.xpath(`//*[@id="app"]/div[1]/div/div/div[2]/div/div[4]/div[2]/button/h1`)), 5000); 
        await savePass.click();

        let pass2 = await driver.wait(until.elementLocated(By.xpath(`//*[@id="app"]/div[1]/div/div/div[2]/div/div[2]/input`)), 5000); 
        await pass2.sendKeys('A82jfp77!32221');

        let savePass2 = await driver.wait(until.elementLocated(By.xpath(`//*[@id="app"]/div[1]/div/div/div[2]/div/div[3]/div[2]/button/h1`)), 5000); 
        await savePass2.click();

        await sleep(3000)


        return true
    }catch(e){
        console.log(colors.red(e))
        return false
    }
}

async function btcConnectToPage(driver, link, tNum, sNum){
    try{
        console.log(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Connecting wallet to launchpad page...`)
        await driver.get(link);
        await sleep(2500)
        let dynPart = `headlessui-dialog-panel`

        let connectBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="__next"]/div[2]/div[1]/header/nav/div[2]/div[2]/div/div[2]/button/span`)), 5000); 
        await connectBtn.click();
        await sleep(2500)

        let btcWallets = await driver.wait(until.elementLocated(By.xpath(`//*[contains(@id, "${dynPart}")]/div[2]/div/div[1]/div[2]/span[2]`)), 5000);
        await btcWallets.click();
        await sleep(2500)

        let xverseWallet = await driver.wait(until.elementLocated(By.xpath(`//*[contains(@id, "${dynPart}")]/div[2]/div/div[2]/div[2]/button/div`)), 5000); 
        await xverseWallet.click();
        const windowHandles = await driver.getAllWindowHandles();
        let windowHandleIndex = 0;
        
        while (await driver.getTitle() !== 'Xverse Wallet') {
          windowHandleIndex++;
          const nextWindow = windowHandles[windowHandleIndex];
          await driver.switchTo().window(nextWindow);
        }

        let connectUnisat = await driver.wait(until.elementLocated(By.xpath(`//*[@id="app"]/div[1]/div[2]/div[2]/button/h1`)), 5000); 
        await connectUnisat.click();
        
        const handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[0]);

        try{
            await sleep(300)
            let dynamicPart = `tw-cursor-pointer tw-text-white-2`
            let signBtn = await driver.wait(until.elementLocated(By.xpath(`//*[contains(@class, "${dynamicPart}")]`)), 5000);
            await signBtn.click()
        }catch(e){console.log(e)}
        return true
    }catch(e){
        console.log(colors.red(e))
        return false
    }
}

async function btcHandleMint(driver, tNum, sNum){
    console.log((`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Checking launchpad page for details...`))
    let enoughBalance = false;
    await sleep(1000)
    try{
        let checkEl = await driver.wait(until.elementLocated(By.xpath(`//*[@id="content"]/div/div[3]/div/div[1]/div[1]/div/div[2]/div[2]/div[1]/div/div[2]/div/div[2]/div[1]/div[1]/div/span`)), 5000); 
        let check = await checkEl.getText();
        if(check.includes(`Upcoming`)){
            let timeEl = await driver.wait(until.elementLocated(By.xpath(`//*[@id="content"]/div/div[3]/div/div[1]/div[1]/div/div[2]/div[2]/div[1]/div/div[2]/div/div[1]/div[1]/div`)), 5000); 
            let time = await timeEl.getText();
            console.log((`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Time to mint: ${time.replaceAll(`\n`,``)}`))
        }else{
            console.log(`Mint is not upcoming, its ${check}`)
        }
    }catch{}
    try{
        const balanceTextElement = await driver.wait(until.elementLocated(By.className('tw-text-white-1 tw-font-semibold tw-text-sm')));
        let balance = await balanceTextElement.getText();
        if(balance){
            if(balance == `0 BTC`){
                console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Empty wallet | Balance: ${balance}`))
            }else if(balance.includes(` BTC`)){
                let price;
                try{
                    let priceElement = await driver.wait(until.elementLocated(By.xpath(`//*[@id="content"]/div/div[3]/div/div[2]/div[2]/div/div/div[2]/div[1]/p[2]/span`)), 5000); 
                    price = await priceElement.getText();
                }catch(e){
                    if(e.message.includes(`timed out`)){
                        try{
                            let priceElement = await driver.wait(until.elementLocated(By.xpath(`//*[@id="content"]/div/div[3]/div/div[1]/div[1]/div/div[2]/div[2]/div[1]/div/div[2]/div/div[2]/div[2]/div/p[2]/span[1]`)), 5000); 
                            price = await priceElement.getText();
                        }catch{}
                    }else{
                        console.log((e))
                    }
                }
                if(price){
                    if((price.replace(` BTC`,``))<(balance.replace(` BTC`,``))){
                        console.log((`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Balance: ${balance} | Price: ${price} | Enough!`))
                        enoughBalance = true; 
                    }else{
                        console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Balance: ${balance} | Price: ${price}| Not enough...`))
                    }
                }else{
                    console.log(colors.red(`Cant find price, skip checking`))
                    enoughBalance = true;
                }
            }else{
                console.log(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Unknown balance: ${balance}`)
            }
        }else{
            console.log(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Balance not found`)
        }
    }catch(e){
        console.log(colors.red(e))
    }
    if(enoughBalance){
      console.log(colors.green(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Balance is enough! Waiting to mint`))
      await sleep(1000)
      try{
        let checkbox = await driver.wait(until.elementLocated(By.xpath(`//*[@id="content"]/div/div[3]/div/div[1]/div[1]/div/div[2]/div[2]/div[1]/div/div[2]/div/div/div[4]/label/span`)), 10000); 
        await checkbox.click();
      }catch{}

      let mintBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="content"]/div/div[3]/div/div[1]/div[1]/div/div[2]/div[2]/div[1]/div/div[2]/div/div/div[5]/div/div[2]/div/button`)), 86400000); 
      await mintBtn.click();
      await sleep(1500)
      const windowHandles = await driver.getAllWindowHandles();
      let windowHandleIndex = 0;

      while (await driver.getTitle() !== 'Xverse Wallet') {
        windowHandleIndex++;
        const nextWindow = windowHandles[windowHandleIndex];
        await driver.switchTo().window(nextWindow);
      }

      let signTxBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div/div[1]/div/div[2]/div/button[2]`)), 5000); 
      await signTxBtn.click();

      console.log(colors.green(`Tx was sent!`))
    }else{
        console.log(colors.red(`Balance not enough, return wallet`))
        return false
    }
}


module.exports = {
    btcController,
};