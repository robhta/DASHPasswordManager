import * as dapi from './drive-persistence/dapi'
import * as pwdManager from './cryptography/pwdManager'
import * as keyManager from './keymanagement/keyderivation'
import * as crypto from 'crypto'
import {Plugins} from "@capacitor/core";
//import * as Dash from 'dash'

const Dash = require('dash');
const { Storage } = Plugins;

export class PasswordManager{
    //Variables
    //Dash
    mnemonic: string;
    connection: {
        platform: any,
        identity: Object,
    };
    driveIndex: number;

    //Local Storage
    localIndex: number;
    client: any;


    constructor() {
        this.connection = {
            platform: {},
            identity: {}
        };
        this.mnemonic = "";
        this.localIndex = 0;
        this.driveIndex = 0;
        this.client = "";
    }

    /**
     * This method inits the dash variables
     * @param mnemonic
     */
    async setUpDash(mnemonic: string){
        //Storage.clear();
        console.log("setting up Dash Client")
        this.mnemonic = mnemonic;

        let clientOpts = {
            network: 'testnet',
            wallet: {
                mnemonic: mnemonic,
                unsafeOptions: {
                    skipSynchronizationBeforeHeight: 500000, // only sync from start of 2021
                },
            },
            apps: {
                passwordManager: {
                    contractId: '3QEvxGut8XNiKP7TsFH96bprHSBoY37Brm6KtK1PJRPK'
                },
            }
        }

        this.client = new Dash.Client(clientOpts);
        console.log("start fetching all identities");
        this.connection.platform = this.client.platform;
        //console.log("Client.platform:", this.connection.platform);
        let identity = null;
        let identities = undefined;

        try{
            identities = await dapi.getAllIdentities(this.client);
            console.log("Identities:");
            console.log(identities);
        }catch(e){
            console.log("error while fetching identies", e);
        }

        let size = "null";
        try {
            size = identities.length;
            //console.log("Identieties.length", identities.length)
            //console.log("Number of identities: ", identities.length);
            if(parseInt(size) > 0){
                //console.log("Found:");
                //console.log(identities);
                identity = identities[0];

                console.log("Use identity:");
                console.log(identity);
                try{
                    //console.log("Set Identity Object")
                    this.connection.identity = await this.connection.platform.identities.get(identity);
                    //console.log("Identity Object: ", this.connection.identity);
                }catch(e) {
                    console.log("Error while get Identity Object", e);
                }
            }else if(identities.length == 0){
                console.log("No identities found. Create a new one for you");
                console.log("try to create a identity");
                identity = await dapi.createIdentity(this.client);
                console.log("identity:", identity);
                //this.connection.identity = await this.connection.platform.identities.get(identity.getId().toString());
                this.connection.identity = await this.connection.platform.identities.get(identity.getId().toString());
            }else{
                console.log("Error while getting all identities");
            }
        } catch (e) {
            console.log("error while get length of identites", e);
        }

        console.log(this.connection);
        console.log("Required connection information retrieved");
        console.log("Init drive index");
        await this.initDashPasswordIndex();
        console.log("finished init dash backend");
    }

    async initLocalPasswordIndex(){
        console.log("Start calculating local storage index")
        let keys: any;
        keys = await Storage.keys();

        for(let i = 0; i < keys.keys.length; i++){
            if(this.localIndex < keys.keys[i])
                this.localIndex = parseInt(keys.keys[i]);
        }

        console.log("Highest local storage index: ", this.localIndex);
        this.localIndex++;
        console.log("Set local storage index to: ", this.localIndex);
    }

    async initDashPasswordIndex(){
        let passwords = [];
        passwords = await this.getAllDashPasswordsEncrypted();
        for(let i = 0; i < passwords.length; i++){
            if(passwords[i].data.index > this.driveIndex)
                this.driveIndex = passwords[i].data.index;

        }

        console.log("highest dash index: ", this.driveIndex);
        this.driveIndex++;
        console.log("set dash index to: ", this.driveIndex);

    }


    async getAllDashPasswordsEncrypted(){
        console.log("Fetching all passwords from drive")
        let passwords = await dapi.getAllEntries(this.connection);

        return passwords;
    }

