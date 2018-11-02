<template>
  <main>
    <div v-if="userAccount" class="wrap-content text-block">
      <router-link to="/account/artists/">Artists</router-link>
      <template v-if="! isNew">
        &gt;
        <router-link :to="'/account/artist/' + artistId">{{ accountArtist.fullName }}</router-link>
      </template>
      <form id="form-artist">
        <fieldset>
          <label>Image</label>
          <image-upload :imageUrl="image.displayUrl" @input-file="setImageFile"
                        @remove-image="setImageRemoved"></image-upload>
        </fieldset>
        <fieldset>
          <label>Full name</label>
          <input type="text" v-model.trim="fullName" title="Artist name" required="required">
        </fieldset>

        <router-link v-if="isNew" to="/account/artists">Cancel</router-link>
        <router-link v-if="! isNew" :to="'/account/artist/' + artistId">Cancel</router-link>
        <button v-if="isNew" @click.prevent="submitArtist">Create</button>
        <button v-if="! isNew" @click.prevent="submitArtist">Save</button>
      </form>
    </div>
  </main>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { log } from "../../helper";
import { store } from "../../firebase-app";
import ImageUpload from "../elements/ImageUpload";
import latinize from "latinize";

export default {
  props: ["isNew"],
  components: {
    ImageUpload
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState(["userAccount", "accountArtist"]),

    accountId() {
      if (!this.userAccount) {
        return null;
      }
      return this.userAccount[".key"];
    },
    artistId() {
      return this.$route.params.id;
    },
    published() {
      return this.accountArtist && this.accountArtist.published
        ? this.accountArtist.published
        : false;
    },
    image() {
      return this.accountArtist && this.accountArtist.image
        ? this.accountArtist.image
        : {
            displayUrl: null,
            storageUri: null
          };
    }
  },
  data() {
    return {
      imageFile: null,
      imageRemoved: false,
      fullName: ""
    };
  },
  methods: {
    ...mapActions(["setRef"]),

    init() {
      if (!this.isNew && this.accountId) {
        this.setRef({
          key: "accountArtist",
          ref: this.$firebase
            .database()
            .ref("accounts/" + this.accountId + "/artists/" + this.artistId)
        });
      }
    },

    setImageFile(file) {
      this.imageFile = file;
    },
    setImageRemoved(flag) {
      this.imageRemoved = flag;
    },

    submitArtist() {
      if (!this.accountId) {
        return;
      }
      const artist = {
        published: this.published,
        fullName: this.fullName,
        _search_index: {
          full_name: latinize(this.fullName.toLowerCase()),
          reversed_full_name: latinize(
            this.fullName
              .toLowerCase()
              .split(" ")
              .reverse()
              .join(" ")
          )
        }
      };
      store(
        this.accountId,
        this.artistId,
        "artists",
        artist,
        this.imageRemoved,
        this.imageFile
      )
        .then(
          function(ref) {
            this.$router.push("/account/artist/" + ref.key);
          }.bind(this)
        )
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
    accountArtist() {
      this.fullName = this.accountArtist.fullName;
    }
  }
};
</script>
