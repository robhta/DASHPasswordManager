const crypto = require('crypto');


const BIP32_PATH = "10116'/0" //10016' is used by trezor

function getMasterKey(privateKey, path){
    let ENC_VALUE ='2d650551248d792eabf628f451200d7f51cb63e46aadcbb1038aacb05e8c8aee2d650551248d792eabf628f451200d7f51cb63e46aadcbb1038aacb05e8c8aee'; //TODO: to byteBuffer
    let key = encryptPrivateKey(privateKey, ENC_VALUE);
    return key;
}

function encryptPrivateKey(privateKey, ENC_VALUE){
    const hmac = crypto.createHmac('sha512', privateKey).digest();
    const aes_key = hmac.subarray(0,32);
    const aes_iv = hmac.subarray(32,48);
    const aes = crypto.createCipheriv("aes-256-cbc", aes_key, aes_iv);
    const encryptedPrivateKey = aes.update(ENC_VALUE, 'utf8', 'hex') + aes.final('hex')
    return encryptedPrivateKey;
   /* console.log("Verschlüsselung:")
    console.log(encrypted);
    const decipher = crypto.createDecipheriv("aes-256-cbc", aes_key, aes_iv);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8'); //deciphered text
    console.log("Entschlüsselung:")
    console.log(decrypted);*/
}

function getFileEncKey(key){
    return Buffer.from(key).subarray(32,64); // 32 Bytes
}

function fileLevelEncrytion(key, payload){
    const aes_iv = crypto.randomBytes(12); //TODO: RNG methods proof
    console.log("Random?");
    console.log(aes_iv);
    let aes_key = key;

    const aes = crypto.createCipheriv("aes-256-gcm", aes_key, aes_iv);
    const encryptedPayload = aes.update(payload, 'utf8', 'hex') + aes.final('hex');
    console.log("AuthTag");
    const encrptedPayloadAuthTag = aes.getAuthTag();
    console.log(encrptedPayloadAuthTag);


    console.log("Verschlüsselung:")
    console.log(encryptedPayload);
    const decipher = crypto.createDecipheriv("aes-256-gcm", aes_key, aes_iv);
    decipher.setAuthTag(encrptedPayloadAuthTag);
    var decrypted = decipher.update(encryptedPayload, 'hex', 'utf8') + decipher.final('utf8'); //deciphered text
    console.log("Entschlüsselung:")
    console.log(decrypted);


    return Buffer.from(encryptedPayload);

}

let a = getMasterKey("1234", "32");
console.log(a);
let b = getFileEncKey(a);
console.log(b);
let c = fileLevelEncrytion(b, "abc:asd, asd:sd");
console.log(c);

