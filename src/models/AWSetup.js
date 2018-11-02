import { AWChannels } from "./AWChannel";
import { ImageAttachments } from "./ImageAttachment";
import { VideoAttachment } from "./VideoAttachment";

/**
 * @property {number} order
 * @property {?string} title
 * @property {AWChannel[]} channels
 * @property {ImageAttachment[]} thumbnails
 * @property {?VideoAttachment} preview
 */
export class AWSetup {
  /**
   * @param {number} order
   * @param {?string} title
   * @param {AWChannel[]} channels
   * @param {ImageAttachment[]} thumbnails
   * @param {?VideoAttachment} preview
   */
  constructor(order, title, channels, thumbnails, preview) {
    this.order = isNaN(order) ? 0 : order;
    this.title = title || null;
    this.channels = channels || [];
    this.thumbnails = thumbnails || [];
    this.preview = preview || null;
  }

  static empty() {
    return new AWSetup(
      0,
      null,
      AWChannels.empty(),
      ImageAttachments.empty(),
      VideoAttachment.empty()
    );
  }

  /**
   * @param {object} value
   */
  static fromJson(value) {
    if (!value || typeof value !== "object") {
      return null;
    }
    return new AWSetup(
      Number.parseInt(value.order),
      value.title,
      AWChannels.fromJson(value.channels),
      ImageAttachments.fromJson(value.thumbnails),
      VideoAttachment.fromJson(value.preview)
    );
  }

  /**
   * @param {string} prefix - '.../setups/{index}/'
   * @return {Object}
   */
  toEntries(prefix) {
    const data = {};
    data[prefix + "title"] = this.title;
    Object.assign(
      data,
      AWChannels.toEntries(prefix + "channels/", this.channels)
    );
    Object.assign(
      data,
      ImageAttachments.toEntries(prefix + "thumbnails/", this.thumbnails)
    );
    if (this.preview === null) {
      data[prefix + "preview"] = null;
    } else {
      Object.assign(data, this.preview.toEntries(prefix + "preview/"));
    }
    return data;
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {AWSetup} from
   */
  updatedEntries(prefix, data, from) {
    const origin = from || AWSetup.empty();
    if (this.title === origin.title) {
      delete data[prefix + "title"];
    }
    AWChannels.updatedEntries(
      prefix + "channels/",
      data,
      origin.channels,
      this.channels
    );
    ImageAttachments.updatedEntries(
      prefix + "thumbnails/",
      data,
      origin.thumbnails,
      this.thumbnails
    );
    if (this.preview !== null) {
      this.preview.updatedEntries(prefix + "preview/", data, origin.preview);
    }
  }
}

export class AWSetups {
  /**
   * @return {AWSetup[]}
   */
  static empty() {
    return [];
  }

  /**
   * @param value
   * @return {AWSetup[]}
   */
  static fromJson(value) {
    if (!value || typeof value !== "object") {
      return [];
    }
    if (typeof value === "object") {
      return Object.keys(value).map(key =>
        AWSetup.fromJson(Object.assign(value[key], { order: key }))
      );
    }
    if (Array.isArray(value)) {
      return value.map(it => AWSetup.fromJson(it));
    }
    return [];
  }

  /**
   * @param {AWSetup[]} values
   */
  static append(values) {
    const value = Object.assign(AWSetup.empty(), { order: values.length });
    values.push(value);
  }

  /**
   * @param {AWSetup[]} values
   * @param {number} index
   */
  static remove(values, index) {
    values.splice(index, 1);
    for (let i = 0; i < values.length; i++) {
      values[i].order = i;
    }
  }

  /**
   * @param {string} prefix - '.../setups/'
   * @param {AWSetup[]} values
   * @return {Object}
   */
  static toEntries(prefix, values) {
    const data = {};
    values.forEach(value => {
      Object.assign(data, value.toEntries(prefix + value.order + "/"));
    });
    return data;
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {AWSetup[]} originals
   * @param {AWSetup[]} values
   */
  static updatedEntries(prefix, data, originals, values) {
    // add & updates
    values.forEach(value => {
      const original = originals.find(item => item.order === value.order);
      value.updatedEntries(
        prefix + value.order + "/",
        data,
        original || AWSetup.empty()
      );
    });
    // remove
    originals.forEach(original => {
      const items = values.filter(item => item.order === original.order);
      if (items.length === 0) {
        data[prefix + original.order] = null;
      }
    });
  }
}
