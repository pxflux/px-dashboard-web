<template>
  <main>
    <div class="wrap-content">
      <div class="content">
        <div v-if="userAccount" class="wrap-content">
          <ul>
            <li v-for="show in accountShows" :key="show['.key']">
              <router-link :to="'/account/show/' + show['.key']">{{ show.title }}</router-link>
            </li>
          </ul>
          <span class="nothing-found" v-if="accountShows.length == 0">Shows not found.</span>
          <router-link to="/account/show/new">Add Show</router-link>
        </div>
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
    ...mapState(["userAccount", "accountShows"]),

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
          key: "accountShows",
          ref: this.$firebase
            .database()
            .ref("accounts/" + this.accountId + "/shows")
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
