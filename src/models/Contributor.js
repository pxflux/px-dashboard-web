import { User } from "./User";

/**
 * @property {string} id
 * @property {string} displayName
 * @property {string} photoUrl
 * @property {Attachment} photo
 * @property {number} role
 */
export class Contributor extends User {
  /**
   * @param {string} id
   * @param {string} displayName
   * @param {string} photoUrl
   * @param {Attachment} photo
   * @param {number} role
   */
  constructor(id, displayName, photoUrl, photo, role) {
    super(id, displayName, photoUrl, photo);
    this.role = role;
  }

  static fromJson(value) {
    const user = User.fromJson(value);
    if (user === null) {
      return null;
    }
    return new Contributor(
      user.id,
      user.displayName,
      user.photoUrl,
      user.photo,
      value.role
    );
  }

  hasMainRole() {
    return this.role === 0;
  }

  hasImportantRole() {
    return this.role < 2;
  }
}

export class Contributors {
  static fromJson(value) {
    if (Array.isArray(value)) {
      return value.map(it => Contributor.fromJson(it));
    } else {
      return [];
    }
  }
}
