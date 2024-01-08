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
        if(network == 'sol'){
            await handleSolana(link, threads, seedPhrases, headless, network)
        }else if(network == 'btc'){
            await handleBtc(link, threads, seedPhrases, headless, network)
        }else if(network == 'eth'){
            await handleEth(link, threads, seedPhrases, headless, network)
        }else if(network == 'polygon'){
            await handlePolygon(link, threads, seedPhrases, headless, network)
        }else{
            console.log(`${formatTime(new Date())}| Have no network`)
            return
        }
    }catch(e){
        console.log(`${formatTime(new Date())}| Error in driverController ${e}`)
    }
}

async function createDriver(headless, network){
    try{
        console.log(`${formatTime(new Date())}| Creating driver for ${network}...`)
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
            console.log(colors.red(`${formatTime(new Date())}| Cant find network in create driver`))
            return
        }
    
        if(headless==true){
            chromeOptions.addArguments("--headless=new");
        }
        let driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
        return driver
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| Error in createDriver ${e}`))
    }
}


async function connectWalletToLaunchpad(driver, link){
    try{
        console.log(`${formatTime(new Date())}| Connecting wallet to launchpad page...`)
        await driver.get(link);
        await sleep(1000)
        console.log(`${formatTime(new Date())}| Page is loaded`)
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
      
        let signInBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="headlessui-portal-root"]/div/button[1]`)), 5000); 
        await signInBtn.click(); 
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| Error in connectWalletToLaunchpad ${e}`))
        return
    }
}




async function handleSolana(link, threads, seedPhrases, headless, network){
    try{
        let driver = await createDriver(headless, network)
        if(driver){
            console.log(colors.green(`${formatTime(new Date())}| Driver was created for ${network}`))
            let importWallet = await handleImportWallet(network, driver, seedPhrases[0])
            if(importWallet){
                console.log(colors.green(`${formatTime(new Date())}| Wallet was imported`))
                let page = await connectWalletToLaunchpad(driver, link)
                if(page){
                    console.log(colors.green(`${formatTime(new Date())}| Wallet is connected`))
                }else{
                    console.log(colors.red(`${formatTime(new Date())}| Wallet is not connected`))
                    return
                }
            }else{
                console.log(colors.red(`${formatTime(new Date())}| Wallet not imported for some reasons... Try again...`))
                return
            }
        }else{
            console.log(colors.red(`${formatTime(new Date())}| No found driver for ${network}`))
            return
        }
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| Error in handleSolana ${e}`))
        return
    }
}

async function handleEth(link, threads, seedPhrases, headless, network){
    try{
        let driver = await createDriver(headless, network)
        if(driver){
            console.log(colors.green(`${formatTime(new Date())}| Driver was created for ${network}`))
            let importWallet = await handleImportWallet(network, driver, seedPhrases[0])
            if(importWallet){
                console.log(colors.green(`${formatTime(new Date())}| Wallet was imported`))
                let page = await connectWalletToLaunchpad(driver, link)
                if(page){
                    console.log(colors.green(`${formatTime(new Date())}| Page is opened`))
                }else{
                    console.log(colors.red(`${formatTime(new Date())}| Page is not opened`))
                    return
                }


            }else{
                console.log(colors.red(`${formatTime(new Date())}| Wallet not imported for some reasons... Try again...`))
            }
        }else{
            console.log(colors.red(`${formatTime(new Date())}| No found driver for ${network}`))
        }
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| Error in handleEth ${e}`))
    }
}

async function handlePolygon(link, threads, seedPhrases, headless, network){
    try{
        let driver = await createDriver(headless, network)
        if(driver){
            console.log(colors.green(`${formatTime(new Date())}| Driver was created for ${network}`))
            let importWallet = await handleImportWallet(network, driver, seedPhrases[0])
            if(importWallet){
                console.log(colors.green(`${formatTime(new Date())}| Wallet was imported`))
                let page = await connectWalletToLaunchpad(driver, link)
                if(page){
                    console.log(colors.green(`${formatTime(new Date())}| Page is opened`))
                }else{
                    console.log(colors.red(`${formatTime(new Date())}| Page is not opened`))
                    return
                }


            }else{
                console.log(colors.red(`${formatTime(new Date())}| Wallet not imported for some reasons... Try again...`))
            }
        }else{
            console.log(colors.red(`${formatTime(new Date())}| No found driver for ${network}`))
        }
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| Error in handlePolygon ${e}`))
    }
}

async function handleBtc(link, threads, seedPhrases, headless, network){
    try{
        let importWallet = await handleImportWallet(network, driver, seedPhrases[0])
        if(importWallet){
            console.log(colors.green(`${formatTime(new Date())}| Wallet was imported`))
            let page = await connectWalletToLaunchpad(driver, link)
            if(page){
                console.log(colors.green(`${formatTime(new Date())}| Page is opened`))
            }else{
                console.log(colors.red(`${formatTime(new Date())}| Page is not opened`))
                return
            }


        }else{
            console.log(colors.red(`${formatTime(new Date())}| Wallet not imported for some reasons... Try again...`))
        }
       // console.log(`${formatTime(new Date())}| BTC bot is coming...`)
       // return
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| Error in handleBtc ${e}`))
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