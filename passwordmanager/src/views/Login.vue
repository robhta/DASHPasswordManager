<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Login</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <ion-item>
        <ion-label position="floating">Enter Mnemonic</ion-label>
        <ion-input v-model="this.clientOpts.wallet.mnemonic"></ion-input>
      </ion-item>
      <ion-button color="primary" @click="this.login()">Login</ion-button>
    </ion-card-content>

  </ion-card>


</template>

<script>
import { IonCard, IonCardContent, IonCardTitle, IonLabel, IonInput, IonItem, IonButton , IonCardHeader  } from '@ionic/vue';

export default({
  components: { IonCard, IonCardContent, IonCardTitle, IonInput, IonItem, IonLabel, IonButton, IonCardHeader },
  data() {
    return {
      clientOpts: {
        network: 'testnet',
        wallet: {
          mnemonic: "",
        },
      }
    }
  },
  methods:{
    login(){
      const mnemonic = this.clientOpts.wallet.mnemonic;
      this.$router.push({ name: 'passwords', params: { mnemonic: mnemonic }});
    },
  },

});
</script>