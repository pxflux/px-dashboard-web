import { BaseComponent } from "./BaseComponent";
import { Contributor } from "./Contributor";

export class IterationComponent extends BaseComponent {
  /**
   * @param {Date} created
   * @param {Date} modified
   * @param {Contributor} author
   * @param {string} text
   * @param {string} type
   * @param {string} why
   * @param {Contributor} decidedBy
   * @param {string} status
   */
  constructor(created, modified, author, text, type, why, decidedBy, status) {
    super(created, modified, author, text);
    this.type = type;
    this.why = why;
    this.decidedBy = decidedBy;
    this.status = status;
  }

  static fromJson(value) {
    const parent = BaseComponent.fromJson(value);
    if (parent === null) {
      return null;
    }
    return new IterationComponent(
      parent.created,
      parent.modified,
      parent.author,
      parent.text,
      value.type,
      value.why,
      Contributor.fromJson(value.decidedBy),
      value.status
    );
  }
}
