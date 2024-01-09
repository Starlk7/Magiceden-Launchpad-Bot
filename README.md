![image](https://github.com/Starlk7/Magiceden-Launchpad-Bot/assets/155927834/9d77eed5-6f94-4c88-b8bf-f8765b295d74)

# 🤖 MagicEden Launchpad Bot
Tool for mint NFT on Magiceden launchpad.

Using selenium webdriver. Can mint from multiply wallets with threads.

At startup, all windows will be launched and configured one by one, but when the time comes, all configured windows will try to mint at the same time.

Waiting for minting is up to 24 hours, so run this script later than 24 hours before mint.

Now working only with Solana, other networks is coming...

## 📌 Start
* Install [Google Chrome](https://www.google.com/chrome/), if you don't have it
* Install [Node.js](https://nodejs.org/en/download/current)
* Download [this repository](https://github.com/Starlk7/Magiceden-Launchpad-Bot/archive/refs/heads/main.zip)
* Extract archive to folder
* Install requirements by ```install_reqiure.bat``` file
* Install Chrome Webdriver by ```install_driver.bat``` file
* [Setup settings](https://github.com/Starlk7/Magiceden-Launchpad-Bot/blob/main/README.md#settings)
* Start by ```start.bat``` file

## 💡 Features
- [x] Threads
- [x] Multiply wallets
- [x] Network and required wallet detected automatically by link in config
- [x] Solana
- [ ] BTC
- [ ] ETH
- [ ] Polygon

## 🛠️ Settings
### Threads - number - ```1```

Threads for every seedphrase.  1-3 threads recommended.

> [!IMPORTANT]
> For example, 5 seed phrases x 2 threads = 10 windows, so monitor system load.


### Link - string - ```"https://magiceden.io/launchpad/phoenix"```

Link to launchpad page

### SeedPhrases - array - ```["grid popular...catch very","snow across...strike pepper"]```

Seed phrases to mint

### Headless - true or false - ```false```

Hide webdriver window
> [!TIP]
> You can change only **launchpad link** and **seed phrases** for comfortable work.


## 📑 Troubleshooting
If you get errors related to finding  webdriver, then try updating or reinstalling Google Chrome.

Also if you have any errors or bugs, you can tell about it in issues.

Feel free to make donation <3
```GBo3t5rJiS8M6Eq3VFzKXM4TF2UGTQX1XMbSDLAhDLXE```
