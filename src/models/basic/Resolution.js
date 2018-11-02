/**
 * @param {number} w
 * @param {number} h
 */
export class Resolution {
  /**
   * @param {number} w
   * @param {number} h
   */
  constructor(w, h) {
    this.w = isNaN(w) ? 0 : w;
    this.h = isNaN(h) ? 0 : h;
  }

  static empty() {
    return new Resolution(0, 0);
  }

  /**
   * @param {object} value
   */
  static fromJson(value) {
    if (!value || typeof value !== "object") {
      return null;
    }
    return new Resolution(Number.parseInt(value.w), Number.parseInt(value.h));
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries(prefix) {
    const data = {};
    data[prefix + "w"] = this.w;
    data[prefix + "h"] = this.h;
    return data;
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {Resolution} from
   */
  updatedEntries(prefix, data, from) {
    const origin = from || Resolution.empty();
    if (this.w === origin.w) {
      delete data[prefix + "w"];
    }
    if (this.h === origin.h) {
      delete data[prefix + "h"];
    }
  }

  toString() {
    return `${this.w} x ${this.h} px`;
  }
}
