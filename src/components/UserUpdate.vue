<template>
  <main>
    <div class="wrap-content wrap-forms" v-if="user">
      <div class="content">
        <h1>{{ user.displayName }}</h1>
        <img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName" width="100px" height="100px">
        <h2>Information</h2>
        <form id="form-profile" @submit.prevent="updateProfile">
          <label for="name">Display Name</label>
          <input id="name" type="text" name="name" v-model="displayName" required="required">
          <label for="email">Email</label>
          <input id="email" type="email" name="email" v-model="email" required="required">
          <button class="right">Save Changes</button>
        </form>
        <template v-if="user.email">
          <h2>Password</h2>
          <form id="form-password" @submit.prevent="updatePassword">
            <template v-if="emailFederated">
              <label for="current-password">Current Password</label>
              <input id="current-password" name="current_password" type="password" autocomplete="on" pattern=".{6,}"
                     title="6 characters minimum" autofocus="autofocus" required="required">
              <label for="new_password">New Password</label>
            </template>
            <label v-if=" ! emailFederated" for="new_password">Set Password</label>
            <input id="new_password" name="new_password" type="password" pattern=".{6,}" title="6 characters minimum"
                   required="required" v-model="password">
            <button class="right">Save Changes</button>
          </form>
        </template>
        <h2>Linked Accounts</h2>
        <ul>
          <li v-if="googleFederated">
            <form id="form-disconnect-google" @submit.prevent="disconnectGoogle">
              <p>You are connected to Google.</p>
              <p>You can now sign in to PxFlux using your Google account.</p>
              <p>{{ googleFederated.email }}</p>
              <img v-if="googleFederated.photoURL" :src="googleFederated.photoURL" :alt="googleFederated.displayName"
                   width="48px" height="48px">
              <button v-if="multipleAuth" class="right">Disconnect</button>
            </form>
          </li>
          <li v-if=" ! googleFederated">
            <form id="form-connect-google" @submit.prevent="connectGoogle">
              <button class="right">Connect to Google</button>
            </form>
          </li>
        </ul>
        <h2>Email Preferences</h2>
        <form>
          <label for="receive_emails">Receive Emails</label>
          <input type="checkbox" id="receive_emails" name="receive_emails" checked="checked">
          <button class="right">Save Changes</button>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import { mapState } from "vuex";
import Firebase from "firebase/app";

export default {
  data() {
    return {
      displayName: this.$store.state.user.displayName,
      email: this.$store.state.user.email,
      password: ""
    };
  },
  computed: {
    ...mapState(["user"]),

    googleFederated: function() {
      return this.user.providerData.find(
        o => o.providerId === Firebase.auth.GoogleAuthProvider.PROVIDER_ID
      );
    },
    emailFederated: function() {
      return this.user.providerData.find(
        o => o.providerId === Firebase.auth.EmailAuthProvider.PROVIDER_ID
      );
    },
    multipleAuth: function() {
      return this.user.providerData.length > 1;
    }
  },
  methods: {
    updateProfile() {
      this.user
        .updateProfile({
          displayName: this.displayName,
          email: this.email
        })
        .catch(error => console.log(error));
    },
    updatePassword() {
      if (this.emailFederated) {
        this.user
          .updatePassword(this.password)
          .then()
          .catch(error => console.log(error));
      } else {
        let credential = Firebase.auth.EmailAuthProvider.credential(
          this.user.email,
          this.password
        );
        this.user
          .linkWithCredential(credential)
          .then(user => {
            this.$firebase.auth().currentUser.reload();
            this.$store.commit("UPDATE_USER", { user: user });
          })
          .catch(error => console.log(error));
      }
      this.password = "";
    },
    disconnectGoogle() {
      this.user
        .unlink(Firebase.auth.GoogleAuthProvider.PROVIDER_ID)
        .then(user => {
          console.log("Account unlink", user);
          this.$firebase.auth().currentUser.reload();
          this.$store.commit("UPDATE_USER", { user: user });
        })
        .catch(error => console.log("Account unlink error", error));
    },
    connectGoogle() {
      const provider = new Firebase.auth.GoogleAuthProvider().addScope(
        "https://www.googleapis.com/auth/plus.login"
      );
      this.user
        .linkWithPopup(provider)
        .then(result => {
          this.$firebase.auth().currentUser.reload();
          this.$store.commit("UPDATE_USER", { user: result.user });
        })
        .catch(error => console.log(error));
    }
  }
};
</script>
