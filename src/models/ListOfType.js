/**
 * @prop {constructor} DataType
 * @prop {array} list
 * @method fromJson
 * @method updatedEntries
 */
export class ListOfType {
  /**
   * @param {constructor} constructor
   * @param {object=} jsonData
   */
  constructor(constructor, jsonData) {
    this.DataType = constructor;
    this.list = [];

    if (typeof jsonData === "object") {
      this.fromJson(jsonData);
    }
  }

  /**
   * @param {ListOfType} originalSet
   * @return {array}
   */
  updatedEntries(originalSet) {
    const updatedList = [];
    this.list.forEach((obj, i) => {
      if (originalSet.list.length > i) {
        const objUpdatedEntries = obj.updatedEntries(originalSet[i]);
        if (Object.keys(objUpdatedEntries).length) {
          updatedList.push(objUpdatedEntries);
        }
      } else {
        updatedList.push(obj);
      }
    });
    return updatedList;
  }

  fromJson(value) {
    if (typeof value === "object") {
      this.list = Object.keys(value).map(key => new this.DataType(value[key]));
    }
  }
}
