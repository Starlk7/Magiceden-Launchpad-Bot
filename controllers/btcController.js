const { sleep, formatTime, colors, settings } = require('../helper.js');
const { createDriver } = require('../webdriver.js');
const { By, until } = require('selenium-webdriver');

async function btcController(link, seed, headless, network, tNum, sNum){
    try{
        let driver = await createDriver(headless, network, tNum, sNum)
        if(driver){
            let importWallet = await btcImportWallet(driver, seed)
            if(importWallet){
                console.log(colors.green(`${formatTime(new Date())}| Seed was imported to btc wallet!`))
                let page = await btcConnectToPage(driver, link, tNum, sNum)
                if(page){
                    console.log(colors.green(`${formatTime(new Date())}| Wallet is connected, go to check details!`))
                    await btcHandleMint(driver, tNum, sNum)
                }else{
                    console.log(colors.red(`${formatTime(new Date())}| Wallet is not connected`))
                    driver.quit()
                    return
                }
            }else{
                console.log(colors.red(`${formatTime(new Date())}| Wallet not imported for some reasons...`))
                driver.quit()
                return
            }
        }else{
            console.log(colors.red(`${formatTime(new Date())}| No found driver for ${network}`))
            return
        }
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| Error in btcController ${e}`))
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
        
        await sleep(5000)
    
        let okBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div[1]/div/div[2]/div[2]/div/div/div[4]/div`)), 5000); 
        await okBtn.click();
    
        return true
    }catch(e){
        console.log(e)
        return false
    }
}

async function btcConnectToPage(driver, link, tNum, sNum){
    await sleep(99999999)

}

async function btcHandleMint(driver, tNum, sNum){
    await sleep(99999999)

}


module.exports = {
    btcController,
};