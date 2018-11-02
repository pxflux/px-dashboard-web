import Vue from "vue";
import ProgressBar from "./components/elements/ProgressBar";
import firebaseApp from "./firebase-app";
import inputAutoWidth from "vue-input-autowidth";
import VueScrollTo from "vue-scrollto";
import { sync } from "vuex-router-sync";
import App from "./components/App";
import store from "./store";
import router from "./router";

Vue.config.productionTip = false;

// global progress bar
const bar = (Vue.prototype.$bar = new Vue(ProgressBar).$mount());
document.body.appendChild(bar.$el);

Vue.use(inputAutoWidth);
Vue.use(VueScrollTo);

Vue.mixin({
  created: function() {
    this.$firebase = firebaseApp;
  }
});

/**
 * Sync store.state.user with firebase.auth().currentUser
 *
 * This callback is called when firebase.auth() detects user changes,
 * so just update the vuex store with the new user object.
 */
let callback = null;
let userRef = null;
firebaseApp.auth().onAuthStateChanged(user => {
  console.log("onAuthStateChanged:", user);
  if (callback) {
    userRef.off("value", callback);
  }
  if (user) {
    userRef = firebaseApp
      .database()
      .ref("metadata/" + user.uid + "/refreshTime");
    callback = userRef.on("value", snapshot => {
      console.log("onMetadataChanged:", snapshot);
      if (!snapshot.exists()) {
        return;
      }
      return user
        .getIdToken(true)
        .then(token => {
          store.commit("UPDATE_USER", {
            user: firebaseApp.auth().currentUser,
            account: firebaseApp.auth().currentUser
          });
          // console.log('getIdToken:', token)
          return JSON.parse(b64DecodeUnicode(token.split(".")[1]));
        })
        .then(function(payload) {
          if (!payload.hasOwnProperty("accountId")) {
            throw new Error();
          }
          return firebaseApp
            .database()
            .ref("accounts/" + payload.accountId)
            .once("value");
        })
        .then(function(snapshot) {
          if (!snapshot.exists()) {
            throw new Error();
          }
          const account = snapshot.val();
          account[".key"] = snapshot.key;
          store.commit("UPDATE_USER", { user: user, account: account });
        })
        .catch(function(error) {
          console.log(error);
          store.commit("UPDATE_USER", null);
        });
    });
  } else {
    store.commit("UPDATE_USER", null);
  }
});

/**
 * Sync the router with the vuex store. This registers `store.state.route`
 * (https://github.com/vuejs/vuex-router-sync/tree/next)
 */
sync(store, router);

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

function b64DecodeUnicode(str) {
  return decodeURIComponent(
    atob(str)
      .split("")
      .map(function(c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}
