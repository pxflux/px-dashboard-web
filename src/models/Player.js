import { PlayerArtwork } from "./PlayerArtwork";

/**
 * @property {?string} key
 * @property {?string} pin
 * @property {boolean} connected
 * @property {?PlayerArtwork} artwork
 */
export class Player {
  constructor(key, pin, connected, artwork) {
    this.key = key || null;
    this.pin = pin || null;
    this.connected = connected || false;
    this.artwork = artwork;
  }

  static empty() {
    return new Player(null, null, PlayerArtwork.empty());
  }

  /**
   * @param {object} value
   */
  static fromJson(value) {
    if (!value || typeof value !== "object") {
      return null;
    }
    const id = value.hasOwnProperty(".key") ? value[".key"] : value.key;
    return new Player(
      id,
      value.pin,
      value.hasOwnProperty("connections"),
      PlayerArtwork.fromJson(value.artwork)
    );
  }

  /**
   * @param {string} artworkId
   * @return {boolean}
   */
  isArtworkLaunched(artworkId) {
    if (!this.artwork) {
      return false;
    }
    return artworkId === this.artwork.key;
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries(prefix) {
    const data = {};
    data[prefix + "pin"] = this.pin;
    data[prefix + "connected"] = this.connected;
    Object.assign(
      data,
      PlayerArtwork.toEntries(prefix + "artwork/", this.artwork)
    );
    return data;
  }

  /**
   * @param {string} prefix
   * @param {Player} original
   * @return {Object}
   */
  toUpdates(prefix, original) {
    const data = this.toEntries(prefix);
    this.updatedEntries(prefix, data, original);
    return data;
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {Player} from
   */
  updatedEntries(prefix, data, from) {
    const origin = from || Player.empty();
    if (this.pin === origin.pin) {
      delete data[prefix + "pin"];
    }
    if (this.connected === origin.connected) {
      delete data[prefix + "connected"];
    }
    this.artwork.updatedEntries(prefix + "artwork/", data, origin.artwork);
  }
}
