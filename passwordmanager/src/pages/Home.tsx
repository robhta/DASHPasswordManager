import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import Login from '../components/Login';
import Passwords from "../components/Passwords";
import './Home.css';
import React from "react";

export class Home extends React.Component{

    view: {
        login: boolean,
        passwords: boolean,
        new: boolean,
        edit: boolean
    };

    client: Object;

    constructor(props: any) {
        super(props);

        this.view = {
            login: true,
            passwords: false,
            new: false,
            edit: false
        }
        this.client = {};

        this.state = {show: true};

        //Binding functions to this component
        this.callbackParentLogin = this.callbackParentLogin.bind(this);
    }

    callbackParentLogin(client: any){
        this.client = client;
        this.view.login = false;
        this.view.passwords = true;

        this.forceUpdate();

        console.log(this.view);
    }

    callbackParentPasswords(state: number){

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
                    {this.view.passwords && <Passwords callback={this.callbackParentLogin}/>}
                </IonContent>
            </IonPage>
        );
    }
}


export default Home;
