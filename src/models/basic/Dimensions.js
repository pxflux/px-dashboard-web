/**
 * @prop {?number} w
 * @prop {?number} h
 * @prop {?number} d
 * @prop {?string} units
 * @prop {string[]} dimensionsOrder
 */
export class Dimensions {
  /**
   * @param {object=} jsonData
   * @param {string[]=} dimensionsOrder - Array of three letters: 'w', 'h', 'd' representing the order in which the dimensions will be treated
   */
  constructor(jsonData, dimensionsOrder) {
    this.w = null;
    this.h = null;
    this.d = null;
    this.units = "";
    this.dimensionsOrder = dimensionsOrder || ["w", "h", "d"];

    if (jsonData) {
      this.fromJson(jsonData);
    }
  }

  static isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  isSet() {
    return (
      Dimensions.isNumeric(this.w) ||
      Dimensions.isNumeric(this.h) ||
      Dimensions.isNumeric(this.d)
    );
  }

  /**
   * @return {string}
   */
  toString() {
    const orderedNumericValues = [];
    this.dimensionsOrder.forEach(dim => {
      if (Dimensions.isNumeric(this[dim])) {
        orderedNumericValues.push(this[dim]);
      }
    });
    return orderedNumericValues.join(" x ") + " " + this.units;
  }

  /**
   * @param {object} value
   */
  fromJson(value) {
    if (!value || typeof value !== "object") {
      return null;
    }
    this.dimensionsOrder.forEach(dim => {
      this[dim] = parseFloat(value[dim]);
    });
    this.units = value.units;
  }

  /**
   * @param {Dimensions} origin
   * @return {object}
   */
  updatedEntries(origin) {
    const updated = {};
    Object.keys(this).forEach(key => {
      if (this[key] !== origin[key]) {
        updated[key] = this[key];
      }
    });
    return updated;
  }
}
