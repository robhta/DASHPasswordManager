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
        //Storage.clear();
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

        console.log(clientOpts.wallet.mnemonic);

        let client = new Dash.Client(clientOpts);

        console.log("start fetching all identities");
        this.connection.platform = client.platform;
        let identity = null;
        let identities = undefined;

        try{
            console.log("start");
            while(identities === undefined){
                console.log("try to fetch all identies");
                identities = await dapi.getAllIdentities(client);
            }

            console.log(identities)
        }catch(e){
            console.log("502 is just a bitch");
        }

        let size = identities.length;
        console.log("Number of identities: ", identities.length);


        if(parseInt(size) > 0){
            console.log("Found:");
            console.log(identities);
            identity = identities[0];

            console.log("Use identity:");
            console.log(identity);
            try{
                console.log("lets go")
                this.connection.identity = await this.connection.platform.identities.get(identity);
            }catch(e){
                console.log("502 is a bitch")
            }

        }else if(identities.length === 0){
            console.log("No identities found. Create a new one for you");
            while(identity === null){
                console.log("try to create a identity");
                identity = await dapi.createIdentity(this.connection);
                console.log(identity);
            }


            this.connection.identity = await this.connection.platform.identities.get(identity.getId().toString());
        }else{
            console.log("Error while getting all identities");
        }

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
                console.log(masterKey)

                let encKey = pwdManager.getKey(masterKey, crypto);
                console.log(encKey)

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
        const privateKey = keyManager.getHDWalletHardendKey(this.mnemonic, "",this.localIndex, onlineFlag, Dash);
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