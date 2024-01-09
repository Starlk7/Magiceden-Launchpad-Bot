const {
    Builder,
    By,
    Key,
    until,
} = require('selenium-webdriver');
const settings = require('./settings.js');
const chrome = require('selenium-webdriver/chrome');
const { sleep, formatTime } = require('./helper.js');
const colors = require('colors');
const threads = settings.threads;
const seedPhrases = settings.seedPhrases;

async function driverController(link, threads, seedPhrases, headless, network){
    try{
        for(let s=0;s<seedPhrases.length;s++){
            for(let i=0;i<threads;i++){
                if(network == 'sol'){
                    await handleSolana(link, seedPhrases[s], headless, network, i, s)
                }else if(network == 'btc'){
                    await handleBtc(link, seedPhrases[s], headless, network, i, s)
                }else if(network == 'eth'){
                    await handleEth(link, seedPhrases[s], headless, network, i, s)
                }else if(network == 'polygon'){
                    await handlePolygon(link, seedPhrases[s], headless, network, i, s)
                }else{
                    console.log(`${formatTime(new Date())}| [Thread#${i+1} | Wallet#${s+1}] Have no network`)
                    return
                }
            }
        }
    }catch(e){
        console.log(`${formatTime(new Date())}| Error in driverController ${e}`)
    }
}

async function createDriver(headless, network, tNum, sNum){
    try{
        console.log(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Creating webdriver for ${network}...`)
        let chromeOptions = new chrome.Options();
        chromeOptions.excludeSwitches('enable-logging');
        chromeOptions.addArguments("--window-size=1280,720")
        if(network=='sol'){
            chromeOptions.addExtensions('./exs/Phantom.crx'); 
        }else if(network=='eth'){
            chromeOptions.addExtensions('./exs/Metamask.crx'); 
        }else if(network=='btc'){
            chromeOptions.addExtensions('./exs/Unisat.crx'); 
        }else if(network=='polygon'){
            chromeOptions.addExtensions('./exs/Metamask.crx'); 
        }else{
            console.log(colors.red(`${formatTime(new Date())}|  [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Cant find network in createdriver ${network}`))
            return
        }
        if(headless==true){
            chromeOptions.addArguments("--headless=new");
        }
        let driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
        return driver
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}|  [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Error in createDriver ${e}`))
    }
}


async function connectWalletToLaunchpad(driver, link, tNum, sNum){



}
async function connectSolanaWalletToLaunchpad(driver, link, tNum, sNum){
    try{
        console.log(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Connecting wallet to launchpad page...`)
        await driver.get(link);
        await sleep(1000)
        try{
            let connectWallet = await driver.wait(until.elementLocated(By.xpath(`//*[@id="__next"]/div[2]/div[1]/header/nav/div[3]/div[2]/div/div[2]/button/span`)), 5000); 
            await connectWallet.click();
        }catch{}

        let dynamicPart = `headlessui-dialog-panel`;
        let phantomWallet = await driver.wait(until.elementLocated(By.xpath(`//*[contains(@id, "${dynamicPart}")]/div[2]/div/div[2]/div/button`)), 500000);
        await sleep(500);
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
        await driver.switchTo().window(handles[0]);

        let dynamicPart2 = `headlessui-dialog-title-`;
        let btbtn = await driver.wait(until.elementLocated(By.xpath(`//*[contains(@id, "${dynamicPart2}")]/svg/path[1]`)), 500000);
        await sleep(500);
        await btbtn.click();


        waitMint(driver)
        return true

    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Error in connectSolanaWalletToLaunchpad ${e}`))
        return
    }
}

async function waitMint(driver){

    let connectWalletPhantom = await driver.wait(until.elementLocated(By.xpath(`//*[@id="root"]/div/div[1]/div[3]/div[2]/div/button[2]`)), 620000000); 
    await connectWalletPhantom.click()
    await sleep(999999)

}


async function handleSolana(link, seed, headless, network, tNum, sNum){
    try{
        let driver = await createDriver(headless, network, tNum, sNum)
        if(driver){
            console.log(colors.green(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Webdriver was created for ${network}`))
            let importWallet = await handleImportWallet(network, driver, seed)
            if(importWallet){
                console.log(colors.green(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Seed was imported to ${network} wallet`))
                let page = await connectSolanaWalletToLaunchpad(driver, link, tNum, sNum)
                if(page){
                    console.log(colors.green(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Wallet is connected`))
                    console.log(colors.yellow(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Waiting to mint`))
                }else{
                    console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Wallet is not connected`))
                    driver.quit()
                    return
                }
            }else{
                console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Wallet not imported for some reasons... Try again...`))
                driver.quit()
                return
            }
        }else{
            console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] No found driver for ${network}`))
            driver.quit()
            return
        }
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Error in handleSolana ${e}`))
        return
    }
}

async function handleEth(link, seed, headless, network, tNum, sNum){
    try{
        let driver = await createDriver(headless, network, tNum, sNum)
        if(driver){
            console.log(colors.green(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Driver was created for ${network}`))
            let importWallet = await handleImportWallet(network, driver, seed)
            if(importWallet){
                console.log(colors.green(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Wallet was imported`))
                let page = await connectWalletToLaunchpad(driver, link, tNum, sNum)
                if(page){
                    console.log(colors.green(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Page is opened`))
                }else{
                    console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Page is not opened`))
                    return
                }


            }else{
                console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Wallet not imported for some reasons... Try again...`))
            }
        }else{
            console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] No found driver for ${network}`))
        }
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Error in handleEth ${e}`))
    }
}

async function handlePolygon(link, seed, headless, network, tNum, sNum){
    try{
        let driver = await createDriver(headless, network, tNum, sNum)
        if(driver){
            console.log(colors.green(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Driver was created for ${network}`))
            let importWallet = await handleImportWallet(network, driver, seed)
            if(importWallet){
                console.log(colors.green(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Wallet was imported`))
                let page = await connectWalletToLaunchpad(driver, link, tNum, sNum)
                if(page){
                    console.log(colors.green(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Page is opened`))
                }else{
                    console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Page is not opened`))
                    return
                }


            }else{
                console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Wallet not imported for some reasons... Try again...`))
            }
        }else{
            console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] No found driver for ${network}`))
        }
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Error in handlePolygon ${e}`))
    }
}

async function handleBtc(link, seed, headless, network, tNum, sNum){
    try{
        let importWallet = await handleImportWallet(network, driver, seed)
        if(importWallet){
            console.log(colors.green(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Wallet was imported`))
            let page = await connectWalletToLaunchpad(driver, link, tNum, sNum)
            if(page){
                console.log(colors.green(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Page is opened`))
            }else{
                console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Page is not opened`))
                return
            }


        }else{
            console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Wallet not imported for some reasons... Try again...`))
        }
       // console.log(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] BTC bot is coming...`)
       // return
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| [Thread#${tNum+1}/${threads} | Wallet#${sNum+1}/${seedPhrases.length}] Error in handleBtc ${e}`))
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