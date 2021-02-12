<template>
  <div>
    <ion-item>
      <ion-label position="floating">Username</ion-label>
      <ion-input v-model="account.username"></ion-input>
    </ion-item>

    <ion-item>
      <ion-label position="floating">Password</ion-label>
      <ion-input v-model="account.password"></ion-input>
    </ion-item>

    <ion-item>
      <ion-label position="floating">Note</ion-label>
      <ion-input v-model="account.note"></ion-input>
    </ion-item>

    <ion-button @click="save()">Save</ion-button>
  </div>
</template>

<script>
import {IonButton, IonInput, IonItem, IonLabel} from '@ionic/vue';


export default {
  name: "PasswordAdder",
  components: { IonInput, IonItem, IonLabel, IonButton},
  data: function() {
    return {
      account: {
        username: "",
        password: "",
        note: ""
      }
    }
  },
  methods:{
    save(){
      console.log(this.account);
      this.$emit("save", this.account);
    }
  }
}
</script>

<style scoped>

</style>