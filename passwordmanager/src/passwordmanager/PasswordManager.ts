import * as dapi from '../drive-persistence/dapi'
import * as pwdManager from '../cryptography/pwdManager'
import * as keyManager from '../keymanagement/keyderivation'
import * as Dash from 'dash'
import * as crypto from 'crypto'
import {Plugins} from "@capacitor/core";

const { Storage } = Plugins;

export class PasswordManager{
    //Variables
    //Dash
    mnemonic: string;
    connection: {
        platform: any,
        identity: Object,
    };

    //Local Storage
    localIndex: number


    constructor() {
        this.connection = {
            platform: {},
            identity: {}
        };
        this.mnemonic = "";
        this.localIndex = -1;
    }

    /**
     * This method inits the dash variables
     * @param mnemonic
     */
    async setUpDash(mnemonic: string){
        console.log("setting up Dash Client")
        this.mnemonic = mnemonic;

        let clientOpts = {
            network: 'testnet',
            wallet: {
                mnemonic: mnemonic
            },
            apps: {
                passwordManager: {
                    contractId: 'AAREKsmfKk9QKX1HPKKnQum7yKuFukxyWpEAuYabVLAs'
                },
            },
            unsafeOptions: {
                skipSynchronizationBeforeHeight: 415000, // only sync from start of 2021
            },
        }

        let client = new Dash.Client(clientOpts);

        console.log("start fetching all identities");
        this.connection.platform = client.platform;
        let identity = null;
        let identities = await dapi.getAllIdentities(client);

        if(identities !== false && identities.length >= 0){
            console.log("Found:");
            console.log(identities);
            identity = identities[0];

            console.log("Use identity:");
            console.log(identity);
        }else if(identities.length === 0){
            console.log("No identities found. Create a new one for you");
            identity = await dapi.createIdentity(this.connection);
        }else{
            console.log("Error while getting all identities");
        }

        console.log("Resolve identity string to dash identity");
        if(identity !== null)
            this.connection.identity = await this.connection.platform.identities.get(identity.getId().toString());
        console.log(this.connection);
        console.log("Required connection information retrieved");
    }


    async getAllDashPasswords(){
        console.log("Fetching all passwords from drive")
        let passwords = await dapi.getAllEntries(this.connection);

        return passwords;
    }

    /**
     * Loads and decrypts all local passwords
     * TODO: improve localIndex generation
     */
    async getAllLocalPasswords() {
        console.log("start init the local storage");
        let keys: any;

        keys = await Storage.keys();
        console.log("Number of local passwords: ", keys.keys.length);
        this.localIndex = keys.keys.length + 1; //Start at an empty index

        let entries = [];

        for (let index in keys.keys) {
            let tmpIndex = parseInt(index) + 1;
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
                console.log("decripted Payload");

                console.log(JSON.parse(decPayload));
                entries.push(JSON.parse(decPayload));
            }
        }
        return entries;
    }

    /**
     *
     * @param index
     */
    async deletePasswordFromDrive(index: number){
        await dapi.deleteEntry(this.connection, index);
    }


    /**
     * Encrypt the password and save it to Drive or Localstorage
     * @param entry
     * @param onlineFlag - 0 = Localstorage        1 = Drive
     */
    async createNewPassword(entry : any, onlineFlag: boolean){
        const privateKey = keyManager.getHDWalletHardendKey(this.mnemonic, "",1, 1, Dash);
        console.log("private key");
        console.log(privateKey);
        const symKey = pwdManager.getKey(privateKey, crypto);
        let payload = pwdManager.fileLevelEncrytion(symKey, JSON.stringify(entry), crypto);
        // @ts-ignore
        payload.index = this.localIndex; //TODO: care about index and delete ts-ignore
        console.log("Payload which is uploaded:");
        console.log(payload);
        if(!onlineFlag){
            //Store all new Entrys to Local Storage
            await Storage.set({
                key: payload.index.toString(),
                value: JSON.stringify({
                    payload : payload.payload,
                    iv : payload.iv,
                    authTag : payload.authTag,
                })
            });
            this.localIndex++;

        }else{
            await dapi.createNewEntry(this.connection, payload);
        }
    }
}

export default new PasswordManager();