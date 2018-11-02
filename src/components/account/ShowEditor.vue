<template>
  <main>
    <div v-if="userAccount" class="wrap-content text-block">
      <router-link to="/account/shows/">Shows</router-link>
      <template v-if="! isNew">
        &gt;
        <router-link :to="'/account/show/' + showId">{{ accountShow.title }}</router-link>
      </template>
      <form id="form-show">
        <fieldset>
          <label>Image</label>
          <image-upload :imageUrl="image.displayUrl" @input-file="setImageFile"
                        @remove-image="setImageRemoved"></image-upload>
        </fieldset>
        <fieldset>
          <label>Title</label>
          <input type="text" v-model.trim="title" title="Show title" required="required">
        </fieldset>
        <fieldset>
          <label>Places</label>
          <select v-model="selectedPlaceIds" multiple required>
            <option v-for="place in places" :key="place['.key']" v-bind:value="place['.key']">{{ place.title }}</option>
          </select>
        </fieldset>

        <router-link v-if="isNew" to="/account/shows">Cancel</router-link>
        <router-link v-if="! isNew" :to="'/account/show/' + showId">Cancel</router-link>
        <button v-if="isNew" @click.prevent="submitShow">Create</button>
        <button v-if="! isNew" @click.prevent="submitShow">Save</button>
      </form>
    </div>
  </main>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { log } from "../../helper";
import { store } from "../../firebase-app";
import ImageUpload from "../elements/ImageUpload";

export default {
  props: ["isNew"],
  components: {
    ImageUpload
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState(["userAccount", "accountShow", "places"]),

    accountId() {
      if (!this.userAccount) {
        return null;
      }
      return this.userAccount[".key"];
    },
    showId() {
      return this.$route.params.id;
    },
    published() {
      return this.accountShow && this.accountShow.published
        ? this.accountShow.published
        : false;
    },
    image() {
      return this.accountShow && this.accountShow.image
        ? this.accountShow.image
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
      title: "",
      selectedPlaceIds: []
    };
  },
  methods: {
    ...mapActions(["setRef"]),

    init() {
      if (!this.isNew && this.accountId) {
        this.setRef({
          key: "accountShow",
          ref: this.$firebase
            .database()
            .ref("accounts/" + this.accountId + "/shows/" + this.showId)
        });
      }
      this.setRef({
        key: "places",
        ref: this.$firebase.database().ref("places")
      });
    },

    setImageFile(file) {
      this.imageFile = file;
    },
    setImageRemoved(flag) {
      this.imageRemoved = flag;
    },

    submitShow() {
      if (!this.accountId) {
        return;
      }
      const show = {
        published: this.published,
        title: this.title,
        places: {}
      };
      this.places
        .filter(place => this.selectedPlaceIds.includes(place[".key"]))
        .forEach(place => {
          show.places[place[".key"]] = { title: place.title };
        });
      store(
        this.accountId,
        this.showId,
        "shows",
        show,
        this.imageRemoved,
        this.imageFile
      )
        .then(
          function(ref) {
            this.$router.push("/account/show/" + ref.key);
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
    accountShow() {
      this.title = this.accountShow.title;
      this.selectedPlaceIds = Object.keys(this.accountShow.places || {});
    }
  }
};
</script>
