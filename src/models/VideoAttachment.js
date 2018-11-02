import { Attachment } from "./Attachment";
import { AttachmentStorage } from "./AttachmentStorage";
import { ImageAttachment } from "./ImageAttachment";
import vimeo from "./utilities/vimeo";

/**
 * @property {?string} type
 * @property {?AttachmentStorage} storage
 * @property {?string} caption
 * @property {?number} ratio
 * @property {number} duration
 * @property {?ImageAttachment} thumbnail
 */
export class VideoAttachment extends Attachment {
  /**
   * @param {?AttachmentStorage} storage
   * @param {?string} caption
   * @param {?number} ratio
   * @param {number} duration
   * @param {?ImageAttachment} thumbnail
   */
  constructor(storage, caption, ratio, duration, thumbnail) {
    super("video", storage, caption, ratio);
    this.duration = duration;
    this.thumbnail = thumbnail;
  }

  static empty() {
    return new VideoAttachment(
      AttachmentStorage.empty(),
      "",
      null,
      0,
      ImageAttachment.empty()
    );
  }

  static fromJson(value) {
    const attachment = Attachment.fromJson(value);
    if (attachment === null) {
      return null;
    }
    return new VideoAttachment(
      attachment.storage,
      attachment.caption,
      attachment.ratio,
      value.duration,
      ImageAttachment.fromJson(value.thumbnail)
    );
  }

  /**
   * @param {?string} url
   * @param {?VimeoVideoInfo} value
   * @return {VideoAttachment}
   */
  static fromVimeo(url, value) {
    if (!value || typeof value !== "object") {
      return null;
    }
    return new VideoAttachment(
      new AttachmentStorage(url, null, null),
      null,
      value.width / value.height,
      value.duration,
      ImageAttachment.fromVimeo(0, value)
    );
  }

  /**
   * @param {string} url
   */
  static fromUrl(url) {
    if (vimeo.isVimeoVideoUrl(url)) {
      return vimeo.getVimeoVideoInfo(url).then(
        /** @type VimeoVideoInfo */ info => {
          return VideoAttachment.fromVimeo(url, info);
        }
      );
    }
    return Promise.resolve(null);
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries(prefix) {
    const data = super.toEntries(prefix);
    data[prefix + "duration"] = this.duration;
    if (this.thumbnail === null) {
      data[prefix + "thumbnail"] = null;
    } else {
      Object.assign(data, this.thumbnail.toEntries(prefix + "thumbnail/"));
    }
    return data;
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {VideoAttachment} from
   */
  updatedEntries(prefix, data, from) {
    const origin = from || VideoAttachment.empty();
    super.updatedEntries(prefix, data, origin);
    if (this.duration === origin.duration) {
      delete data[prefix + "duration"];
    }
    if (this.thumbnail !== null) {
      this.thumbnail.updatedEntries(
        prefix + "thumbnail/",
        data,
        origin.thumbnail
      );
    }
  }
}
