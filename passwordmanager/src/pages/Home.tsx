import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import Login from '../components/Login';
import Passwords from "../components/Passwords";
import NewPassword from "../components/NewPassword"
import './Home.css';
import React from "react";
import * as dapi from '../drive-persistence/dapi'
import * as pwdManager from '../cryptography/pwdManager'
import * as keyManager from '../keymanagement/keyderivation'

export class Home extends React.Component{

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
        ];

        //Binding functions to this component
        this.callbackParentLogin = this.callbackParentLogin.bind(this);
        this.callbackParentPasswords = this.callbackParentPasswords.bind(this);
        this.callbackParentNewPassword = this.callbackParentNewPassword.bind(this);
        this.callbackParentPasswordDelete = this.callbackParentPasswordDelete.bind(this);
        this.initDash = this.initDash.bind(this);

    }

    /**
     * Before getting all encrypted passwords, we need all connection information.
     * Therefore this function will set up all required information in the connection object
     * for further usage.
     */
    async initDash() {
        console.log("start init Dash")
        this.connection.platform = this.client.platform;
        let identity = null;

        console.log("Fetch Identities");
        let identities = await dapi.getAllIdentities(this.client);
        if(identities !== null ){
            console.log("Found:");
            console.log(identities);
            identity = identities[0];

            console.log("Use identity:");
            console.log(identity);
        }else{
            console.log("No identities found. Create a new one for you");
            identity = await dapi.createIdentity(this.connection);
            identity = identity.getId().toString();
            console.log("Your new identity: ");
            console.log(identity);
        }
        console.log("Resolve identity string to dash identity");
        this.connection.identity = await this.connection.platform.identities.get(identity);
        console.log(this.connection)
        console.log("Required connection information retrieved");

        console.log("Uploading testcase.")
        const entry = {
            index: 0,
            inputVector: Buffer.from("Hallo"),
            authenticationTag: Buffer.from("Hallo"),
            payload: Buffer.from("Hallo")
        };
        console.log(await dapi.createNewEntry(this.connection, entry));
        console.log("Uploaded");
    }

    // Callback functions for children -> parent communication
    callbackParentLogin(client: any, mnemonic: string){
        this.client = client;
        this.view.login = false;
        this.view.passwords = true;
        this.mnemonic = mnemonic;

        this.forceUpdate();

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


    async callbackParentNewPassword(entry : any){
        this.view.passwords = true;
        this.view.new = false;

        this.entries.push(entry);

        //TODO: Do crypto and push to drive
        const privateKey = keyManager.getHDWalletHardendKey(this.mnemonic, "",0, 1);
        console.log("private key")
        console.log(privateKey)
        const symKey = pwdManager.getKey(privateKey);
        let payload = pwdManager.fileLevelEncrytion(symKey, entry.toString());
        payload.index = 0; //TODO: care about index

        await dapi.createNewEntry(this.connection, payload);

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