    async getAllDashPasswords(){
        let passwordsEncrypted = [];
        passwordsEncrypted = await this.getAllDashPasswordsEncrypted();

        let passwordsDecrypted = [];

        for(let i = 0; i < passwordsEncrypted.length; i++){
            console.log("Decrypt password: ", i);
            let encryptedPassword = passwordsEncrypted[i];
            console.log("Payload: ", encryptedPassword.data.payload.toString());

            let payload = encryptedPassword.data.payload.toString();
            console.log("Index: ", encryptedPassword.data.index);
            let masterKey = keyManager.getHDWalletHardendKey(this.mnemonic, "", encryptedPassword.data.index, 1, Dash);
            let encKey = pwdManager.getKey(masterKey, crypto);

            let decPayload: any = pwdManager.fileLevelDecrytion(
                encKey,
                payload,
                encryptedPassword.data.authenticationTag,
                encryptedPassword.data.inputVector,
                crypto);

            let decryptedPassword = JSON.parse(decPayload);
            decryptedPassword.online = true;
            decryptedPassword.key = encryptedPassword.data.index;
            passwordsDecrypted.push(decryptedPassword);
        }

        return passwordsDecrypted;
    }

    /**
     * Loads and decrypts all local passwords
     */
    async getAllLocalPasswords() {
        await this.initLocalPasswordIndex();
        console.log("start init the local storage");
        let keys: any;

        keys = await Storage.keys();
        console.log("Number of local passwords: ", keys.keys.length);

        let entries = [];

        for (let i = 0; i < keys.keys.length; i++) {
            let tmpIndex = parseInt(keys.keys[i]);
            console.log("Loading index:", tmpIndex);

            let encryptedItem = await Storage.get({key: tmpIndex.toString()});

            if (typeof encryptedItem.value === "string") {
                let encryptedPayload = JSON.parse(encryptedItem.value);

                let masterKey = keyManager.getHDWalletHardendKey(this.mnemonic, "", tmpIndex, 0, Dash);
                let encKey = pwdManager.getKey(masterKey, crypto);

                let decPayload: any = pwdManager.fileLevelDecrytion(
                    encKey,
                    encryptedPayload.payload,
                    Buffer.from(encryptedPayload.authTag),
                    Buffer.from(encryptedPayload.iv),
                    crypto);

                let decryptedPassword = JSON.parse(decPayload);
                decryptedPassword.online = false;
                decryptedPassword.key = tmpIndex;
                entries.push(decryptedPassword);
            }
        }
        return entries;
    }


    /**
     *
     * @param entry
     */
    async deletePassword(entry: any){
        //await dapi.deleteEntry(this.connection, index);
        console.log("Start deleting: ")
        console.log(entry);

        if(!entry.online){
            await Storage.remove({ key: entry.key });
            console.log("Removed key: ", entry.key);
        }else if(entry.online){
            console.log(await dapi.deleteEntry(this.connection, entry.key));
        }
    }


    /**
     * Encrypt the password and save it to Drive or Localstorage
     * @param entry
     * @param onlineFlag - 0 = Localstorage        1 = Drive
     */
    async createNewPassword(entry : any, onlineFlag: boolean) {
        console.log(this.connection.identity);
        let privateKey = "";

        if(!onlineFlag){
            //console.log("Local PrivKey")
            privateKey = keyManager.getHDWalletHardendKey(this.mnemonic, "", this.localIndex, onlineFlag, Dash);
        }else{
            //console.log("Drive PrivKey")
            privateKey = keyManager.getHDWalletHardendKey(this.mnemonic, "", this.driveIndex, onlineFlag, Dash);
        }

        //console.log("private key");
        //console.log(privateKey);
        const symKey = pwdManager.getKey(privateKey, crypto);
        let payload = pwdManager.fileLevelEncrytion(symKey, JSON.stringify(entry), crypto);

        if(!onlineFlag)
            payload.index = this.localIndex; //TODO: care about index and delete ts-ignore
        else
            payload.index = this.driveIndex;

        //console.log("Payload which is uploaded:");
        //console.log(payload);
        if (!onlineFlag) {
            //Store all new Entrys to Local Storage
            await Storage.set({
                key: payload.index.toString(),
                value: JSON.stringify({
                    payload: payload.payload,
                    iv: payload.iv,
                    authTag: payload.authTag,
                })
            });
            this.localIndex++;

        } else {
            await dapi.createNewEntry(this.connection, payload);
            this.driveIndex++;
        }
    }
}

export default new PasswordManager();