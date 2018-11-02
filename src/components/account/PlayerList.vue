<template>
  <main>
    <div v-if="userAccount" class="wrap-content">
      <div class="content">
        <ul>
          <li v-for="player in accountPlayers" :key="player['.key']">
            {{ player.pin }}
          </li>
        </ul>
        <span class="nothing-found" v-if="accountPlayers.length === 0">Players not found.</span>
        <router-link to="/account/player/new">Add Player</router-link>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  created() {
    this.init();
  },
  computed: {
    ...mapState(["userAccount", "accountPlayers"]),

    accountId() {
      if (!this.userAccount) {
        return null;
      }
      return this.userAccount[".key"];
    }
  },
  methods: {
    ...mapActions(["setRef"]),

    init() {
      if (this.accountId) {
        this.setRef({
          key: "accountPlayers",
          ref: this.$firebase
            .database()
            .ref("accounts/" + this.accountId + "/players")
        });
      }
    }
  },
  watch: {
    $route() {
      this.init();
    },
    userAccount() {
      this.init();
    }
  }
};
</script>
