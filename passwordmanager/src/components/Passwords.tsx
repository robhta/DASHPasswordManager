import React from 'react';
import {IonButton, IonCard, IonCardContent, IonCardHeader, IonList, IonItem, IonLabel, IonTitle} from "@ionic/react";


interface IPasswordsProps{
    callback(state: number): any,
    entries: Array<any>,
}

export class Passwords extends React.Component<IPasswordsProps>{

    constructor(props: any) {
        super(props);

        this.newPassword = this.newPassword.bind(this);
    }


    newPassword(){
        this.props.callback(0);
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
                        <IonList>
                            {this.props.entries.map((value, index) => {

                                return <IonItem> {value.note} | {value.user} | {value.password}</IonItem>
                            })}
                        </IonList>
                        <IonButton onClick={this.newPassword}>
                            New
                        </IonButton>
                    </IonCardContent>
                </IonCard>
            </div>
        )
    }
}

export default Passwords;