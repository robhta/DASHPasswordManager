import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import Login from '../components/Login';
import Passwords from "../components/Passwords";
import NewPassword from "../components/NewPassword"
import './Home.css';
import React from "react";
import PasswordManager from "../passwordmanager/PasswordManager"


export class Home extends React.Component{

    localIndex: number;

    view: {
        login: boolean,
        passwords: boolean,
        new: boolean,
        edit: boolean
    };

    mnemonic: string;

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
        this.mnemonic = "";


        // Dummi-Data
        this.entries = [
        ];

        //Binding functions to this component
        this.callbackParentLogin = this.callbackParentLogin.bind(this);
        this.callbackParentPasswords = this.callbackParentPasswords.bind(this);
        this.callbackParentNewPassword = this.callbackParentNewPassword.bind(this);
        this.callbackParentPasswordDelete = this.callbackParentPasswordDelete.bind(this);
        this.initLocalStorage = this.initLocalStorage.bind(this);


    }

    /**
     * Load all local passwords for rendering
     */
    async initLocalStorage(){
       this.entries = await PasswordManager.getAllLocalPasswords();
        console.log(this.entries);
        this.forceUpdate();

        console.log("local storage set up");
    }


    async fetchingAllPasswords(){
        console.log(await PasswordManager.getAllDashPasswords());
    }

    // Callback functions for children -> parent communication
    callbackParentLogin(mnemonic: string){
        this.view.login = false;
        this.view.passwords = true;

        this.forceUpdate();

        PasswordManager.setUpDash(mnemonic).then(r => console.log("init dash finished"));
        this.initLocalStorage().then(r => console.log("init local storage finished"));
    }

    callbackParentPasswords(){
        this.view.passwords = false;
        this.view.new = true;

        this.forceUpdate();
    }


    async callbackParentPasswordDelete(index: number){
        await PasswordManager.deletePasswordFromDrive(index);

        this.entries = this.entries.filter(function(item, i){
            return i !== index;
        });

        this.forceUpdate();
    }


    async callbackParentNewPassword(entry : any, onlineFlag: boolean){
        this.view.passwords = true;
        this.view.new = false;

        this.entries.push(entry);

        await PasswordManager.createNewPassword(entry, onlineFlag);

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
