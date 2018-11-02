<template>
  <main>
    <div v-if="userAccount" class="wrap-content grid">
      <form id="form-player" @submit.prevent="accept">
        <label for="pin">Pin</label>
        <input id="pin" type="text" v-model.trim="pin" required="required">
        <button>Add</button>
      </form>
    </div>
  </main>
</template>

<script>
import { mapState } from "vuex";
import { log } from "../../helper";

export default {
  computed: {
    ...mapState(["userAccount"]),

    accountId() {
      if (!this.userAccount) {
        return null;
      }
      return this.userAccount[".key"];
    }
  },
  data() {
    return {
      pin: ""
    };
  },
  methods: {
    accept() {
      if (this.accountId) {
        const account = {
          accountId: this.accountId
        };
        this.$firebase
          .database()
          .ref("player-pins/" + this.pin)
          .set(account)
          .then(() => {
            this.$router.push("/account/players");
          })
          .catch(log);
      }
    }
  }
};
</script>
