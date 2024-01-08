const settings = require('./settings.js');
const colors = require('colors');
const { checkNetwork } = require('./helper.js');
const { driverController } = require('./handlerWallets.js');

const threads = settings.threads;
const seedPhrases = settings.seedPhrase;
const link = settings.link;
const headless = settings.headless;
let network = ``;


async function init(){
    try{
        if(link && threads && seedPhrases){
            console.log(colors.green(`All settings is good, lets go check it`));
            network = await checkNetwork(link);
            if(network){
                console.log(colors.yellow(`Launchpad in ${network} network | ${link}`));
                if(seedPhrases.length>0){
                    let head = ``;
                    if(headless==1){
                        head = `headless`;
                    }else{
                        head = `no headless`;
                    }
                    console.log(colors.yellow(`Found ${seedPhrases.length} seed phrases with ${threads} threads, total ${threads*seedPhrases.length} windows will be opened in ${head} mode`))
                    await driverController(link, threads, seedPhrases, headless, network);
                }else{
                    console.log(colors.red(`Cant find seed phrases in ${seedPhrases}`))
                    return
                }
            }else{
                console.log(colors.red(`Cant find network for launchpad ${link}`))
                return
            }
        }else{
            console.log(colors.red(`Settings are bad`))
            return
        }
    }catch(e){
        console.log(colors.red(`Error in initinit ${e}`))
    }
}

init()