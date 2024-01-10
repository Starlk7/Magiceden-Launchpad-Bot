const { formatTime, colors, settings } = require('./helper.js');
const { solanaController } = require('./controllers/solanaController.js');
const { btcController } = require('./controllers/btcController.js');
const { ethController } = require('./controllers/ethController.js');
const { polygonController } = require('./controllers/polygonController.js');

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

module.exports = {
    driverController
};