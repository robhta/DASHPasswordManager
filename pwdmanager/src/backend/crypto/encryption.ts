import * as crypto from 'crypto'

export type EncryptedEntity = {
    payload: string;
    authTag: Buffer,
    iv: Buffer;
    index: number;
}

export class Encryption {
    constructor() {

    }

    //AES-256-CBC encryption of an HD-Wallet hardened Private Key
    private encryptPrivateKey(privateKey: Buffer, ENC_VALUE: string): string {
        const hmac = crypto.createHash('sha512', privateKey).digest();
        const aesKey = hmac.subarray(0,32);
        const aesInputVector = hmac.subarray(32,48);
        const aes = crypto.createCipheriv('aes-256-cbc', aesKey, aesInputVector);
        const encryptedPrivateKey = aes.update(ENC_VALUE, 'utf8', 'hex') + aes.final('hex');
        return encryptedPrivateKey;
    }

    //Derive a MasterKey for De/Encryption of Files.
    private getMasterKey(privateKey: Buffer): string {
        const ENC_VALUE = '2d650551248d792eabf628f451200d7f51cb63e46aadcbb1038aacb05e8c8aee2d650551248d792eabf628f451200d7f51cb63e46aadcbb1038aacb05e8c8aee';
        const key = this.encryptPrivateKey(privateKey, ENC_VALUE);
        return key;
    }

    //Split the MasterKey to Symmetric Key to use it in AES
    private getFileEncKey(privateKey: string): Buffer {
        return Buffer.from(privateKey).subarray(32,64);
    }

    public getKey(privateKey: Buffer): Buffer {
        const masterKey = this.getMasterKey(privateKey);
        return this.getFileEncKey(masterKey);
    }

    //Encrytion of Payload, the Encrytion of the Password-Entry
    public fileLevelEncryption(privateKey: Buffer, payload: string): EncryptedEntity {
        const aesInputVector = crypto.randomBytes(12);
        const aesKey = privateKey;
        const aes = crypto.createCipheriv('aes-256-gcm', aesKey, aesInputVector);
        const encryptedPayload = aes.update(payload, 'utf8', 'hex') + aes.final('hex');
        const encrptedPayloadAuthTag = aes.getAuthTag();

        return {
            payload : encryptedPayload,
            authTag : encrptedPayloadAuthTag,
            iv : aesInputVector,
            index : -1
        }
    }

    //Decrytion of an File, here we need some more Information, because we use AES-256-GCM
    public fileLevelDecryption(aesKey: Buffer, payload: string, authTag: Buffer, aesInputVector: Buffer): string {
        const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, aesInputVector);
        decipher.setAuthTag(authTag);
        return decipher.update(payload, 'hex', 'utf8') + decipher.final('utf8');
    }
}