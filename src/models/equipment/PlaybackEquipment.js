import { Equipment } from "./Equipment";

export class PlaybackEquipment extends Equipment {
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
   * @param {number} processorCores
   * @param {number} processorSpeed
   * @param {string} processorArchitecture
   * @param {number} memoryAmount
   * @param {string} memoryType
   * @param {number} graphicsMemoryAmount
   * @param {string} graphicsMemoryType
   * @param {string} storageAmount
   * @param {string} storageType
   * @param {string} os
   * @param {number} osVersion
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
    processorCores,
    processorSpeed,
    processorArchitecture,
    memoryAmount,
    memoryType,
    graphicsMemoryAmount,
    graphicsMemoryType,
    storageAmount,
    storageType,
    os,
    osVersion
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
    this.processorCores = processorCores;
    this.processorSpeed = processorSpeed;
    this.processorArchitecture = processorArchitecture;
    this.memoryAmount = memoryAmount;
    this.memoryType = memoryType;
    this.graphicsMemoryAmount = graphicsMemoryAmount;
    this.graphicsMemoryType = graphicsMemoryType;
    this.storageAmount = storageAmount;
    this.storageType = storageType;
    this.os = os;
    this.osVersion = osVersion;
  }

  static fromJson(value) {
    const parent = Equipment.fromJson(value);
    if (parent === null) {
      return null;
    }
    return new PlaybackEquipment(
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
      value.processorCores,
      value.processorSpeed,
      value.processorArchitecture,
      value.memoryAmount,
      value.memoryType,
      value.graphicsMemoryAmount,
      value.graphicsMemoryType,
      value.storageAmount,
      value.storageType,
      value.os,
      value.osVersion
    );
  }
}
