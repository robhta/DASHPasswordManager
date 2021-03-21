import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import Login from '../components/Login';
import Passwords from "../components/Passwords";
import NewPassword from "../components/NewPassword"
import './Home.css';
import React from "react";
import * as dapi from '../drive-persistence/dapi'
import * as pwdManager from '../cryptography/pwdManager'
import * as keyManager from '../keymanagement/keyderivation'
import * as Dash from 'dash'
import * as crypto from 'crypto'

import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

export class Home extends React.Component{

    localIndex: number;

    view: {
        login: boolean,
        passwords: boolean,
        new: boolean,
        edit: boolean
    };

    client: any;
    mnemonic: string;
    connection: {
        platform: any,
        identity: Object,
    };

    entries: Array<any>;

    constructor(props: any) {
        super(props);

        this.localIndex = 0;

        this.view = {
            login: true,
            passwords: false,
            new: false,
            edit: false
        }
        this.client = {};
        this.mnemonic = "";
        this.connection = {
            platform: {},
            identity: {}
        }

        // Dummi-Data
        this.entries = [
            /*
            {
                user: "DennisO",
                password: "FirstPassword",
                note: "pornhub.com"
            },
            {
                user: "Herbert",
                password: "SecondPassword",
                note: "Schneesen.de"
            },
            {
                user: "DasBouu",
                password: "ThirdPassword",
                note: "someRandom.org"
            }

             */
        ];

        //Binding functions to this component
        this.callbackParentLogin = this.callbackParentLogin.bind(this);
        this.callbackParentPasswords = this.callbackParentPasswords.bind(this);
        this.callbackParentNewPassword = this.callbackParentNewPassword.bind(this);
        this.callbackParentPasswordDelete = this.callbackParentPasswordDelete.bind(this);
        this.initLocalStorage = this.initLocalStorage.bind(this);
        this.initDash = this.initDash.bind(this);


    }

    /**
     * Initialisiert den Localstorage.
     * TODO: localIndex verbessern
     */
    async initLocalStorage(){
        console.log("start init the local storage")

        let keys : any;

        //Returns an Object like this {keys:[key1,key2,key3,...]}
        keys = await Storage.keys();
        console.log("Number of local passwords: ", keys.keys.length);
        this.localIndex = keys.keys.length + 1; //Start at an empty index


        for(let index in keys.keys){
            let tmpIndex = parseInt(index) + 1;
            console.log("Loading index:", tmpIndex);

            let encryptedItem = await Storage.get({key: tmpIndex.toString()});

            if (typeof encryptedItem.value === "string") {
                let encryptedPayload = JSON.parse(encryptedItem.value);

                let masterKey = keyManager.getHDWalletHardendKey(this.mnemonic, "", tmpIndex, 0, Dash);

                let encKey = pwdManager.getKey(masterKey, crypto);

                let decPayload : any = pwdManager.fileLevelDecrytion(
                    encKey,
                    encryptedPayload.payload,
                    Buffer.from(encryptedPayload.authTag),
                    Buffer.from(encryptedPayload.iv),
                    crypto);
                console.log("decripted Payload");

                console.log(JSON.parse(decPayload));
                this.entries.push(JSON.parse(decPayload));
            }




        }
        console.log(this.entries);
        this.forceUpdate();

        console.log("local storage set up");
    }

