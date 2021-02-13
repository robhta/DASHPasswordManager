<template>
  <div>
    <ion-card v-if="!view.add">
      <ion-card-header>
        <ion-card-title>Passwords</ion-card-title>
      </ion-card-header>

      <ion-card-content>
        <ion-list v-for="(password,i) in passwords" :key='i'>
          {{ password }}
        </ion-list>
        <ion-button @click="view.add = true">New</ion-button>
      </ion-card-content>
    </ion-card>
    <ion-card v-else>
      <ion-card-header>
        <ion-card-title>Add new password</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <password-adder :passwords="passwords" @save="newPassword"></password-adder>
      </ion-card-content>
    </ion-card>


  </div>
</template>

<script>
import Dash from "dash";
import {IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonIcon} from '@ionic/vue';
import PasswordAdder from "@/components/PasswordAdder";
import {createIdentity, getAllIdentities} from "../../../persistence/dapi";

require("../../../persistence/dapi.js");

export default {
  name: "Passwords",
  components: {IonCard, IonCardContent, IonCardTitle, IonCardHeader, PasswordAdder},
  props: {
    mnemonic: String
  },
  data() {
    return {
      clientOpts: {
        network: 'testnet',
        wallet: {
          mnemonic: "",
        },
      },
      view: {
        add: false
      },
      passwords: [
        {
          user: "bananenboii",
          password: "supersafe",
          notiz: "pornhub.com"
        },
        {
          user: "hitschler",
          password: "derhitschler",
          notiz: "suppenkueche.com"
        },
        {
          user: "DasBou",
          password: "neuesPasswort",
          notiz: "Bootverleih.de"
        }
      ]
    }
  },
  async mounted() {
    this.clientOpts.wallet.mnemonic = this.mnemonic;
    const client = new Dash.Client(this.clientOpts);

    if (client !== undefined) {
      const connection = {
        platform: client.platform,
      };

      console.log("fetching identities");
      const identities = await createIdentity(connection);
      console.log(identities);

      console.log("mnemonic valid! Logged In!");
    } else {
      console.log("mnemonic invalid! Please try again.");
    }
  },
  methods: {
    newPassword(password) {
      this.passwords.push(password);
      this.view.add = false;
    }
  }
}
</script>

<style scoped>

</style>