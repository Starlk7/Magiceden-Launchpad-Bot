![image](https://github.com/Starlk7/Magiceden-Launchpad-Bot/assets/155927834/daf25198-7063-4651-8f5a-4eb1c28956b4)


# 🤖 MagicEden Launchpad Bot
Tool for mint NFT on Magiceden launchpad.

Using selenium webdriver. Can mint from multiply wallets with threads.

At startup, all windows will be launched and configured one by one, but when the time comes, all configured windows will try to mint at the same time.

Waiting for minting is up to 24 hours, so run this script later than 24 hours before mint.

Now working only with Solana and BTC, other networks is coming...

May not work with open edition, only regular launchpads

## ❓ How to install
* Install [Google Chrome](https://www.google.com/chrome/), if you don't have it
* Install [Node.js](https://nodejs.org/en/download/current)
* Download [this repository](https://github.com/Starlk7/Magiceden-Launchpad-Bot/archive/refs/heads/main.zip)
* Extract archive to folder
* Install requirements by ```install_reqiure.bat``` file
* Update chrome driver to last version by ```update_chrome.bat``` file
* Open ```settings.js``` in text editor (Notepad++ or same) and setup settings [by this guide](https://github.com/Starlk7/Magiceden-Launchpad-Bot/tree/main?tab=readme-ov-file#%EF%B8%8F-settings)
* Start by ```start.bat``` file

## 💡 Features
- [x] Threads
- [x] Multiply wallets
- [x] Network and required wallet detected automatically by link in config
- [x] Solana
- [x] BTC
- [x] Import via private key SOL
- [ ] Import via private key BTC
- [ ] Custom node 
- [ ] ETH
- [ ] Polygon

## 🛠️ Settings

> [!TIP]
> You can change only **launchpad link** and **seed phrases** for comfortable work.

### Threads

Threads for every seedphrase. For example, 5 seed phrases x 2 threads = 10 windows, so monitor system load. By default it is set to 1. 


### Link

Link to launchpad page. 

You can specify a link to the launchpad on any network, the software itself will understand how to connect the wallet and mint.

### SeedPhrases

Seed phrases or private keys to import wallet.

You can specify multiple phrases in array format.

```["grid popular...catch very","[12,766,31...51,61,96]"]```

### Headless

Hide webdriver windows, ```true``` if yes, ```false``` if not.

To understand how the script works, you can run it in false, but for mint you can hide the windows so as not to interfere



## 📑 Troubleshooting
If you get errors related to finding  webdriver, then try updating or reinstalling Google Chrome.

If you get errors related to chrome version, try to "npm install chromedriver --chromedriver_version=LATEST"

Also if you have any errors or bugs, you can tell about it in issues.

Feel free to make donation <3
```GBo3t5rJiS8M6Eq3VFzKXM4TF2UGTQX1XMbSDLAhDLXE```
