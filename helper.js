const colors = require('colors');

async function checkNetwork(link){
    try{
        if(link){
            if(link.includes(`/ordinals/launchpad/`)){
                return 'btc'
            }else if(link.includes(`/launchpad/eth/`)){
                return 'eth'
            }else if(link.includes(`/launchpad/polygon/`)){
                return 'polygon'
            }else{
                return 'sol'
            }
        }else{
            console.log(colors.red(`No link in checkNetwork`))
            return
        }
    }catch(e){
        console.log(colors.red(`Error in checkNetwork ${e}`))
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


module.exports = {
    checkNetwork,
    sleep
};