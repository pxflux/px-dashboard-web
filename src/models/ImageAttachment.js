import { Attachment } from "./Attachment";
import { AttachmentStorage } from "./AttachmentStorage";

/**
 * @property {number} order
 * @property {?string} type
 * @property {?string} caption
 * @property {?AttachmentStorage} link
 * @property {?number} ratio
 */
export class ImageAttachment extends Attachment {
  /**
   * @param {number} order
   * @param {?AttachmentStorage} storage
   * @param {?string} caption
   * @param {?number} ratio
   */
  constructor(order, storage, caption, ratio) {
    super("image", storage, caption, ratio);
    this.order = isNaN(order) ? 0 : order;
  }

  /**
   * @return {ImageAttachment}
   */
  static empty() {
    return new ImageAttachment(0, AttachmentStorage.empty(), "", null);
  }

  /**
   * @param value
   * @return {ImageAttachment}
   */
  static fromJson(value) {
    const attachment = Attachment.fromJson(value);
    if (attachment === null) {
      return null;
    }
    return new ImageAttachment(
      Number.parseInt(value.order),
      attachment.storage,
      attachment.caption,
      attachment.ratio
    );
  }

  /**
   * @param {number} order
   * @param {?VimeoVideoInfo} value
   */
  static fromVimeo(order, value) {
    if (!value && typeof value !== "object") {
      return null;
    }
    return new ImageAttachment(
      order,
      new AttachmentStorage(value.thumbnail.url, null, null),
      value.description,
      value.thumbnail.width / value.thumbnail.height
    );
  }
}

export class ImageAttachments {
  /**
   * @return {ImageAttachment[]}
   */
  static empty() {
    return [];
  }

  /**
   * @param value
   * @return {ImageAttachment[]}
   */
  static fromJson(value) {
    if (!value) {
      return [];
    }
    if (typeof value === "object") {
      return Object.keys(value).map(key =>
        ImageAttachment.fromJson(Object.assign(value[key], { order: key }))
      );
    }
    if (Array.isArray(value)) {
      return value.map(it => ImageAttachment.fromJson(it));
    }
    return [];
  }

  /**
   * @param {string} prefix - '.../setups/{index}/thumbnails/'
   * @param {ImageAttachment[]} values
   * @return {Object}
   */
  static toEntries(prefix, values) {
    const data = {};
    if (!values.length) {
      return (data[prefix] = null);
    }
    values.forEach(value => {
      Object.assign(data, value.toEntries(prefix + value.order + "/"));
    });
    return data;
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {ImageAttachment[]} originals
   * @param {ImageAttachment[]} values
   */
  static updatedEntries(prefix, data, originals, values) {
    // add & updates
    values.forEach(value => {
      const items = originals.filter(item => item.order === value.order);
      const original = items.length > 0 ? items[0] : ImageAttachment.empty();
      value.updatedEntries(prefix + value.order + "/", data, original);
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
