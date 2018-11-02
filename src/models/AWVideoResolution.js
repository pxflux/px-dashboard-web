import { Resolution } from "./basic/Resolution";
import commonResolutions from "./utilities/standard-resolutions";

/**
 * @property {Resolution} min
 * @property {Resolution} max
 * @property {Resolution} optimal
 */
export class AWVideoResolution {
  /**
   * @param {Resolution} min
   * @param {Resolution} max
   * @param {Resolution} optimal
   */
  constructor(min, max, optimal) {
    this.min = min;
    this.max = max;
    this.optimal = optimal;
  }

  static empty() {
    return new AWVideoResolution(
      Resolution.empty(),
      Resolution.empty(),
      Resolution.empty()
    );
  }

  /**
   * @param {object} value
   */
  static fromJson(value) {
    if (!value || typeof value !== "object") {
      return AWVideoResolution.empty();
    }
    return new AWVideoResolution(
      Resolution.fromJson(value.min),
      Resolution.fromJson(value.max),
      Resolution.fromJson(value.optimal)
    );
  }

  toString() {
    const w = this.optimal.w
      ? this.optimal.w
      : this.max.w
        ? this.max.w
        : this.min.w;
    const h = this.optimal.h
      ? this.optimal.h
      : this.max.h
        ? this.max.h
        : this.min.h;
    if (w === 0 || h === 0) {
      return "any";
    }
    const standard = commonResolutions.closestStandardForSize({ w: w, h: h });
    return standard ? standard.abr : `(${w} x ${h} px)`;
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries(prefix) {
    const data = {};
    Object.assign(data, this.min.toEntries(prefix + "min/"));
    Object.assign(data, this.max.toEntries(prefix + "max/"));
    Object.assign(data, this.optimal.toEntries(prefix + "optimal/"));
    return data;
  }

  /**
   * @param {string} prefix
   * @param {object} data
   * @param {AWVideoResolution} from
   */
  updatedEntries(prefix, data, from) {
    const origin = from || AWVideoResolution.empty();
    this.min.updatedEntries(prefix + "min/", data, origin.min);
    this.max.updatedEntries(prefix + "max/", data, origin.max);
    this.optimal.updatedEntries(prefix + "optimal/", data, origin.optimal);
  }
}
