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

function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


let startASCII = ` _______             _       _______    _                ______  _______ ______
(_______)           (_)     (_______)  | |              (____  \(_______|_______)
 _  _  _ _____  ____ _  ____ _____   __| |_____ ____     ____)  )_    _    _    
| ||_|| (____ |/ _  | |/ ___)  ___) / _  | ___ |  _ \    |  __  (| |  | |  | |   
| |   | / ___ ( (_| | ( (___| |____( (_| | ____| | | |  | |__)  ) |__| |  | |   
|_|   |_\______|\____|_|\______)_______)____|_____)_| |_|  |______/ \_____/   |_|   
              (_____|                                                            `

module.exports = {
    checkNetwork,
    sleep,
    startASCII,
    formatTime
};