<template>
  <main>
    <div class="wrap-content">
      <div class="content">
        <ul>
          <li v-for="invitation in userInvitations" :key="invitation['.key']">
            {{ invitation.account.title }}
            <button @click="acceptInvitation(invitation['.key'])" class="button">Accept</button>
            <button @click="rejectInvitation(invitation['.key'])" class="button">Reject</button>
          </li>
        </ul>
        <span class="nothing-found" v-if="userInvitations.length == 0">No invitations.</span>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { log } from "../../helper";

export default {
  created() {
    this.init();
  },
  computed: {
    ...mapState(["user"]),
    ...mapGetters(["userInvitations"])
  },
  methods: {
    ...mapActions(["setRef"]),

    init() {
      if (this.user) {
        this.setRef({
          key: "invitations",
          ref: this.$firebase.database().ref("invitations")
        });
      }
    },
    acceptInvitation(invitationId) {
      const data = {
        uid: this.user.uid,
        displayName: this.user.displayName,
        photoUrl: this.user.photoURL
      };
      this.$firebase
        .database()
        .ref("invitations/" + invitationId + "/user")
        .set(data)
        .catch(log);
    },
    rejectInvitation(invitationId) {
      this.$firebase
        .database()
        .ref("invitations/" + invitationId)
        .remove()
        .catch(log);
    }
  },
  watch: {
    $route() {
      this.init();
    },
    user() {
      this.init();
    }
  }
};
</script>
