export class ArrayOfType {
  /**
   * @param {constructor} Constructor
   * @return {Array<constructor>}
   */
  static empty(Constructor) {
    return [
      typeof Constructor.empty === "function"
        ? Constructor.empty()
        : new Constructor()
    ];
  }

  /**
   * @param {object} value
   * @param {constructor} Constructor
   * @return {*[]}
   */
  static fromJson(value, Constructor) {
    if (!Constructor) return [];
    if (typeof value === "object" && value !== null) {
      if (typeof Constructor.fromJson === "function") {
        return Object.keys(value).map(key =>
          Constructor.fromJson(Object.assign(value[key], { order: key }))
        );
      } else {
        return Object.keys(value).map(
          key => new Constructor(Object.assign(value[key], { order: key }))
        );
      }
    }
    if (Array.isArray(value)) {
      return value.map(
        it =>
          typeof Constructor.fromJson === "function"
            ? Constructor.fromJson(it)
            : new Constructor(it)
      );
    }
    return [];
  }

  /**
   * @param {string} prefix  - e.g. '.../setups/{index}/'
   * @param {object[]} objects
   * @return {Object}
   */
  static toEntries(prefix, objects) {
    const data = {};
    objects.forEach((object, i) => {
      Object.assign(data, object.toEntries(prefix + (object.order || i) + "/"));
    });
    return data;
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {object[]} originals
   * @param {object[]} values
   */
  static updatedEntries(prefix, data, originals, values) {
    // add & updates
    values.forEach(value => {
      const Constructor = value.constructor;
      const items = originals.filter(item => item.order === value.order);
      const original =
        items.length > 0
          ? items[0]
          : typeof Constructor.empty === "function"
            ? Constructor.empty()
            : new Constructor();
      value.updatedEntries(prefix + value.order + "/", data, original);
    });
    // remove
    originals.forEach(original => {
      const items = values.filter(item => item.order === original.order);
      if (items.length === 0) {
        data[prefix + original.order] = null;
      }
    });
  }
}
