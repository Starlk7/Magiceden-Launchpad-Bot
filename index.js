const { checkNetwork, formatTime, startASCII, colors, settings } = require('./helper.js');
const { solanaController } = require('./controllers/solanaController.js');
const { btcController } = require('./controllers/btcController.js');
const { ethController } = require('./controllers/ethController.js');
const { polygonController } = require('./controllers/polygonController.js');

const threads = settings.threads;
const seedPhrases = settings.seedPhrases;
const link = settings.link;
const headless = settings.headless;
let network = ``;

async function init(){
    try{
        console.log(startASCII)
        if(link && threads && seedPhrases){
            network = await checkNetwork(link);
            if(network){
                console.log(colors.yellow(`${formatTime(new Date())}| Launchpad in ${network} network | ${link}`));
                if(seedPhrases.length>0){
                    let head = `No headless`;
                    if(headless){
                        head = `Headless`;
                    }
                    console.log(colors.yellow(`${formatTime(new Date())}| Seeds: ${seedPhrases.length} | Threads: ${threads} | Total windows: ${threads*seedPhrases.length} | ${head} mode`))
                    await driverController(link, threads, seedPhrases, headless, network);
                }else{
                    console.log(colors.red(`${formatTime(new Date())}| Cant find seed phrases in ${seedPhrases}`))
                    return
                }
            }else{
                console.log(colors.red(`${formatTime(new Date())}| Cant find network for launchpad ${link}`))
                return
            }
        }else{
            console.log(colors.red(`${formatTime(new Date())}| Settings not filled`))
            return
        }
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| Error in init ${e}`))
    }
}

async function driverController(link, threads, seedPhrases, headless, network){
    try{
        for(let s=0;s<seedPhrases.length;s++){
            for(let i=0;i<threads;i++){
                if(network == 'sol'){
                    await solanaController(link, seedPhrases[s], headless, network, i, s)
                }else if(network == 'btc'){
                    await btcController(link, seedPhrases[s], headless, network, i, s)
                }else if(network == 'eth'){
                    await ethController(link, seedPhrases[s], headless, network, i, s)
                }else if(network == 'polygon'){
                    await polygonController(link, seedPhrases[s], headless, network, i, s)
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


init()