const { sleep, formatTime, colors, settings } = require('../helper.js');
const { createDriver } = require('../webdriver.js');
const { By, until } = require('selenium-webdriver');

const threads = settings.threads;
const seedPhrases = settings.seedPhrases;

async function solanaController(link, seed, headless, tNum, sNum){
    try{
        let driver = await createDriver(headless, 'sol', tNum, sNum)
        if(driver){
            console.log(colors.green(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Webdriver was created for solana!`))
            let importWallet = await solanaImportWallet(driver, seed)
            if(importWallet){
                console.log(colors.green(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Seed was imported to solana wallet!`))
                let page = await solanaConnectToPage(driver, link, tNum, sNum)
                if(page){
                    console.log(colors.green(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Wallet is connected, go to check details!`))
                    await solanaHandleMint(driver, tNum, sNum)
                }else{
                    console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Wallet is not connected`))
                    driver.quit()
                    return
                }
            }else{
                console.log((`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Wallet not imported for some reasons... Try again...`))
                driver.quit()
                return
            }
        }else{
            console.log((`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] No found driver for solana`))
            return
        }
    }catch(e){
        console.log((`${formatTime(new Date())}| Error ${e}`))
        return
    }
}


async function solanaImportWallet(driver, seedPhrase){
    try{
        await driver.get('chrome-extension://bhhhlbepdkbapadjdnnojkbgioiodbic/wallet.html#/onboard');
        const handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[1]);
        await driver.close();
        await driver.switchTo().window(handles[0]);

        if(seedPhrase.includes('[') && seedPhrase.includes(']')){
            let useSecretBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div/div[2]/div/div[2]/div[2]/button`)), 50000); 
            await useSecretBtn.click();
            let toCrop = `wait time addict random danger waste plunge angry clip auction inspire dish`
            let splittedSeed = toCrop.split(' ')

            for(let i=0;i<splittedSeed.length;i++){
                let word = await driver.wait(until.elementLocated(By.xpath(`//*[@id="mnemonic-input-${i}"]`)), 5000); 
                await word.sendKeys(splittedSeed[i]);
            }
    
            let importBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div/div[2]/div/div[2]/form/div[2]/button[2]`)), 5000); 
            await importBtn.click();

            let pass1 = await driver.wait(until.elementLocated(By.xpath(`//*[@id=":r2:"]`)), 5000); 
            await pass1.sendKeys('123');

            let pass2 = await driver.wait(until.elementLocated(By.xpath(`//*[@id=":r3:"]`)), 5000); 
            await pass2.sendKeys('123');
    
            let confirmPassCheckbox = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div/div[2]/div/div[2]/form/div[2]/button[2]`)), 5000); 
            await confirmPassCheckbox.click();

            let confirmImport = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div/div[2]/div/div[2]/div[2]/div/button[1]`)), 15000); 
            await confirmImport.click();

            let confirmImport2 = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div/div[1]/div[2]/div[2]/button/span`)), 5000); 
            await confirmImport2.click();

            let confirmImport3 = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div/div[2]/div/div[2]/button[2]/span`)), 5000); 
            await confirmImport3.click();
            
            let selectWallet = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/header/div/div/div[4]/button/div`)), 5000); 
            await selectWallet.click();
                        
            let addNew = await driver.wait(until.elementLocated(By.xpath(`//*[@id=":r6:"]/h2/div/button/div/div`)), 5000); 
            await addNew.click();
                        
            let importPKey = await driver.wait(until.elementLocated(By.xpath(`/html/body/div[2]/div[3]/div/div[2]/div/div/div[13]/div/div[2]/div/span/span`)), 5000); 
            await importPKey.click();

            let name = await driver.wait(until.elementLocated(By.xpath(`/html/body/div[2]/div[3]/div/div[2]/div/div[1]/div[2]/input`)), 5000); 
            await name.sendKeys('1');

            let pKey = await driver.wait(until.elementLocated(By.xpath(`/html/body/div[2]/div[3]/div/div[2]/div/div[2]/div[2]/textarea`)), 5000); 
            await pKey.sendKeys(seedPhrase);

            let confirmImportPkey = await driver.wait(until.elementLocated(By.xpath(`/html/body/div[2]/div[3]/div/div[3]/div/button/span`)), 5000); 
            await confirmImportPkey.click();

            let selectInportedWallet = await driver.wait(until.elementLocated(By.xpath(`/html/body/div[2]/div[3]/div/div[2]/div/div/div[3]/div[2]/div/div/div[1]/div[2]/div[1]`)), 5000); 
            await selectInportedWallet.click();
            return true
        }else{
            let useSecretBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div/div[2]/div/div[2]/div[2]/button`)), 50000); 
            await useSecretBtn.click();
            
            let splittedSeed = seedPhrase.split(' ')

            for(let i=0;i<splittedSeed.length;i++){
                let word = await driver.wait(until.elementLocated(By.xpath(`//*[@id="mnemonic-input-${i}"]`)), 5000); 
                await word.sendKeys(splittedSeed[i]);
            }
        
            let importBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div/div[2]/div/div[2]/form/div[2]/button[2]`)), 5000); 
            await importBtn.click();

            let pass1 = await driver.wait(until.elementLocated(By.xpath(`//*[@id=":r2:"]`)), 5000); 
            await pass1.sendKeys('123');

            let pass2 = await driver.wait(until.elementLocated(By.xpath(`//*[@id=":r3:"]`)), 5000); 
            await pass2.sendKeys('123');
        
            let confirmPassCheckbox = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div/div[2]/div/div[2]/form/div[2]/button[2]`)), 5000); 
            await confirmPassCheckbox.click();

            let confirmImport = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div/div[2]/div/div[2]/div[2]/div/button[1]`)), 15000); 
            await confirmImport.click();

            let confirmImport2 = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div/div[1]/div[2]/div[2]/button/span`)), 5000); 
            await confirmImport2.click();

            let confirmImport3 = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div/div[2]/div/div[2]/button[2]/span`)), 5000); 
            await confirmImport3.click();

            return true
        }
    }catch(e){
        console.log((`${formatTime(new Date())}| ${e}`))
        return false
    }
}

