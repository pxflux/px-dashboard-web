import { Attachment } from "./Attachment";

/**
 * @property {string} id
 * @property {string} displayName
 * @property {string} photoUrl
 * @property {Attachment} photo
 */
export class User {
  /**
   * @param {string} id
   * @param {string} displayName
   * @param {string} photoUrl
   * @param {Attachment} photo
   */
  constructor(id, displayName, photoUrl, photo) {
    this.id = id;
    this.displayName = displayName;
    this.photoUrl = photoUrl;
    this.photo = photo;
  }

  static fromJson(value) {
    if (typeof value !== "object") {
      return null;
    }
    return new User(
      value.id,
      value.displayName,
      value.photoUrl,
      Attachment.fromJson(value.photo)
    );
  }
}
