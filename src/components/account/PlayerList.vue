<template>
  <main>
    <div v-if="userAccount" class="wrap-content">
      <div class="content">
        <ul>
          <li v-for="player in players" :key="player.key">
            {{ player.pin }}<span v-if="player.connected"> - connected</span>
          </li>
        </ul>
        <span class="nothing-found" v-if="players.length === 0">Players not found.</span>
        <router-link to="/account/player/new">Add Player</router-link>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { Player } from "../../models/Player";

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
    },
    players() {
      return this.accountPlayers.map(p => Player.fromJson(p));
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
