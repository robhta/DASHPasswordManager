import React from 'react';
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonList,
    IonItem,
    IonLabel,
    IonTitle,
    IonTextarea,
    IonFab,
    IonFabButton,
    IonIcon
} from "@ionic/react";

import { trash } from 'ionicons/icons';



interface IPasswordsProps {
    callback(state: number): any,
    callbackDelete(index: number): any,
    entries: Array<any>,
}

export class Passwords extends React.Component<IPasswordsProps> {

    constructor(props: any) {
        super(props);

        this.newPassword = this.newPassword.bind(this);
        this.deletePassword = this.deletePassword.bind(this);
    }


    newPassword() {
        this.props.callback(0);
    }

    deletePassword(index: number){
        console.log(index);
        this.props.callbackDelete(index);
    }

    render() {
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
                                return <IonItem key={index}>
                                    <IonLabel position="stacked">Note</IonLabel>
                                    <IonTextarea
                                        readonly
                                        value={value.note}>
                                    </IonTextarea>

                                    <IonLabel position="stacked">Username</IonLabel>
                                    <IonTextarea
                                        readonly
                                        value={value.user}>
                                    </IonTextarea>

                                    <IonLabel position="stacked">Password</IonLabel>
                                    <IonTextarea
                                        readonly
                                        value={value.password}>
                                    </IonTextarea>
                                    <br/>
                                    <IonFab vertical="bottom" horizontal="end" >
                                        <IonFabButton onClick={() => this.deletePassword(index)}>
                                            <IonIcon icon={trash} />
                                        </IonFabButton>
                                    </IonFab>
                                </IonItem>
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