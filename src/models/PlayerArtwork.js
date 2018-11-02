import { Controls } from "./Control";

/**
 * @property {boolean} key
 * @property {?string} title
 * @property {?string} url
 * @property {?string} type
 * @property {Control[]} controls
 */
export class PlayerArtwork {
  constructor(key, title, url, type, controls) {
    this.key = key || null;
    this.title = title || null;
    this.url = url || null;
    this.type = type || null;
    this.controls = controls;
  }

  static empty() {
    return new PlayerArtwork(null, null, null, null, Controls.empty());
  }

  /**
   * @param {string} key
   * @param {Artwork} artwork
   */
  static fromArtwork(key, artwork) {
    if (typeof artwork !== "object") {
      return null;
    }
    const source = artwork.setups[0].channels[0].source;
    return new PlayerArtwork(
      key,
      artwork.title,
      source.url,
      source.type,
      Controls.fromJson(artwork.controls)
    );
  }

  /**
   * @param {object} value
   */
  static fromJson(value) {
    if (!value || typeof value !== "object") {
      return null;
    }
    return new PlayerArtwork(
      value.key,
      value.title,
      value.url,
      value.type,
      Controls.fromJson(value.controls)
    );
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries(prefix) {
    const data = {};
    data[prefix + "key"] = this.key;
    data[prefix + "title"] = this.title;
    data[prefix + "url"] = this.url;
    data[prefix + "type"] = this.type;
    Object.assign(
      data,
      Controls.toEntries(prefix + "controls/", this.controls)
    );
    return data;
  }

  /**
   * @param {string} prefix
   * @param {PlayerArtwork} original
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
   * @param {PlayerArtwork} from
   */
  updatedEntries(prefix, data, from) {
    const origin = from || PlayerArtwork.empty();
    if (this.key === origin.key) {
      delete data[prefix + "key"];
    }
    if (this.title === origin.title) {
      delete data[prefix + "title"];
    }
    if (this.url === origin.url) {
      delete data[prefix + "url"];
    }
    if (this.type === origin.type) {
      delete data[prefix + "type"];
    }
    Controls.updatedEntries(
      prefix + "controls/",
      data,
      origin.controls,
      this.controls
    );
  }
}
