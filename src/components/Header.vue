<template>
  <header class="main">
    <div class="wrap">
      <router-link to="/">
        <div id="px-logo-box" class="px-logo">
          <canvas id="px-logo"></canvas>
          <span class="label beta"></span>
        </div>
      </router-link>
      <template v-if="!['player-client'].includes($route.name)">
        <div class="right">
          <router-link v-if="user" to="/download" class="button">Download</router-link>
          <div v-if="!user" v-on:click="logIn" class="button">Login</div>
          <!-- -->
          <div v-if="user" class="item-with-submenu">
            <a class="button submenu-trigger" title="Add">
              <div class="icon plus medium"></div>
            </a>
            <div v-if="user" class="submenu">
              <div v-on:click="goto('/account/new')" class="button">New team</div>
              <div v-on:click="goto('/account/player/new')" class="button">Add player</div>
              <div v-on:click="goto('/account/artwork/new')" class="button">New artwork</div>
              <div v-on:click="goto('/account/artist/new')" class="button">New artist</div>
              <div v-on:click="goto('/account/show/new')" class="button">New show</div>
              <div v-on:click="goto('/account/place/new')" class="button">New place</div>
            </div>
          </div>
          <!-- -->
          <router-link v-if="user" to="/artworks" class="button">
            <img src="/img/collection-v3@2x.png" width="24" height="24" class="center">
          </router-link>
          <!-- -->
          <div v-if="user" class="item-with-submenu">
            <a class="button submenu-trigger">{{ userAccount.title }}</a>
            <div class="submenu">
              <div v-for="account in inactiveAccounts" :key="account['.key']" class="button"
                   v-on:click="setAccount(account['.key'])">{{ account.title }}
              </div>
            </div>
          </div>
          <!-- -->
          <div v-if="user" class="item-with-submenu">
            <a class="button submenu-trigger">
              <img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName" class="user-photo">
              <span v-else>{{ user.displayName }}</span>
            </a>
            <div class="submenu">
              <router-link to="/artworks" class="button">Artworks</router-link>
              <router-link to="/account/artists" class="button">Artists</router-link>
              <router-link to="/account/shows" class="button">Shows</router-link>
              <router-link to="/account/places" class="button">Places</router-link>
              <div class="sub-section">
                <router-link to="/account/players" class="button">Players</router-link>
                <div v-on:click="goto('/account/update')" class="button">Team profile</div>
                <div v-on:click="goto('/user/update')" class="button">Your profile</div>
                <div v-on:click="goto('/account/invitations')" class="button">Invitations</div>
                <a @click="logOut" class="button">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </header>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ScalableCanvasFromImage from "../assets/js/logo";
import ColorFlicker from "../assets/js/color-flicker";
import SubmenuHelper from "../helpers/submenu";
import { log } from "../helper";
import Firebase from "firebase/app";

export default {
  mixins: [SubmenuHelper],

  created() {
    this.init();
  },
  computed: {
    ...mapState(["user", "userAccount", "accounts"]),
    inactiveAccounts() {
      return this.accounts.filter(
        account => account[".key"] !== this.userAccount[".key"]
      );
    }
  },
  methods: {
    ...mapActions(["setRef"]),

    init() {
      if (this.user) {
        this.setRef({
          key: "accounts",
          ref: this.$firebase
            .database()
            .ref("users/" + this.user.uid + "/accounts")
        });
      }
    },

    setAccount(accountId) {
      this.closeSubmenus();
      this.$firebase
        .database()
        .ref("users/" + this.user.uid + "/accountId")
        .set(accountId)
        .catch(log);
    },

    goto(path) {
      this.closeSubmenus();
      this.$router.push(path);
    },

    logIn() {
      this.$firebase
        .auth()
        .signInWithRedirect(new Firebase.auth.GoogleAuthProvider())
        .catch(err => console.log(err));
    },

    logOut() {
      this.$router.push("/");
      this.$firebase
        .auth()
        .signOut()
        .catch(err => console.log(err));
    },

    setFlicker() {
      this.$nextTick(function() {
        new ColorFlicker().flickElement();
      });
    }
  },

  mounted: function() {
    let logoURL = getLogoURL();
    const canvasID = "px-logo";
    const logo = new ScalableCanvasFromImage(logoURL, canvasID, {
      fillParent: false
    });
    logo.setup();
    this.setFlicker();
    this.setupSubmenusWithClass("submenu", "submenu-trigger");
    window.addEventListener("resize", function() {
      logo.setup(getLogoURL());
    });

    function getLogoURL() {
      const el = document.getElementById("px-logo-box");
      const style = window.getComputedStyle(el);
      return style.backgroundImage.slice(4, -1).replace(/"/g, "");
    }
  },
  updated: function() {
    this.setFlicker();
    this.$nextTick(function() {
      this.setupSubmenusWithClass("submenu", "submenu-trigger");
    });
  },
  watch: {
    user() {
      this.init();
    }
  }
};
</script>
