import { IterationComponent } from "../IterationComponent";
import { Dimensions } from "../basic/Dimensions";

export class Equipment extends IterationComponent {
  /**
   * @param {object} jsonData
   */
  constructor(jsonData) {
    super(jsonData);

    this.dimensions = new Dimensions();
    this.appearance = null;
    this.weight = null;
  }

  static fromJson(value) {
    const parent = IterationComponent.fromJson(value);
    if (parent === null) {
      return null;
    }
    return new Equipment(
      parent.created,
      parent.modified,
      parent.author,
      parent.text,
      parent.type,
      parent.why,
      parent.decidedBy,
      parent.status,
      Dimensions.fromJson(value.dimensions),
      value.appearance,
      value.weight
    );
  }
}
