import React from 'react';
import {IonButton, IonCard, IonCardContent, IonCardHeader, IonInput, IonItem, IonLabel, IonTitle} from "@ionic/react";


interface INewPasswordProps{
    callback(entry: any): any,
}

export class NewPassword extends React.Component<INewPasswordProps>{
    entry: {
        user: string,
        password: string,
        note: string,
    }

    constructor(props: any) {
        super(props);

        this.entry = {
            user: "",
            password: "",
            note: "",
        }

        this.usernameChanged = this.usernameChanged.bind(this);
        this.passwordChanged = this.passwordChanged.bind(this);
        this.noteChanged = this.noteChanged.bind(this);
        this.addNewEntry = this.addNewEntry.bind(this);
    }

    usernameChanged(e: any){
        this.entry.user = e.detail.value;
    }

    passwordChanged(e: any){
        this.entry.password = e.detail.value;
    }

    noteChanged(e: any){
        this.entry.note = e.detail.value;
    }

    addNewEntry(){
        this.props.callback(this.entry);
    }

    render(){
        return (
            <IonCard>
                <IonCardHeader>
                    <IonTitle>
                        Add new password
                    </IonTitle>
                </IonCardHeader>
                <IonCardContent>
                    <IonItem>
                        <IonLabel position="floating">Enter username</IonLabel>
                        <IonInput onIonChange={this.usernameChanged}/>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Enter password</IonLabel>
                        <IonInput onIonChange={this.passwordChanged}/>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Enter note</IonLabel>
                        <IonInput onIonChange={this.noteChanged}/>
                    </IonItem>
                    <IonButton onClick={this.addNewEntry}>
                        Add
                    </IonButton>
                </IonCardContent>
            </IonCard>
        )
    }
}

export default NewPassword;