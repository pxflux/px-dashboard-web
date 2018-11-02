import { Contributor } from "./Contributor";

export class BaseComponent {
  /**
   * @param {Date} created
   * @param {Date} modified
   * @param {Contributor} author
   * @param {string} text
   */
  constructor(created, modified, author, text) {
    this.created = created;
    this.modified = modified;
    this.author = author;
    this.text = text;
  }

  static fromJson(value) {
    return new BaseComponent(
      value.created,
      value.modified,
      Contributor.fromJson(value.author),
      value.text
    );
  }
}
