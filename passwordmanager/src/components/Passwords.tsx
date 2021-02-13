import React from 'react';
import {IonButton, IonCard, IonCardContent, IonCardHeader, IonInput, IonItem, IonLabel, IonTitle} from "@ionic/react";
import * as dapi from '../../../drive-persistence/dapi'

interface IPasswordsProps{
    callback(state: number): any,
}

export class Passwords extends React.Component<IPasswordsProps>{


    passwords: Array<any>

    constructor(props: any) {
        super(props);

        this.passwords = [
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
            }];
    }



    render(){
        return (
            <div>
                <IonCard>
                    <IonCardHeader>
                        <IonTitle>
                            Passwords
                        </IonTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <ul>
                            {this.passwords.map((value, index) => {
                                return <li key={index}> {value.note} | {value.user} | {value.password}</li>
                            })}
                        </ul>
                        <IonButton>
                            New
                        </IonButton>
                    </IonCardContent>
                </IonCard>
            </div>
        )
    }
}

export default Passwords;