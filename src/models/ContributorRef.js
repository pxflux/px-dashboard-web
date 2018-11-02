/**
 * @property {?string} id
 * @property {?string} fullName
 * @property {?string} role
 */

export class ContributorRef {
  /**
   * @param {?string} key
   * @param {?string} fullName
   * @param {?string} role
   */
  constructor(key, fullName, role) {
    this.key = key || null;
    this.fullName = fullName || null;
    this.role = role || null;
  }

  /**
   * @return {ContributorRef}
   */
  static empty() {
    return new ContributorRef(null, null, null);
  }

  /**
   * @param value
   * @return {ContributorRef}
   */
  static fromJson(value) {
    if (!value || typeof value !== "object") {
      return null;
    }
    const key = value.hasOwnProperty(".key") ? value[".key"] : value.key;
    return new ContributorRef(key, value.fullName, value.role);
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries(prefix) {
    const data = {};
    data[prefix + "fullName"] = this.fullName;
    data[prefix + "role"] = this.role;
    return data;
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {ContributorRef} from
   */
  updatedEntries(prefix, data, from) {
    const origin = from || ContributorRef.empty();
    if (this.fullName === origin.fullName) {
      delete data[prefix + "fullName"];
    }
    if (this.role === origin.role) {
      delete data[prefix + "role"];
    }
  }
}

export class ContributorRefs {
  /**
   * @return {ContributorRef[]}
   */
  static empty() {
    return [];
  }

  /**
   * @param value
   * @return {ContributorRef[]}
   */
  static fromJson(value) {
    if (!value) {
      return [];
    }
    if (typeof value === "object") {
      return Object.keys(value).map(key =>
        ContributorRef.fromJson(Object.assign(value[key], { key: key }))
      );
    }
    if (Array.isArray(value)) {
      return value.map(it => ContributorRef.fromJson(it));
    }
    return [];
  }

  /**
   * @param {string} prefix
   * @param {ContributorRef[]} values
   * @return {Object}
   */
  static toEntries(prefix, values) {
    const data = {};
    values.forEach(value => {
      Object.assign(data, value.toEntries(prefix + value.key + "/"));
    });
    return data;
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {ContributorRef[]} originals
   * @param {ContributorRef[]} values
   */
  static updatedEntries(prefix, data, originals, values) {
    // add & updates
    values.forEach(value => {
      const items = originals.filter(item => item.key === value.key);
      const original = items.length > 0 ? items[0] : ContributorRef.empty();
      value.updatedEntries(prefix + value.key + "/", data, original);
    });
    // remove
    originals.forEach(original => {
      const items = values.filter(item => item.key === original.key);
      if (items.length === 0) {
        data[prefix + original.key] = null;
      }
    });
  }
}
