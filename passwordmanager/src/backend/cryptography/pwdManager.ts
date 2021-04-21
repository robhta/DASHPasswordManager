
//AES-256-CBC encryption of an HD-Wallet hardened Private Key
function encryptPrivateKey(privateKey, ENC_VALUE, crypto){
    const hmac = crypto.createHmac('sha512', privateKey).digest();
    const aes_key = hmac.subarray(0,32);
    const aes_iv = hmac.subarray(32,48);
    const aes = crypto.createCipheriv("aes-256-cbc", aes_key, aes_iv);
    const encryptedPrivateKey = aes.update(ENC_VALUE, 'utf8', 'hex') + aes.final('hex')
    return encryptedPrivateKey;
}

//Derive a MasterKey for De/Encryption of Files.
function getMasterKey(privateKey, crypto){
    let ENC_VALUE ='2d650551248d792eabf628f451200d7f51cb63e46aadcbb1038aacb05e8c8aee2d650551248d792eabf628f451200d7f51cb63e46aadcbb1038aacb05e8c8aee'; //TODO: to byteBuffer
    let key = encryptPrivateKey(privateKey, ENC_VALUE, crypto);
    return key;
}

//Split the MasterKey to Symmetric Key to use it in AES
function getFileEncKey(key){
    return Buffer.from(key).subarray(32,64); // 32 Bytes
}

export function getKey(privateKey, crypto){
    const masterkey = getMasterKey(privateKey, crypto);
    return getFileEncKey(masterkey);
}

//Encrytion of Payload, the Encrytion of the Password-Entry
export function fileLevelEncrytion(key, payload, crypto){
    const aes_iv = crypto.randomBytes(12);
    let aes_key = key;
    const aes = crypto.createCipheriv("aes-256-gcm", aes_key, aes_iv);
    const encryptedPayload = aes.update(payload, 'utf8', 'hex') + aes.final('hex');
    const encrptedPayloadAuthTag = aes.getAuthTag();

    let res = {
        payload : encryptedPayload,
        authTag : encrptedPayloadAuthTag,
        iv : aes_iv,
        index : -1
    }
    return res;
}

//Decrytion of an File, here we need some more Information, because we use AES-256-GCM
export function fileLevelDecrytion(aes_key, payload, authTag, aes_iv, crypto){
    const decipher = crypto.createDecipheriv("aes-256-gcm", aes_key, aes_iv);
    decipher.setAuthTag(authTag);
    var decryptedPayload = decipher.update(payload, 'hex', 'utf8') + decipher.final('utf8');
    return decryptedPayload;
}

/*
let a = getMasterKey("1234", "32");
console.log(a);
let b = getFileEncKey(a);
console.log(b);
let c = fileLevelEncrytion(b, "abc:asd, asd:sd");
console.log(c);
let d = fileLevelDecrytion(b, c.payload, c.authTag, c.iv)
console.log(Buffer.from(c.payload));
*/

