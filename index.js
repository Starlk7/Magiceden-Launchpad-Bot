const settings = require('./settings.js');
const colors = require('colors');
const { checkNetwork, formatTime, startASCII } = require('./helper.js');
const { driverController } = require('./handlerWallets.js');

const threads = settings.threads;
const seedPhrases = settings.seedPhrases;
const link = settings.link;
const headless = settings.headless;
let network = ``;


async function init(){
    try{
        console.log(startASCII)
        if(link && threads && seedPhrases){
            console.log(colors.green(`${formatTime(new Date())}| All settings is good, lets go check it`));
            network = await checkNetwork(link);
            if(network){
                console.log(colors.yellow(`${formatTime(new Date())}| Launchpad in ${network} network | ${link}`));
                if(seedPhrases.length>0){
                    let head = ``;
                    if(headless==true){
                        head = `headless`;
                    }else{
                        head = `no headless`;
                    }
                    console.log(colors.yellow(`${formatTime(new Date())}| Found ${seedPhrases.length} seed phrases with ${threads} threads, total ${threads*seedPhrases.length} windows will be opened in ${head} mode`))

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
            console.log(colors.red(`${formatTime(new Date())}| Settings are bad`))
            return
        }
    }catch(e){
        console.log(colors.red(`${formatTime(new Date())}| Error in initinit ${e}`))
    }
}

init()