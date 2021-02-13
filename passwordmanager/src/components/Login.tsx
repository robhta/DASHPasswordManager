import {IonButton, IonInput, IonTitle, IonCardContent, IonCardHeader, IonCard, IonItem, IonLabel} from "@ionic/react";
import './Login.css';
import React from 'react';


const Dash = require('dash');

//For passing props
interface ILoginProps{
    callback(client: Object): any,
}

export class Login extends React.Component<ILoginProps>{
    //Variables
    mnemonic: string;
    clientOpts: {
        network: string,
        wallet: {
            mnemonic: string
        },
        apps: Object
    };

    //Constructor
    constructor(props:any) {
        super(props);

        this.mnemonic = "";

        this.clientOpts = {
            network: 'testnet',
            wallet: {
                mnemonic: "",
            },
            apps: {
            }
        }

        this.state = {show: false};

        //Binding functions to this component
        this.login = this.login.bind(this);
        this.mnemonicChanged = this.mnemonicChanged.bind(this);
    }

    //Functions
    login(){
        const client = new Dash.Client(this.clientOpts);
        console.log("Logged in. Mnemonic is valid.")
        console.log(client);

        this.props.callback(this.mnemonic);
    }

    mnemonicChanged(event: any){
        this.clientOpts["wallet"].mnemonic = event.detail.value;
    }

    render(){
        return (
            (<div>
                <IonCard>
                    <IonCardHeader>
                        <IonTitle>
                            Login
                        </IonTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonItem>
                            <IonLabel position="floating">Enter Mnemonic</IonLabel>
                            <IonInput onIonChange={this.mnemonicChanged}/>
                        </IonItem>
                        <IonButton onClick={this.login}>
                            Login
                        </IonButton>
                    </IonCardContent>
                </IonCard>
            </div> )
        );
    }
}



export default Login;