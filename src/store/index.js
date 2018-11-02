import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const firebaseProgress = store => {
  store.subscribe(mutation => {
    if (
      mutation.type === "vuexfire/OBJECT_VALUE" ||
      mutation.type === "VUEXFIRE_ARRAY_INITIALIZE"
    ) {
      store.commit("SET_LOADING", false);
    }
  });
};

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [firebaseProgress],
  state: {
    loading: false,

    config: null,

    user: null,
    userAccount: null,

    playerPin: null,

    artworks: [],
    publicArtwork: null,
    artists: [],
    artist: null,
    shows: [],
    show: null,
    places: [],
    place: null,
    collector: null,
    curator: null,
    publication: null,

    accounts: [],
    account: null,
    invitations: [],

    accountPlayers: [],

    accountArtworks: [],
    accountArtwork: null,

    accountArtists: [],
    accountArtist: null,
    accountShows: [],
    accountShow: null,
    accountPlaces: [],
    accountPlace: null,
    accountIteration: null,

    items: {
      /* [id: string]: {} */
    }
  },
  actions,
  mutations,
  getters
});