async function solanaConnectToPage(driver, link, tNum, sNum){
    try{
        console.log(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Connecting wallet to launchpad page...`)
        await driver.get(link);
        await sleep(1500)
        try{
            let connectWallet = await driver.wait(until.elementLocated(By.xpath(`//*[@id="__next"]/div[2]/div[1]/header/nav/div[3]/div[2]/div/div[2]/button/span`)), 5000); 
            await connectWallet.click();
        }catch{}

        let dynamicPart = `headlessui-dialog-panel`;
        let solflareWallet = await driver.wait(until.elementLocated(By.xpath(`//*[contains(@id, "${dynamicPart}")]/div[2]/div/div[2]/div[2]/button/div/div/span[1]`)), 5000);
        await sleep(1500);

        await solflareWallet.click();   
        await sleep(1500)  

        const windowHandles = await driver.getAllWindowHandles();
        let windowHandleIndex = 0;
        
        while (await driver.getTitle() !== 'Solflare') {
            windowHandleIndex++;
            const nextWindow = windowHandles[windowHandleIndex];
            await driver.switchTo().window(nextWindow);
          }
  
          let checkbox1 = await driver.wait(until.elementLocated(By.xpath(`//*[@id="trusted-check"]/div`)), 5000); 
          await checkbox1.click();
  
          let checkbox2 = await driver.wait(until.elementLocated(By.xpath(`//*[@id="auto-approve-check"]/div`)), 5000); 
          await checkbox2.click();
  
  
          let connect = await driver.wait(until.elementLocated(By.xpath(`/html/body/div[2]/div[2]/div/div[3]/div/button[2]/span`)), 5000); 
          await connect.click();
  
          await sleep(10000)
  
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
        console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Error in solanaConnectToPage ${e}`))
        return
    }
}

async function solanaHandleMint(driver, tNum, sNum){
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
            if(balance == `0 SOL`){
                console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Empty wallet | Balance: ${balance}`))
            }else if(balance.includes(` SOL`)){
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
                    }
                }
                if(price){
                    if(price.includes('FREE')){
                        enoughBalance = true; 
                    }else if((price.replace(` SOL`,``))<(balance.replace(` SOL`,``))){
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
        try{
            let checkbox = await driver.wait(until.elementLocated(By.xpath(`//*[@id="content"]/div/div[3]/div/div[1]/div[1]/div/div[2]/div[2]/div[1]/div/div[2]/div/div/div[4]/label/span`)), 10000); 
            await checkbox.click(); 
        }catch{}
      for(let i=0;i<5;i++){
         await mintBtn.click();
      }

      console.log(colors.green(`Tx was sent!`))
    }else{
        console.log(colors.red(`Balance not enough, return wallet`))
        return false
    }
}


module.exports = {
    solanaController,
};