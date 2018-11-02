<template>
  <main>
    <div v-if="userAccount" class="wrap-content grid" id="main-grid">
      <ArtworkItem v-for="artwork in artworks" :artwork="artwork" :key="artwork.key" :uri="'/artwork/' + artwork.key"/>
      <router-link to="/account/artwork/new" class="grid-cell button frameless" title="Add Artwork">
        <i class="plus large"></i>
      </router-link>
    </div>
  </main>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { Artwork } from "../../models/ArtworkData";
import ArtworkItem from "../elements/ArtworkItem";

export default {
  components: {
    ArtworkItem
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState(["userAccount", "accountArtworks"]),

    accountId() {
      if (!this.userAccount) {
        return null;
      }
      return this.userAccount[".key"];
    },
    artworks() {
      if (this.accountArtworks) {
        return this.accountArtworks.map(it => Artwork.fromJson(it));
      }
      return [];
    }
  },
  methods: {
    ...mapActions(["setRef"]),

    init() {
      if (this.accountId) {
        this.setRef({
          key: "accountArtworks",
          ref: this.$firebase
            .database()
            .ref("accounts/" + this.accountId + "/artworks")
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
