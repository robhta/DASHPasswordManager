"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encryption = void 0;
const crypto = __importStar(require("crypto"));
class Encryption {
    constructor() {
    }
    //AES-256-CBC encryption of an HD-Wallet hardened Private Key
    encryptPrivateKey(privateKey, ENC_VALUE) {
        const hmac = crypto.createHash('sha512', privateKey).digest();
        const aesKey = hmac.subarray(0, 32);
        const aesInputVector = hmac.subarray(32, 48);
        const aes = crypto.createCipheriv('aes-256-cbc', aesKey, aesInputVector);
        const encryptedPrivateKey = aes.update(ENC_VALUE, 'utf8', 'hex') + aes.final('hex');
        return encryptedPrivateKey;
    }
    //Derive a MasterKey for De/Encryption of Files.
    getMasterKey(privateKey) {
        const ENC_VALUE = '2d650551248d792eabf628f451200d7f51cb63e46aadcbb1038aacb05e8c8aee2d650551248d792eabf628f451200d7f51cb63e46aadcbb1038aacb05e8c8aee';
        const key = this.encryptPrivateKey(privateKey, ENC_VALUE);
        return key;
    }
    //Split the MasterKey to Symmetric Key to use it in AES
    getFileEncKey(privateKey) {
        return Buffer.from(privateKey).subarray(32, 64);
    }
    getKey(privateKey) {
        const masterKey = this.getMasterKey(privateKey);
        return this.getFileEncKey(masterKey);
    }
    //Encrytion of Payload, the Encrytion of the Password-Entry
    fileLevelEncryption(privateKey, payload) {
        const aesInputVector = crypto.randomBytes(12);
        const aesKey = privateKey;
        const aes = crypto.createCipheriv('aes-256-gcm', aesKey, aesInputVector);
        const encryptedPayload = aes.update(payload, 'utf8', 'hex') + aes.final('hex');
        const encrptedPayloadAuthTag = aes.getAuthTag();
        return {
            payload: encryptedPayload,
            authTag: encrptedPayloadAuthTag,
            iv: aesInputVector,
            index: -1
        };
    }
    //Decrytion of an File, here we need some more Information, because we use AES-256-GCM
    fileLevelDecryption(aesKey, payload, authTag, aesInputVector) {
        const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, aesInputVector);
        decipher.setAuthTag(authTag);
        return decipher.update(payload, 'hex', 'utf8') + decipher.final('utf8');
    }
}
exports.Encryption = Encryption;
