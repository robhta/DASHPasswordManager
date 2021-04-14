"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHDWalletHardendKey = void 0;
//BIP32_PATH_ONLINE = "10116'/0'/" //10016' is used by trezor //Onlince Stoage Path
//BIP32_PATH_OFFLINE = "10116'/1'/" //Offline Stoage Path, this is okey, because if we upload an Entry we delete the Local version and only hold a new Uploaded Version!
var ENV_NETWORK = "testnet";
function getHDWalletHardendKey(mnemonic, passphrase, index, onlineFlag, Dash) {
    var Mnemonic = Dash.Core.Mnemonic;
    var mnemonicNew = new Mnemonic(mnemonic);
    var seed = mnemonicNew.toHDPrivateKey(passphrase, ENV_NETWORK);
    var newKey = null;
    var path = "";
    if (onlineFlag) {
        newKey = seed.deriveChild(10116, true).deriveChild(0, true).deriveChild(index, true);
    }
    else {
        newKey = seed.deriveChild(10116, true).deriveChild(1, true).deriveChild(index, true);
    }
    return newKey.xprivkey;
}
exports.getHDWalletHardendKey = getHDWalletHardendKey;
function getNewestIndex() {
}
//getHDWalletHardendKey("moment embody rural position pepper boat aunt frost today bulb wrap inhale", "", 0, 1);
//# sourceMappingURL=keyderivation.js.map