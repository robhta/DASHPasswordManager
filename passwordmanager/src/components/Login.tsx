import {IonButton, IonInput, IonTitle, IonCardContent, IonCardHeader, IonCard, IonItem, IonLabel} from "@ionic/react";
import './Login.css';
import React from 'react';


const Dash = require('dash');

//For passing props
interface ILoginProps{
    callback(mnemonic: string): any,
}

export class Login extends React.Component<ILoginProps>{
    //Variables
    mnemonic: string;

    //Constructor
    constructor(props:any) {
        super(props);

        this.mnemonic = ""; //TODO: change default value!


        this.state = {show: false};

        //Binding functions to this component
        this.login = this.login.bind(this);
        this.mnemonicChanged = this.mnemonicChanged.bind(this);
    }

    //Functions
    login(){
        this.props.callback(this.mnemonic);
    }

    mnemonicChanged(event: any){
        this.mnemonic = event.detail.value;
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