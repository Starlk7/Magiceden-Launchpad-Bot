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
        await driver.get('chrome-extension://fedbmpnglfkindbhhdhpmenfhminnmai/index.html#/');

        let alreadyBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div[1]/div/div/div/div[2]/div[3]/div`)), 5000); 
        await alreadyBtn.click();
    
    
        let pass1 = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div[1]/div/div/div/div/div[3]/input`)), 5000); 
        await pass1.sendKeys('12345678Aa');
    
        let pass2 = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div[1]/div/div/div/div/div[4]/input`)), 5000); 
        await pass2.sendKeys('12345678Aa');
    
    
        let continueBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div[1]/div/div/div/div/div[5]`)), 5000); 
        await continueBtn.click();
    
        let unisatBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div[1]/div/div[2]/div[2]/div[2]`)), 5000); 
        await unisatBtn.click();
        let sSeed = seedPhrase.split(' ')
        for(let i=0;i<(sSeed.length);i++){
            let seedField = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div[1]/div/div[2]/div[2]/div[4]/div/div[${i+1}]/div/div[2]/input`)), 5000); 
            await seedField.sendKeys(sSeed[i]);
        }
    
        let continue2btn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div[1]/div/div[2]/div[2]/div[5]/div[2]/div`)), 5000); 
        await continue2btn.click();
    
        let continue3btn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div[1]/div/div[2]/div[2]/div[10]/div[2]/div/div`)), 5000); 
        await continue3btn.click();
    
        let checkbox1 = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div[1]/div/div[2]/div[2]/div/div/div[3]/div[2]/label/span[1]/input`)), 5000); 
        await checkbox1.click();
        let checkbox2 = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div[1]/div/div[2]/div[2]/div/div/div[3]/div[4]/label/span[1]/input`)), 5000); 
        await checkbox2.click();
        
        await sleep(4000)
    
        let okBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div[1]/div/div[2]/div[2]/div/div/div[4]/div`)), 5000); 
        await okBtn.click();
    
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
        await sleep(1000)
        let dynPart = `headlessui-dialog-panel`

        let connectBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="__next"]/div[2]/div[1]/header/nav/div[3]/div[2]/div/div[2]/button/span`)), 5000); 
        await connectBtn.click();

        let btcWallets = await driver.wait(until.elementLocated(By.xpath(`//*[contains(@id, "${dynPart}")]/div[2]/div/div[1]/div[2]/span[2]`)), 5000);
        await btcWallets.click();

        let unisatBtn = await driver.wait(until.elementLocated(By.xpath(`//*[contains(@id, "${dynPart}")]/div[2]/div/div[2]/div[2]/button/div/div/span`)), 5000); 
        await unisatBtn.click();

        const windowHandles = await driver.getAllWindowHandles();
        let windowHandleIndex = 0;
        
        while (await driver.getTitle() !== 'UniSat Wallet') {
          windowHandleIndex++;
          const nextWindow = windowHandles[windowHandleIndex];
          await driver.switchTo().window(nextWindow);
        }

        let connectUnisat = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div[1]/div/div[3]/div/div[2]`)), 5000); 
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
    try{
        console.log((`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Checking launchpad page for details...`))
        let enoughBalance = false;
        await sleep(1000)
        


        await sleep(99999999)
    }catch(e){
        console.log(colors.red(e))
    }
}


module.exports = {
    btcController,
};