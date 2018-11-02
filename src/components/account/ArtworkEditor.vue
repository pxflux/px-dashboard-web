<template>
  <main>
    <div v-if="artwork" class="wrap-content wrap-forms">
      <form id="form-artwork" v-on:submit.prevent>
        <section class="editor-section">
          <div class="row">
            <label for="title"><span>Title</span></label>
            <div class="field">
              <input id="title" type="text" v-model.trim="artwork.title" required="required">
            </div>
          </div>
          <div class="work-specifications">
            <section>
              <artwork-setup-editor v-model="artwork.setups"/>
            </section>
            <section>
              <div class="row">
                <label><span>Remote Control</span></label>
                <div class="field">
                  <remote-control-editor v-model="artwork.controls"/>
                </div>
              </div>
            </section>
          </div>
          <div class="row">
            <label><span>By</span></label>
            <div class="field">
              <contributors-editor v-model="artwork.artists"/>
            </div>
          </div>
          <div class="row">
            <label><span>Credits</span></label>
            <div class="field">
              <contributors-editor v-model="artwork.credits" :withRoles="true"/>
            </div>
          </div>
          <div class="row">
            <label for="year"><span>Year</span></label>
            <div class="field">
              <input id="year" type="text" v-model.trim="artwork.year" required="required">
            </div>
          </div>
          <div class="row">
            <label for="description"><span>Description</span></label>
            <div class="field">
              <textarea id="description" v-model.trim="artwork.description"></textarea>
            </div>
          </div>
        </section>
        <footer class="editor-section">
          <router-link v-if="isNew" to="/artworks" class="button frameless">Cancel</router-link>
          <router-link v-if="! isNew" :to="'/artwork/' + artworkId" class="button frameless">Cancel</router-link>
          <button v-if="isNew" @click="submitArtwork" class="frameless">Create</button>
          <button v-if="! isNew" @click="submitArtwork" class="frameless">Save</button>
        </footer>
      </form>
    </div>
  </main>
</template>

<script>
// SELECTs
// https://github.com/sagalbot/vue-select
// https://github.com/shentao/vue-multiselect
// SORTABLE
// https://github.com/Jexordexan/vue-slicksort
// https://github.com/hilongjw/vue-dragging *

import { mapActions, mapState } from "vuex";
import { Artwork } from "../../models/ArtworkData";
import { log } from "../../helper";

import RemoteControlEditor from "../elements/RemoteControlEditor";
import ContributorsEditor from "../elements/ContributorsEditor";
import ArtworkSetupEditor from "../elements/ArtworkSetupEditor";

export default {
  props: ["isNew"],
  components: {
    // ImageAttachmentEditor,
    // VideoAttachmentEditor,
    RemoteControlEditor,
    ContributorsEditor,
    ArtworkSetupEditor
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState(["userAccount", "accountArtwork"]),

    accountId() {
      if (!this.userAccount) {
        return null;
      }
      return this.userAccount[".key"];
    },
    artworkId() {
      return this.$route.params.id;
    }
  },
  data() {
    return {
      artwork: Artwork.empty()
    };
  },
  methods: {
    ...mapActions(["setRef"]),

    init() {
      if (!this.isNew && this.accountId) {
        this.source = this.$firebase
          .database()
          .ref("accounts/" + this.accountId + "/artworks/" + this.artworkId);
        this.setRef({ key: "accountArtwork", ref: this.source });
      } else {
        this.source = null;
      }
    },
    submitArtwork() {
      if (!this.accountId) {
        return;
      }
      const path = "accounts/" + this.accountId + "/artworks/";
      const id = this.isNew
        ? this.$firebase
            .database()
            .ref(path)
            .push().key
        : this.artworkId;
      const original = this.isNew
        ? Artwork.empty()
        : Artwork.fromJson(this.accountArtwork);
      const values = this.artwork.toUpdates(path + id + "/", original);
      this.$firebase
        .database()
        .ref()
        .update(values)
        .then(() => {
          this.$router.push("/artwork/" + id);
        })
        .catch(log());
    }
  },
  watch: {
    $route() {
      this.init();
    },
    userAccount() {
      this.init();
    },
    accountArtwork() {
      this.artwork = Artwork.fromJson(this.accountArtwork);
    }
  }
};
</script>
