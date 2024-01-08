const {
    Builder,
    By,
    Key,
    until,
} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { sleep, formatTime } = require('./helper.js');
const colors = require('colors');

async function driverController(link, threads, seedPhrases, headless, network){
    try{
        for(let seed of seedPhrases){
            console.log(seed)
            for(let i=0;i<threads;i++){
                if(network == 'sol'){
                    await handleSolana(link, seed, headless, network, i)
                }else if(network == 'btc'){
                    await handleBtc(link, seed, headless, network, i)
                }else if(network == 'eth'){
                    await handleEth(link, seed, headless, network, i)
                }else if(network == 'polygon'){
                    await handlePolygon(link, seed, headless, network, i)
                }else{
                    console.log(`${formatTime(new Date())}| Have no network`)
                    return
                }
            }
        }
    }catch(e){
        console.log(`${formatTime(new Date())}| Error in driverController ${e}`)
    }
}

async function createDriver(headless, network, number){
    try{
        console.log(`${formatTime(new Date())}| [${number}] Creating driver for ${network}...`)
        let chromeOptions = new chrome.Options();
        chromeOptions.excludeSwitches('enable-logging');
        if(network=='sol'){
            chromeOptions.addExtensions('./exs/Phantom.crx'); 
        }else if(network=='eth'){
            chromeOptions.addExtensions('./exs/Metamask.crx'); 
        }else if(network=='btc'){
            chromeOptions.addExtensions('./exs/Unisat.crx'); 
        }else if(network=='polygon'){
            chromeOptions.addExtensions('./exs/Metamask.crx'); 
        }else{
            console.log(colors.red(`${formatTime(new Date())}|  [${number}] Cant find network in createdriver ${network}`))
            return
        }
    
        if(headless==true){
            chromeOptions.addArguments("--headless=new");
        }
        let driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
        return driver
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}|  [${number}] Error in createDriver ${e}`))
    }
}


async function connectWalletToLaunchpad(driver, link, number){
    try{
        console.log(`${formatTime(new Date())}| [${number}] Connecting wallet to launchpad page...`)
        await driver.get(link);
        await sleep(1000)
        console.log(`${formatTime(new Date())}| [${number}] Page is loaded`)
        try{
            let connectWallet = await driver.wait(until.elementLocated(By.xpath(`//*[@id="__next"]/div[2]/div[1]/header/nav/div[3]/div[2]/div/div[2]/button/span`)), 5000); 
            await connectWallet.click();
        }catch(e){

        }
        await sleep(300)  
        let phantomWallet = await driver.wait(until.elementLocated(By.xpath(`//*[@id="headlessui-dialog-panel-:rm:"]/div[2]/div/div[2]/div/button/div/div/span[2]`)), 5000); 
        await phantomWallet.click();   
        await sleep(2000)  

        const windowHandles = await driver.getAllWindowHandles();
        let windowHandleIndex = 0;
        
        while (await driver.getTitle() !== 'Phantom Wallet') {
          windowHandleIndex++;
          const nextWindow = windowHandles[windowHandleIndex];
          await driver.switchTo().window(nextWindow);
        }

        let connectWalletPhantom = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div/div[1]/div[3]/div[2]/div/button[2]`)), 5000); 
        await connectWalletPhantom.click();

        const handles = await driver.getAllWindowHandles();
        //console.log(handles)
        await driver.switchTo().window(handles[0]);
        waitMint(driver)
        return true
       // let signInBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="headlessui-portal-root"]/div/button[1]`)), 5000); 
       // await signInBtn.click(); 
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| [${number}] Error in connectWalletToLaunchpad ${e}`))
        return
    }
}

async function waitMint(driver){

}


async function handleSolana(link, seed, headless, network, number){
    try{
        let driver = await createDriver(headless, network, number)
        if(driver){
            console.log(colors.green(`${formatTime(new Date())}| [thread:${number}|] Driver was created for ${network}`))
            let importWallet = await handleImportWallet(network, driver, seed)
            if(importWallet){
                console.log(colors.green(`${formatTime(new Date())}| [${number}] Wallet was imported`))
                let page = await connectWalletToLaunchpad(driver, link, number)
                if(page){
                    console.log(colors.green(`${formatTime(new Date())}| [${number}] Wallet is connected`))
                }else{
                    console.log(colors.red(`${formatTime(new Date())}| [${number}] Wallet is not connected`))
                    driver.quit()
                    return
                }
            }else{
                console.log(colors.red(`${formatTime(new Date())}| [${number}] Wallet not imported for some reasons... Try again...`))
                driver.quit()
                return
            }
        }else{
            console.log(colors.red(`${formatTime(new Date())}| [${number}] No found driver for ${network}`))
            driver.quit()
            return
        }
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| [${number}] Error in handleSolana ${e}`))

        return
    }
}

