const {
    Builder,
    By,
    Key,
    until,
} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { sleep } = require('./helper.js');
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
            console.log(`Have no network`)
            return
        }
    }catch(e){
        console.log(`Error in driverController ${e}`)
    }
}

async function createDriver(headless, network){
    try{
        console.log(`Creating driver for ${network}...`)
        let chromeOptions = new chrome.Options();
        if(network=='sol'){
            chromeOptions.addExtensions('./exs/Phantom.crx'); 
        }else if(network=='eth'){
            chromeOptions.addExtensions('./exs/Metamask.crx'); 
        }else if(network=='btc'){
            chromeOptions.addExtensions('./exs/Unisat.crx'); 
        }else if(network=='polygon'){
            chromeOptions.addExtensions('./exs/Metamask.crx'); 
        }else{
            console.log(colors.red(`Cant find network in create driver`))
            return
        }
    
        if(headless==1){
            chromeOptions.addArguments("--headless=new");
        }
        let driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
        return driver
    }catch(e){
        console.log(colors.red(`Error in createDriver ${e}`))
    }
}


async function connectWalletToLaunchpad(driver, link){
    try{
        console.log(`Connecting wallet to launchpad page...`)
        await driver.get(link);
        await sleep(1000)
        console.log(`Page is loaded`)
        try{
            let connectWallet = await driver.wait(until.elementLocated(By.xpath(`//*[@id="__next"]/div[2]/div[1]/header/nav/div[3]/div[2]/div/div[2]/button/span`)), 5000); 
            await connectWallet.click();
        }catch(e){

        }

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
        console.log(handles)
        await driver.switchTo().window(handles[0]);
      
        let signInBtn = await driver.wait(until.elementLocated(By.xpath(`//*[@id="headlessui-dialog-panel-:rq:"]/div[2]/div/div[4]/button[2]`)), 5000); 
        await signInBtn.click();     
        try{
            let changeWallet = await driver.wait(until.elementLocated(By.xpath(`//*[@id="headlessui-dialog-panel-:rq:"]/div[2]/div/div[4]/button[1]`)), 5000); 
            await changeWallet.click();
            return await connectWalletToLaunchpad(driver, link)
        }catch(e){
            console.log(e)
        }  

    }catch(e){
        console.log(colors.red(`Error in connectWalletToLaunchpad ${e}`))
        return
    }
}




async function handleSolana(link, threads, seedPhrases, headless, network){
    try{
        let driver = await createDriver(headless, network)
        if(driver){
            console.log(colors.green(`Driver was created for ${network}`))
            let importWallet = await handleImportWallet(network, driver, seedPhrases[0])
            if(importWallet){
                console.log(colors.green(`Wallet was imported`))
                let page = await connectWalletToLaunchpad(driver, link)
                if(page){
                    console.log(colors.green(`Wallet is connected`))
                }else{
                    console.log(colors.red(`Wallet is not connected`))
                    return
                }
            }else{
                console.log(colors.red(`Wallet not imported for some reasons... Try again...`))
                return
            }
        }else{
            console.log(colors.red(`No found driver for ${network}`))
            return
        }
    }catch(e){
        console.log(colors.red(`Error in handleSolana ${e}`))
        return
    }
}

async function handleEth(link, threads, seedPhrases, headless, network){
    try{
        let driver = await createDriver(headless, network)
        if(driver){
            console.log(colors.green(`Driver was created for ${network}`))
            let importWallet = await handleImportWallet(network, driver, seedPhrases[0])
            if(importWallet){
                console.log(colors.green(`Wallet was imported`))
                let page = await connectWalletToLaunchpad(driver, link)
                if(page){
                    console.log(colors.green(`Page is opened`))
                }else{
                    console.log(colors.red(`Page is not opened`))
                    return
                }


            }else{
                console.log(colors.red(`Wallet not imported for some reasons... Try again...`))
            }
        }else{
            console.log(colors.red(`No found driver for ${network}`))
        }
    }catch(e){
        console.log(colors.red(`Error in handleEth ${e}`))
    }
}

async function handlePolygon(link, threads, seedPhrases, headless, network){
    try{
        let driver = await createDriver(headless, network)
        if(driver){
            console.log(colors.green(`Driver was created for ${network}`))
            let importWallet = await handleImportWallet(network, driver, seedPhrases[0])
            if(importWallet){
                console.log(colors.green(`Wallet was imported`))
                let page = await connectWalletToLaunchpad(driver, link)
                if(page){
                    console.log(colors.green(`Page is opened`))
                }else{
                    console.log(colors.red(`Page is not opened`))
                    return
                }


            }else{
                console.log(colors.red(`Wallet not imported for some reasons... Try again...`))
            }
        }else{
            console.log(colors.red(`No found driver for ${network}`))
        }
    }catch(e){
        console.log(colors.red(`Error in handlePolygon ${e}`))
    }
}

async function handleBtc(link, threads, seedPhrases, headless, network){
    try{
        let importWallet = await handleImportWallet(network, driver, seedPhrases[0])
        if(importWallet){
            console.log(colors.green(`Wallet was imported`))
            let page = await connectWalletToLaunchpad(driver, link)
            if(page){
                console.log(colors.green(`Page is opened`))
            }else{
                console.log(colors.red(`Page is not opened`))
                return
            }


        }else{
            console.log(colors.red(`Wallet not imported for some reasons... Try again...`))
        }
       // console.log(`BTC bot is coming...`)
       // return
    }catch(e){
        console.log(colors.red(`Error in handleBtc ${e}`))
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
            console.log(`Coming soon...`)
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
            console.log(colors.red(`Have no network in handleImportWallet`))
            return false
        }
    }catch(e){
        console.log(colors.red(`Error in handleImportWallet ${e}`))
        return false
    }
}




module.exports = {
    driverController
};