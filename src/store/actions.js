import { fetchArtworks } from "../api";
import { firebaseAction } from "vuexfire";

export default {
  setRef: firebaseAction(({ bindFirebaseRef }, payload) => {
    bindFirebaseRef(payload.key, payload.ref, { wait: false });
  }),
  unsetRef: firebaseAction(({ unbindFirebaseRef }, key) => {
    unbindFirebaseRef(key);
  }),

  FETCH_ITEMS: ({ commit, state }, { ids }) => {
    // only fetch items that we do not already have, or has expired (3 minutes)
    const now = Date.now();
    ids = ids.filter(id => {
      const item = state.items[id];
      if (!item) {
        return true;
      }
      return now - item.__lastUpdated > 1000 * 60 * 3;
    });
    if (ids.length) {
      return fetchArtworks(ids).then(items => commit("SET_ITEMS", { items }));
    } else {
      return Promise.resolve();
    }
  }
};
