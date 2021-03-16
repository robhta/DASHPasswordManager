//BIP32_PATH_ONLINE = "10116'/0'/" //10016' is used by trezor //Onlince Stoage Path
//BIP32_PATH_OFFLINE = "10116'/1'/" //Offline Stoage Path, this is okey, because if we upload an Entry we delete the Local version and only hold a new Uploaded Version!
const ENV_NETWORK = "testnet"


export function getHDWalletHardendKey(mnemonic, passphrase, index, onlineFlag, Dash){
    const { Mnemonic } = Dash.Core;
    const mnemonicNew = new Mnemonic("moment embody rural position pepper boat aunt frost today bulb wrap inhale");
    const seed = mnemonicNew.toHDPrivateKey(passphrase, ENV_NETWORK);
    let newKey = null;

    let path = "";
    if(onlineFlag){
        newKey = seed.deriveChild(10116,true).deriveChild(0,true).deriveChild(index, true);
    } else {
        newKey = seed.deriveChild(10116,true).deriveChild(1,true).deriveChild(index, true);
    }
    console.log(newKey.xprivkey);
    return newKey;

}

function getNewestIndex(){

}

//getHDWalletHardendKey("moment embody rural position pepper boat aunt frost today bulb wrap inhale", "", 0, 1);

