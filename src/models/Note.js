import { BaseComponent } from "./BaseComponent";
import { Contributor } from "./Contributor";

export class Note extends BaseComponent {
  /**
   * @param {Date} created
   * @param {Date} modified
   * @param {Contributor} author
   * @param {string} text
   * @param {Contributor} onBehalfOf
   * @param {Attachment[]} attachments
   */
  constructor(created, modified, author, text, onBehalfOf, attachments) {
    super(created, modified, author, text);
    this.onBehalfOf = onBehalfOf;
    this.attachments = attachments;
  }

  static get Builder() {
    class Builder extends BaseComponent.Builder {
      withJson(data) {
        super.withJson(data);
        if (data.hasOwnProperty("onBehalfOf")) {
          this.onBehalfOf = Contributor.Builder.withJson(data.onBehalfOf);
        }
        if (data.hasOwnProperty("attachments")) {
          this.attachments = Contributor.Builder.withJson(data.attachments);
        }
        return this;
      }

      build() {
        super.build();
        if (this.onBehalfOf !== null) {
          this.onBehalfOf = this.onBehalfOf.build();
        }
        return new Note(
          this.created,
          this.modified,
          this.author,
          this.text,
          this.onBehalfOf,
          this.attachments
        );
      }
    }

    return Builder;
  }

  static fromJson(data) {
    BaseComponent.fromJson(data);

    /** @type  Contributor */
    // this.onBehalfOf = getValue(data, "onBehalfOf", null);

    /** @type {Url[]} */
    // this.attachments = getValue(data, "attachments", []);
  }
}
