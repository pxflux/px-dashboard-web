<template>
  <main>
    <div class="wrap-content">
      <div class="content">
        <form v-if="!playerPin" id="form-player-new" @submit.prevent="accept">
          <label>Pin</label>
          <input type="text" v-model="pin0" required="required" size="2" maxlength="1" @change="setPin"
                 :disabled="pinReady"/>
          <input type="text" v-model="pin1" required="required" size="2" maxlength="1" @change="setPin"
                 :disabled="pinReady"/>
          <input type="text" v-model="pin2" required="required" size="2" maxlength="1" @change="setPin"
                 :disabled="pinReady"/>
          <input type="text" v-model="pin3" required="required" size="2" maxlength="1" @change="setPin"
                 :disabled="pinReady"/>
          <input type="text" v-model="pin4" required="required" size="2" maxlength="1" @change="setPin"
                 :disabled="pinReady"/>
          <input type="text" v-model="pin5" required="required" size="2" maxlength="1" @change="setPin"
                 :disabled="pinReady"/>
        </form>
        <p v-if="playerPin && !artwork">No artwork</p>
        <template v-if="playerPin && artwork">
          <h1 :title="artwork.title">{{ artwork.title }}</h1>
          <ul v-if="artists.length" class="by-string">
            <li v-for="artist in artists" :key="artist['__key']">
              <router-link :to="'/artist/' + artist['.key']">{{ artist.fullName }}</router-link>
            </li>
          </ul>
          <p class="work-meta caption">
            <span v-show="artwork.year">{{ artwork.year }}</span>
          </p>
          <remote-control v-if="controls.length > 0" :controls="controls" v-on:select="sendControl($event)"/>
        </template>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { log } from "../../helper";
import RemoteControl from "../elements/RemoteControl";

export default {
  name: "PlayerClient",
  components: { RemoteControl },

  computed: {
    ...mapState(["playerPin"]),

    playerId() {
      return this.$route.params.id;
    },
    pin() {
      return (
        this.pin0 + this.pin1 + this.pin2 + this.pin3 + this.pin4 + this.pin5
      );
    },
    pinReady() {
      return this.pin > 100000;
    },
    artwork() {
      if (this.playerPin) {
        return this.playerPin.artwork;
      }
      return null;
    },
    artists() {
      return Object.keys(this.artwork.artists || {}).map(id => {
        return { ...this.artwork.artists[id], ...{ ".key": id } };
      });
    },
    controls() {
      if (this.artwork) {
        return this.artwork.controls || [];
      }
      return [];
    }
  },
  data() {
    return {
      pin0: "",
      pin1: "",
      pin2: "",
      pin3: "",
      pin4: "",
      pin5: ""
    };
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions(["setRef"]),
    ...mapMutations(["SET_LOADING"]),

    setPin() {
      this.init();
    },
    init() {
      if (this.$route.params.id > 100000 && this.$route.params.id < 999999) {
        const value = this.$route.params.id.split("");
        if (!this.pin0) {
          this.pin0 = value[0];
        }
        if (!this.pin1) {
          this.pin1 = value[1];
        }
        if (!this.pin2) {
          this.pin2 = value[2];
        }
        if (!this.pin3) {
          this.pin3 = value[3];
        }
        if (!this.pin4) {
          this.pin4 = value[4];
        }
        if (!this.pin5) {
          this.pin5 = value[5];
        }
      }
      if (this.pinReady) {
        this.SET_LOADING(true);
        this.setRef({
          key: "playerPin",
          ref: this.$firebase.database().ref("player-pins/" + this.pin)
        });
      }
    },
    sendControl(position) {
      this.$firebase
        .database()
        .ref("commands/" + this.pin)
        .push({ controlId: "" + position })
        .catch(log);
    }
  },
  watch: {
    $route() {
      this.init();
    }
  }
};
</script>
