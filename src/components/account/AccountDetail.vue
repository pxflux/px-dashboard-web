<template>
  <main>
    <div v-if="account" class="wrap-content">
      <div class="content">
        <section class="title">
          <editable-string v-model="account.title" :string-class="'h1'"/>
        </section>
        <section class="staff">
          <h2>People</h2>
          <ul>
            <li v-for="person in people" :key="person['.key']" class="card">
              <img v-if="person.photoUrl" :src="person.photoUrl" :alt="person.displayName" class="user-photo" width="48"
                   height="48">
              <span>{{ person.displayName }}</span>
            </li>
          </ul>
          <h2>Invitations</h2>
          <ul>
            <li v-for="invitation in accountInvitations" :key="invitation['.key']">
              {{ invitation.email }}
              <button @click="removeInvitation(invitation['.key'])">Remove</button>
            </li>
          </ul>
          <button @click="showInviteForm = true">Invite people</button>
          <form v-if="showInviteForm" id="form-invite" @submit.prevent="invite">
            <input id="email" type="text" v-model="email" title="Email address" required="required">
            <input type="submit" value="Invite"/>
            <button @click="showInviteForm = false">Cancel</button>
          </form>
        </section>
        <section class="danger-actions">
          <button @click="leaveAccount">Leave team</button>
        </section>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { log } from "../../helper";
import EditableString from "../elements/UI/EditableStringWithSubmit";

export default {
  components: { EditableString },
  created() {
    this.init();
  },
  computed: {
    ...mapState(["user", "userAccount", "account"]),
    ...mapGetters(["accountInvitations"]),
    people() {
      const account = this.account || {};
      return Object.keys(account.users || {}).map(userId => {
        const user = account.users[userId];
        user[".key"] = userId;
        return user;
      });
    }
  },
  data() {
    return {
      title: "",
      email: "",
      showEditForm: false,
      showInviteForm: false
    };
  },
  methods: {
    ...mapActions(["setRef"]),
    ...mapMutations(["REMOVE_ACCOUNT"]),

    init() {
      if (this.userAccount) {
        this.setRef({
          key: "account",
          ref: this.$firebase
            .database()
            .ref("accounts/" + this.userAccount[".key"])
        });
        this.setRef({
          key: "invitations",
          ref: this.$firebase.database().ref("invitations")
        });
      }
    },

    updateAccount() {
      this.showEditForm = false;
      this.$firebase
        .database()
        .ref("accounts/" + this.userAccount[".key"] + "/title")
        .set(this.title)
        .catch(log);
    },

    invite() {
      this.showInviteForm = false;
      const invitation = {
        account: {
          id: this.userAccount[".key"],
          title: this.userAccount.title
        },
        email: this.email
      };
      this.$firebase
        .database()
        .ref("invitations")
        .push(invitation)
        .catch(log);
    },

    removeInvitation(invitationId) {
      this.$firebase
        .database()
        .ref("invitations/" + invitationId)
        .remove()
        .catch(log);
    },

    leaveAccount() {
      this.showEditForm = false;
      this.$firebase
        .database()
        .ref("accounts/" + this.userAccount[".key"] + "/users/" + this.user.uid)
        .remove()
        .catch(log);
    }
  },
  watch: {
    $route() {
      this.init();
    },
    userAccount() {
      this.init();
    },
    account() {
      this.title = this.account.title;
    }
  }
};
</script>

<style lang="scss">
.staff {
  img {
    filter: grayscale(100%);
  }
}
</style>
