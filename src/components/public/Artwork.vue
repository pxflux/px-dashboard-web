<template>
  <main v-if="artwork">
    <attachment-panel :video="video" :images="images"/>
    <div class="wrap-content">
      <div class="content">
        <h1 :title="artwork.title">{{ artwork.title }}</h1>
        <ul v-if="artwork.artists.length" class="by-string">
          <li v-for="artist in artwork.artists" :key="artist.key">
            <router-link :to="'/artist/' + artist.key">{{ artist.fullName }}</router-link>
          </li>
        </ul>
        <p class="work-meta caption">
          <span v-show="artwork.year">{{ artwork.year }}</span>
          <span>{{sourceDescription}}</span>
          <span>no sound</span>
          <span>Javascript</span>
        </p>
        <section class="description">
          {{ this.artwork.description }}
        </section>
        <section class="credits">
          Credits
          <ul v-if="artwork.credits.length" class="credits-string">
            <li v-for="person in artwork.credits" :key="person.key">
              <span :to="'/artist/' + person.key">{{ person.fullName}}: <i>{{person.role}}</i></span>
            </li>
          </ul>
        </section>
      </div>

      <div class="sidebar">
        <section class="social">
          <div class="row">
            <div class="button square">
              <div class="icon star">like</div>
            </div>
            <div class="button square">
              <div class="icon share">share</div>
            </div>
          </div>
        </section>
        <section class="actions">
          <div class="row">
            <div class="cell row-header">Add to Collection</div>
            <div class="button">
              <div class="icon plus"></div>
            </div>
          </div>
          <ul v-if="players.length">
            <template v-for="player in players">
              <template v-if="!player.isArtworkLaunched(artworkId)">
                <li class="row" :key="player.key">
                  <div class="cell row-header" @click="launch(player)">
                    Preview on Display <span class="accent">{{ player.pin }}</span>
                  </div>
                  <div class="button" @click="launch(player)">
                    <div class="icon display play"></div>
                  </div>
                </li>
              </template>
              <template v-if="player.isArtworkLaunched(artworkId)">
                <li class="row" :key="player.key">
                  <div class="cell row-header active" @click="stop(player)">
                    Stop Preview on <span class="accent">{{ player.pin }}</span>
                  </div>
                  <div class="button" @click="stop(player)">
                    <div class="icon stop"></div>
                  </div>
                </li>
                <li v-if="player.artwork.controls.length" :key="player.key + '-remote'" class="display-controls">
                  <div class="header">Remote for <span class="accent">{{ player.pin }}</span></div>
                  <remote-control :controls="player.artwork.controls" :displayId="player.pin"
                                  v-on:select="sendControl(player, $event)"/>
                </li>
              </template>
            </template>
          </ul>
          <div v-if="accountId" class="row">
            <router-link :to="'/account/artwork/' + artworkId + '/edit'" class="button">
              <div class="icon edit"></div>
            </router-link>
            <button v-if="!artwork.published" @click="togglePublished(true)">Publish</button>
            <button v-if="artwork.published" @click="togglePublished(false)">Unpublish</button>
            <button @click="removeArtwork">Delete</button>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapState } from "vuex";
import AttachmentPanel from "../elements/AttachmentsPanel";
import RemoteControl from "../elements/RemoteControl";
import { log } from "../../helper";
import { PlayerArtwork } from "../../models/PlayerArtwork";
import { Artwork } from "../../models/ArtworkData";
import { Player } from "../../models/Player";

export default {
  components: {
    AttachmentPanel,
    RemoteControl
  },
  created() {
    this.init();
  },

  data() {
    return {
      setupIndex: 0
    };
  },

  computed: {
    ...mapState(["userAccount", "accountArtwork", "accountPlayers"]),

    sourceDescription() {
      if (this.setup && this.setup.channels.length) {
        return this.setup.channels[0].source.toString();
      }
    },

    images() {
      return this.setup ? this.setup.thumbnails : [];
    },

    video() {
      return this.setup ? this.setup.preview : null;
    },

    setup() {
      if (this.artwork && this.artwork.setups.length) {
        return this.artwork.setups[this.setupIndex];
      } else {
        return null;
      }
    },

    accountId() {
      if (!this.userAccount) {
        return null;
      }
      return this.userAccount[".key"];
    },
    players() {
      if (this.accountPlayers) {
        return this.accountPlayers
          .map(player => Player.fromJson(player))
          .filter(player => player.connected);
      }
      return [];
    },
    artworkId() {
      return this.$route.params.id;
    },
    /**
     * @return {?Artwork}
     */
    artwork() {
      const getValue = value => {
        if (value == null) {
          return null;
        }
        if (value.hasOwnProperty(".value") && value[".value"] === null) {
          return null;
        }
        return value;
      };
      const value = getValue(this.accountArtwork);
      return value ? Artwork.fromJson(value) : null;
    },
    preview() {
      return this.artwork && this.artwork.preview ? this.artwork.preview : null;
    },
    image() {
      return this.artwork && this.artwork.image
        ? this.artwork.image
        : {
            displayUrl: null,
            storageUri: null
          };
    }
  },
  methods: {
    ...mapActions(["setRef"]),

    init() {
      if (this.accountId) {
        this.setRef({
          key: "accountArtwork",
          ref: this.$firebase
            .database()
            .ref("accounts/" + this.accountId + "/artworks/" + this.artworkId)
        });
        this.setRef({
          key: "accountPlayers",
          ref: this.$firebase
            .database()
            .ref("accounts/" + this.accountId + "/players")
        });
      }
    },
    launch(player) {
      if (!this.accountId || !this.artwork) {
        return;
      }
      const path =
        "accounts/" + this.accountId + "/players/" + player.key + "/artwork/";
      const values = PlayerArtwork.fromArtwork(
        this.artworkId,
        this.artwork
      ).toUpdates(path, PlayerArtwork.empty());
      this.$firebase
        .database()
        .ref(path)
        .remove()
        .then(() => {
          return this.$firebase
            .database()
            .ref()
            .update(values);
        })
        .catch(log);
    },
    stop(player) {
      if (!this.accountId || !this.artwork) {
        return;
      }
      this.$firebase
        .database()
        .ref(
          "accounts/" + this.accountId + "/players/" + player.key + "/artwork"
        )
        .remove()
        .catch(log);
    },
    sendControl(player, position) {
      this.$firebase
        .database()
        .ref("commands/" + player.pin)
        .push({ controlId: "" + position })
        .catch(log);
    },
    togglePublished(published) {
      if (!this.accountId) {
        return;
      }
      const data = { published: published };
      this.$firebase
        .database()
        .ref("accounts/" + this.accountId + "/artworks/" + this.artworkId)
        .update(data)
        .catch(log);
    },
    removeArtwork() {
      if (!this.accountId) {
        return;
      }
      this.$firebase
        .database()
        .ref("accounts/" + this.accountId + "/artworks/" + this.artworkId)
        .remove()
        .then(
          function() {
            this.$router.push("/artworks");
          }.bind(this)
        )
        .catch(log);
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
