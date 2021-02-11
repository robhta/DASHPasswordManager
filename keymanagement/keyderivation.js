const Dash = require('dash');

const { HDPrivateKey } = Dash.Core;
//const privateKey = new HDPrivateKey();
//const key = privateKey.deriveChild(0, true);
const { Mnemonic } = Dash.Core;
const mnemonicNew = new Mnemonic("moment embody rural position pepper boat aunt frost today bulb wrap inhale");
const newKey = mnemonicNew.toHDPrivateKey("1", "testnet");

const newKeyDerived = newKey.deriveChild(2,true);
console.log(newKey.xprivkey);
console.log(newKeyDerived.xprivkey);




//const address = privateKey.toAddress().toString();
//alert(`New private key generated ${privateKey.toString()}`);

