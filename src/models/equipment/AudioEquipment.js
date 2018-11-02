import { Equipment } from "./Equipment";

export class AudioEquipment extends Equipment {
  /**
   * @param {Date} created
   * @param {Date} modified
   * @param {Contributor} author
   * @param {string} text
   * @param {string} type
   * @param {string} why
   * @param {Contributor} decidedBy
   * @param {string} status
   * @param {Dimensions} dimensions
   * @param {string} appearance
   * @param {number} weight
   * @param {string} sensitivity
   * @param {string} frequencyResponse
   * @param {number} impedance
   */
  constructor(
    created,
    modified,
    author,
    text,
    type,
    why,
    decidedBy,
    status,
    dimensions,
    appearance,
    weight,
    sensitivity,
    frequencyResponse,
    impedance
  ) {
    super(
      created,
      modified,
      author,
      text,
      type,
      why,
      decidedBy,
      status,
      dimensions,
      appearance,
      weight
    );
    this.sensitivity = sensitivity;
    this.frequencyResponse = frequencyResponse;
    this.impedance = impedance;
  }

  static fromJson(value) {
    const parent = Equipment.fromJson(value);
    if (parent === null) {
      return null;
    }
    return new AudioEquipment(
      parent.created,
      parent.modified,
      parent.author,
      parent.text,
      parent.type,
      parent.why,
      parent.decidedBy,
      parent.status,
      parent.dimensions,
      parent.appearance,
      parent.weight,
      value.sensitivity,
      value.frequencyResponse,
      value.impedance
    );
  }
}
