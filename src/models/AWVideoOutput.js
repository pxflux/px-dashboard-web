import { AWVideoResolution } from "./AWVideoResolution";

/**
 * @property {number} id
 * @property {string} type - any, monitor, projection, handheld, headset
 * @property {AWVideoResolution} resolution
 * @property {string} orientation - landscape, portrait
 */
export class AWVideoOutput {
  /**
   * @param {number} id
   * @param {?string} type
   * @param {AWVideoResolution} resolution
   * @param {?string} orientation
   */
  constructor(id, type, resolution, orientation) {
    this.id = isNaN(id) ? 0 : id;
    this.type = type;
    this.resolution = resolution;
    this.orientation = orientation;
  }

  static empty() {
    return new AWVideoOutput(0, null, AWVideoResolution.empty(), null);
  }

  /**
   * @param {object} value
   */
  static fromJson(value) {
    if (!value || typeof value !== "object") {
      return null;
    }
    return new AWVideoOutput(
      Number.parseInt(value.id),
      value.type,
      AWVideoResolution.fromJson(value.resolution),
      value.orientation
    );
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries(prefix) {
    const data = {};
    data[prefix + "type"] = this.type;
    Object.assign(data, this.resolution.toEntries(prefix + "resolution/"));
    data[prefix + "orientation"] = this.orientation;
    return data;
  }

  /**
   * @param {string} prefix
   * @param {object} data
   * @param {AWVideoOutput} from
   */
  updatedEntries(prefix, data, from) {
    const origin = from || AWVideoOutput.empty();
    if (this.type === origin.type) {
      delete data[prefix + "type"];
    }
    this.resolution.updatedEntries(
      prefix + "resolution/",
      data,
      origin.resolution
    );
    if (this.orientation === origin.orientation) {
      delete data[prefix + "orientation"];
    }
  }
}

export class AWVideoOutputs {
  /**
   * @return {AWVideoOutput[]}
   */
  static empty() {
    return [];
  }

  /**
   * @param value
   * @return {AWVideoOutput[]}
   */
  static fromJson(value) {
    if (!value || typeof value !== "object") {
      return [];
    }
    if (typeof value === "object") {
      return Object.keys(value).map(key =>
        AWVideoOutput.fromJson(Object.assign(value[key], { id: key }))
      );
    }
    if (Array.isArray(value)) {
      return value.map(it => AWVideoOutput.fromJson(it));
    }
    return [];
  }

  /**
   * @param {AWVideoOutput[]} values
   */
  static append(values) {
    values.push(
      new AWVideoOutput(
        values.length,
        "any",
        AWVideoResolution.empty(),
        "landscape"
      )
    );
  }

  /**
   * @param {AWVideoOutput[]} values
   * @param {number} index
   */
  static remove(values, index) {
    values.splice(index, 1);
    for (let i = 0; i < values.length; i++) {
      values[i].id = i;
    }
  }

  /**
   * @param {AWVideoOutput[]} outputs
   */
  static toString(outputs) {
    if (outputs.length === 0) {
      return "No video";
    }
    const types = {};
    outputs.forEach(output => {
      let resolution = output.resolution.toString();
      if (!types.hasOwnProperty(output.type)) {
        types[output.type] = {};
      }
      if (!types[output.type].hasOwnProperty(resolution)) {
        types[output.type][resolution] = 0;
      }
      types[output.type][resolution]++;
    });
    let result = "";
    Object.keys(types).forEach(type => {
      Object.keys(types[type]).forEach(resolution => {
        let count = types[type][resolution];
        if (type === "any") {
          type = (count > 1 ? "displays" : "display") + " of any type";
        } else {
          if (count > 1) {
            type += "s";
          }
        }
        if (count === 1) {
          count = "Single";
        }
        if (result) {
          result += ", ";
        }
        if (resolution === "any") {
          resolution = "";
        }
        result += `${count} ${resolution} ${type}`;
      });
    });
    return result;
  }

  /**
   * @param {string} prefix - '.../setups/'
   * @param {AWVideoOutput[]} values
   * @return {Object}
   */
  static toEntries(prefix, values) {
    const data = {};
    values.forEach(value => {
      Object.assign(data, value.toEntries(prefix + value.id + "/"));
    });
    return data;
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {AWVideoOutput[]} originals
   * @param {AWVideoOutput[]} values
   */
  static updatedEntries(prefix, data, originals, values) {
    // add & updates
    values.forEach(value => {
      const original = originals.find(item => item.id === value.id);
      value.updatedEntries(prefix + value.id + "/", data, original);
    });
    // remove
    originals.forEach(original => {
      const items = values.filter(item => item.id === original.id);
      if (items.length === 0) {
        data[prefix + original.id] = null;
      }
    });
  }
}
