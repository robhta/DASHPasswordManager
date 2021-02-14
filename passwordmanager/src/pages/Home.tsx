import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import Login from '../components/Login';
import Passwords from "../components/Passwords";
import NewPassword from "../components/NewPassword"
import './Home.css';
import React from "react";
import * as dapi from '../drive-persistence/dapi'

export class Home extends React.Component{

    view: {
        login: boolean,
        passwords: boolean,
        new: boolean,
        edit: boolean
    };

    client: any;
    connection: {
        platform: Object,
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
        this.connection = {
            platform: {},
            identity: {}
        }

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
        this.initDash = this.initDash.bind(this);

    }

    initDash(){
        console.log("Init Dash")
        this.connection.platform = this.client.platform;

        console.log("Fetch Identities");
        console.log(dapi.getAllIdentities(this.client));
    }

    callbackParentLogin(client: any){
        this.client = client;
        this.view.login = false;
        this.view.passwords = true;

        this.forceUpdate();

        this.initDash();
    }

    callbackParentPasswords(){
        this.view.passwords = false;
        this.view.new = true;

        this.forceUpdate();
    }

    callbackParentNewPassword(entry : any){
        this.view.passwords = true;
        this.view.new = false;

        this.entries.push(entry);

        //TODO: Do crypto and push to drive

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
                    {this.view.passwords && <Passwords callback={this.callbackParentPasswords} entries={this.entries}/>}
                    {this.view.new && <NewPassword callback={this.callbackParentNewPassword}/>}
                </IonContent>
            </IonPage>
        );
    }
}


export default Home;