async function handleEth(link, seed, headless, network, number){
    try{
        let driver = await createDriver(headless, network, number)
        if(driver){
            console.log(colors.green(`${formatTime(new Date())}| [${number}] Driver was created for ${network}`))
            let importWallet = await handleImportWallet(network, driver, seed)
            if(importWallet){
                console.log(colors.green(`${formatTime(new Date())}| [${number}] Wallet was imported`))
                let page = await connectWalletToLaunchpad(driver, link, number)
                if(page){
                    console.log(colors.green(`${formatTime(new Date())}| [${number}] Page is opened`))
                }else{
                    console.log(colors.red(`${formatTime(new Date())}| [${number}] Page is not opened`))
                    return
                }


            }else{
                console.log(colors.red(`${formatTime(new Date())}| [${number}] Wallet not imported for some reasons... Try again...`))
            }
        }else{
            console.log(colors.red(`${formatTime(new Date())}| [${number}] No found driver for ${network}`))
        }
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| [${number}] Error in handleEth ${e}`))
    }
}

async function handlePolygon(link, seed, headless, network, number){
    try{
        let driver = await createDriver(headless, network, number)
        if(driver){
            console.log(colors.green(`${formatTime(new Date())}| [${number}] Driver was created for ${network}`))
            let importWallet = await handleImportWallet(network, driver, seed)
            if(importWallet){
                console.log(colors.green(`${formatTime(new Date())}| [${number}] Wallet was imported`))
                let page = await connectWalletToLaunchpad(driver, link, number)
                if(page){
                    console.log(colors.green(`${formatTime(new Date())}| [${number}] Page is opened`))
                }else{
                    console.log(colors.red(`${formatTime(new Date())}| [${number}] Page is not opened`))
                    return
                }


            }else{
                console.log(colors.red(`${formatTime(new Date())}| [${number}] Wallet not imported for some reasons... Try again...`))
            }
        }else{
            console.log(colors.red(`${formatTime(new Date())}| [${number}] No found driver for ${network}`))
        }
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| [${number}] Error in handlePolygon ${e}`))
    }
}

async function handleBtc(link, seed, headless, network, number){
    try{
        let importWallet = await handleImportWallet(network, driver, seed)
        if(importWallet){
            console.log(colors.green(`${formatTime(new Date())}| [${number}] Wallet was imported`))
            let page = await connectWalletToLaunchpad(driver, link, number)
            if(page){
                console.log(colors.green(`${formatTime(new Date())}| [${number}] Page is opened`))
            }else{
                console.log(colors.red(`${formatTime(new Date())}| [${number}] Page is not opened`))
                return
            }


        }else{
            console.log(colors.red(`${formatTime(new Date())}| [${number}] Wallet not imported for some reasons... Try again...`))
        }
       // console.log(`${formatTime(new Date())}| [${number}] BTC bot is coming...`)
       // return
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| [${number}] Error in handleBtc ${e}`))
    }
}




async function handleImportWallet(network, driver, seedPhrase){
    try{
        if(network == 'sol'){
            await driver.get('chrome-extension://gpllmmheffjokkdpjdlemejghblleggj/onboarding.html');
            await sleep(1000)
            const handles = await driver.getAllWindowHandles();
            await driver.switchTo().window(handles[1]);
            await driver.close();
            await driver.switchTo().window(handles[0]);

            let useSecretBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/main/div/div/section/button[2]`)), 5000); 
            await useSecretBtn.click();

            let seedField = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/main/div[2]/div/form/section/div/textarea`)), 5000); 
            await seedField.sendKeys(seedPhrase);

            let importBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/main/div[2]/div/form/button`)), 5000); 
            await importBtn.click();

            let pass1 = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/main/div[2]/div/form/section/input`)), 5000); 
            await pass1.sendKeys('12345678Aa');

            let pass2 = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/main/div[2]/div/form/section/div[1]/input`)), 5000); 
            await pass2.sendKeys('12345678Aa');

            let confirmPassCheckbox = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/main/div[2]/div/form/section/div[2]/span/input`)), 5000); 
            await confirmPassCheckbox.click();

            let savePassBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/main/div[2]/div/form/button`)), 5000); 
            await savePassBtn.click();

            let continueBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/main/div[2]/div/button`)), 5000); 
            await continueBtn.click();

            return true
        }else if(network == 'btc'){
            //await driver.get('chrome-extension://opfgelmcmbiajamepnmloijbpoleiama/popup.html#/import/pkey?onboarding=true');
            //await sleep(2000)
            console.log(`${formatTime(new Date())}| Coming soon...`)
            return false
        }else if(network == 'eth'){
            await driver.get('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#initialize/create-password/import-with-seed-phrase');
            await sleep(2000)
            const handles = await driver.getAllWindowHandles();
            await driver.switchTo().window(handles[1]);
            await driver.close();
            await driver.switchTo().window(handles[0]);

            return false
        }else if(network == 'polygon'){
            await driver.get('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#initialize/create-password/import-with-seed-phrase');
            await sleep(2000)
            const handles = await driver.getAllWindowHandles();
            await driver.switchTo().window(handles[1]);
            await driver.close();
            await driver.switchTo().window(handles[0]);

            return false
        }else{
            console.log(colors.red(`${formatTime(new Date())}| Have no network in handleImportWallet`))
            return false
        }
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| Error in handleImportWallet ${e}`))
        return false
    }
}




module.exports = {
    driverController
};