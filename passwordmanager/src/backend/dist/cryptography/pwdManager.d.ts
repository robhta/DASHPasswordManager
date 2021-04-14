/// <reference types="node" />
export declare function getKey(privateKey: any, crypto: any): Buffer;
export declare function fileLevelEncrytion(key: any, payload: any, crypto: any): {
    payload: any;
    authTag: any;
    iv: any;
    index: number;
};
export declare function fileLevelDecrytion(aes_key: any, payload: any, authTag: any, aes_iv: any, crypto: any): any;
