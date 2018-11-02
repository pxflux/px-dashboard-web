import { AttachmentStorage } from "./AttachmentStorage";

/**
 * @property {?string} type
 * @property {?AttachmentStorage} storage
 * @property {?number} ratio
 */
export class Attachment {
  /**
   * @param {?string} type
   * @param {?AttachmentStorage} storage
   * @param {?string} caption
   * @param {?number} ratio
   */
  constructor(type, storage, caption, ratio) {
    this.type = type || null;
    this.storage = storage;
    this.caption = caption || null;
    this.ratio = isNaN(ratio) ? null : ratio;
  }

  static empty() {
    return new Attachment(null, AttachmentStorage.empty(), null, null);
  }

  /**
   * @return {?Attachment}
   */
  static fromJson(value) {
    if (!value || typeof value !== "object") {
      return null;
    }
    return new Attachment(
      value.type,
      AttachmentStorage.fromJson(value.storage),
      value.caption,
      Number.parseFloat(value.ratio)
    );
  }

  /**
   * @param {string} prefix - '.../setups/{index}/thumbnails/{index}/'
   * @return {Object}
   */
  toEntries(prefix) {
    const data = {};
    data[prefix + "type"] = this.type;
    if (this.storage === null) {
      data[prefix + "storage"] = null;
    } else {
      Object.assign(data, this.storage.toEntries(prefix + "storage/"));
    }
    data[prefix + "caption"] = this.caption;
    data[prefix + "ratio"] = this.ratio;
    return data;
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {Attachment} from
   */
  updatedEntries(prefix, data, from) {
    const origin = from || Attachment.empty();
    if (this.type === origin.type) {
      delete data[prefix + "type"];
    }
    if (this.storage !== null) {
      this.storage.updatedEntries(prefix + "storage/", data, origin.storage);
    }
    if (this.caption === origin.caption) {
      delete data[prefix + "caption"];
    }
    if (this.ratio === origin.ratio) {
      delete data[prefix + "ratio"];
    }
  }
}