    /**
     * Before getting all encrypted passwords, we need all connection information.
     * Therefore this function will set up all required information in the connection object
     * for further usage.
     */
    async initDash() {
        //Fetch all local stored Entries
        console.log("start init Dash")
        this.connection.platform = this.client.platform;
        let identity = null;

        console.log("Fetch Identities");

        let i = 0;
        let identities = null;
        let keepTrying;
        do {
            try {
                console.log("Identity Try: ", i);
                keepTrying = await dapi.getAllIdentities(this.client);
                i++;
                console.log("keepTrying: ", keepTrying);
            } catch {
                keepTrying = false;
            }
        } while (keepTrying)

        if(identities !== null ){
            console.log("Found:");
            console.log(identities);
            identity = identities[0];

            console.log("Use identity:");
            console.log(identity);
        }else{
            console.log("No identities found. Create a new one for you");
            let i = 0;
            do {
                try {
                    console.log("Identity Try: ", i);
                    identity = await dapi.createIdentity(this.connection);
                    i++;
                } catch {
                    identity = false;
                }
            } while (identity)
           // identity = await dapi.createIdentity(this.connection);
            identity = identity.getId().toString();
            console.log("Your new identity: ");
            console.log(identity);
        }

/*        let a = await this.setObject();
        let b = await this.getObject();
        let c = await this.setItem();
        console.log("AUSGABEN:")
        console.log(Storage);
        console.log(Storage.set({
            key: "hallo",
            value: "sd"
        }));
        console.log(Storage.get({ key: "hallo"}));*/



        console.log("Resolve identity string to dash identity");
        this.connection.identity = await this.connection.platform.identities.get(identity);
        console.log(this.connection)
        console.log("Required connection information retrieved");

        await this.fetchingAllPasswords();
    }


    async fetchingAllPasswords(){
        console.log("fetch pws:");
        let i = 0;
        let passwords = null;

        let keepTrying;
        do {
            try {
                console.log("Try: ", i);
                passwords = await dapi.getAllEntries(this.connection);
                i++;
            } catch {
                passwords = false;
            }
        } while (passwords)


        //let passwords = await dapi.getAllEntries(this.connection);

        console.log(passwords);

    }

    // Callback functions for children -> parent communication
    callbackParentLogin(client: any, mnemonic: string){
        this.client = client;
        this.view.login = false;
        this.view.passwords = true;
        this.mnemonic = mnemonic;

        this.forceUpdate();

        this.initLocalStorage().then(r => console.log("init local storage finished"));
        this.initDash().then(r => console.log("init dash finished"));
    }

    callbackParentPasswords(){
        this.view.passwords = false;
        this.view.new = true;

        this.forceUpdate();
    }


    async callbackParentPasswordDelete(index: number){
        await dapi.deleteEntry(this.connection, index);


        this.entries = this.entries.filter(function(item, i){
            return i !== index;
        });

        this.forceUpdate();
    }


    async callbackParentNewPassword(entry : any, onlineFlag: boolean){
        this.view.passwords = true;
        this.view.new = false;

        this.entries.push(entry);

        //TODO: Do crypto and push to drive
        const privateKey = keyManager.getHDWalletHardendKey(this.mnemonic, "",1, 1, Dash);
        console.log("private key")
        console.log(privateKey)
        const symKey = pwdManager.getKey(privateKey, crypto);
        let payload = pwdManager.fileLevelEncrytion(symKey, JSON.stringify(entry), crypto);
        payload.index = this.localIndex; //TODO: care about index
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
            //Store all new Entrys to Dapi Storage
            let i = 0;
            let keepTrying;

            do {
                try {
                    keepTrying = await dapi.createNewEntry(this.connection, payload);
                    console.log("Try: ", i);
                    i++;
                } catch {
                    keepTrying = false;
                }
            } while (keepTrying)

            //await dapi.createNewEntry(this.connection, payload);

        }

        this.forceUpdate();
    }

    render(){
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Dash Password Manager</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <IonHeader collapse="condense">
                        <IonToolbar>
                            <IonTitle size="large">Dash Password Manager</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    {this.view.login && <Login callback={this.callbackParentLogin}/>}
                    {this.view.passwords && <Passwords callbackDelete={this.callbackParentPasswordDelete} callback={this.callbackParentPasswords} entries={this.entries}/>}
                    {this.view.new && <NewPassword callback={this.callbackParentNewPassword}/>}
                </IonContent>
            </IonPage>
        );
    }
}


export default Home;
