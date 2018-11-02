import { getValueFromObj } from "../../helper";

/**
 * @param {object=} data
 * @constructor
 */
export class Record {
  constructor(data) {
    /** @type  Date */
    this.created = getValueFromObj(data, "created", new Date());

    /** @type  Date */
    this.modified = getValueFromObj(data, "modified", null);

    /** @type  Contributor */
    this.author = getValueFromObj(data, "author", null);

    /** @type  string */
    this.text = getValueFromObj(data, "text", "");
  }
}

/**
 * @param {object=} data
 * @constructor
 * @extends Record
 */
export class Note extends Record {
  constructor(data) {
    super(data);

    /** @type  Contributor */
    this.onBehalfOf = getValueFromObj(data, "onBehalfOf", null);

    /** @type {Url[]} */
    this.attachments = getValueFromObj(data, "attachments", []);
  }
}

/**
 * @param {object=} data
 * @constructor
 * @extends Record
 */
export class IterationComponent extends Record {
  constructor(data) {
    super(data);

    /** @type  string, */
    this.type = getValueFromObj(data, "type", "");

    /** @type {string} */
    this.why = getValueFromObj(data, "why", "");

    /** @type {Contributor} */
    this.decidedBy = getValueFromObj(data, "decidedBy", null);

    /** @type {string} */
    this.status = getValueFromObj(data, "status", this.necessityOptions[1]);
  }

  get necessityOptions() {
    return ["possible", "recommended", "important", "critical"];
  }

  get typeOptions() {
    return [];
  }
}

/**
 * @param {object=} data
 * @constructor
 * @extends IterationComponent
 */
export class Equipment extends IterationComponent {
  constructor(data) {
    super(data);

    /** @type  {[number, number, number]} */
    this.dimensions = getValueFromObj(data, "dimensions", [0, 0, 0]);

    /** @type  string */
    this.appearance = getValueFromObj(data, "appearance", "");

    /** @type  number */
    this.weight = getValueFromObj(data, "weight", 0);
  }

  get typeOptions() {
    return ["supporting", "electrical", "custom", "diy"];
  }
}

/**
 * @param {object=} data
 * @constructor
 * @extends Equipment
 */
export class AudioEquipment extends Equipment {
  constructor(data) {
    super(data);

    /** @type  string, */
    this.sensitivity = getValueFromObj(data, "sensitivity", "");

    /** @type  string, */
    this.frequencyResponse = getValueFromObj(data, "frequencyResponse", "");

    /** @type  number, */
    this.impedance = getValueFromObj(data, "impedance", 0);
  }

  get typeOptions() {
    return ["speaker", "headphones"];
  }
}

/**
 * @param {object=} data
 * @constructor
 * @extends Equipment
 */
export class DisplayEquipment extends Equipment {
  constructor(data) {
    super(data);

    /** @type {[number, number]} */
    this.resolution = getValueFromObj(data, "resolution", [0, 0]);

    /** @type number */
    this.pixelDensity = getValueFromObj(data, "pixelDensity", 0);

    /** @type number */
    this.brightness = getValueFromObj(data, "brightness", 0);

    /** @type number */
    this.contrastRatio = getValueFromObj(data, "contrastRatio", 0);

    /** @type number */
    this.colorDepth = getValueFromObj(data, "colorDepth", 0);

    /** @type string */
    this.colorProfile = getValueFromObj(data, "colorProfile", "");

    /** @type string */
    this.modes3D = getValueFromObj(data, "modes3D", "");

    /** @type string */
    this.displayType = getValueFromObj(data, "displayType", "");

    /** @type {[number, number]} */
    this.screenDimensions = getValueFromObj(data, "screenDimensions", [0, 0]);

    /** @type number */
    this.screenDiagonal = getValueFromObj(data, "screenDiagonal", 0);

    /** @type string */
    this.aspectRatio = getValueFromObj(data, "aspectRatio", "");

    /** @type number */
    this.responseTime = getValueFromObj(data, "responseTime", "");

    /** @type {{focalLength: number, shift: boolean, throwRatio: number}} */
    this.lens = getValueFromObj(data, "lens", {
      focalLength: 0,
      shift: false,
      throwRatio: 0
    });

    /** @type string */
    this.speakers = getValueFromObj(data, "speakers", "");

    /** @type number */
    this.audibleNoise = getValueFromObj(data, "audibleNoise", 0);
  }

  get typeOptions() {
    return ["monitor", "projector", "oculus"];
  }
}

/**
 * @param {object=} data
 * @constructor
 * @extends Equipment
 */
export class PlaybackEquipment extends Equipment {
  constructor(data) {
    super(data);

    /** @type  number */
    this.processorCores = getValueFromObj(data, "processorCores", 0);

    /** @type  number */
    this.processorSpeed = getValueFromObj(data, "processorSpeed", 0);

    /** @type  string */
    this.processorArchitecture = getValueFromObj(
      data,
      "processorArchitecture",
      ""
    );

    /** @type  number */
    this.memoryAmount = getValueFromObj(data, "memoryAmount", 0);

    /** @type  string */
    this.memoryType = getValueFromObj(data, "memoryType", "");

    /** @type  number */
    this.graphicsMemoryAmount = getValueFromObj(
      data,
      "graphicsMemoryAmount",
      0
    );

    /** @type  string */
    this.graphicsMemoryType = getValueFromObj(data, "graphicsMemoryType", "");

    /** @type  string */
    this.storageAmount = getValueFromObj(data, "storageAmount", "");

    /** @type  string */
    this.storageType = getValueFromObj(data, "storageType", "");

    /** @type  string */
    this.os = getValueFromObj(data, "os", "");

    /** @type  number */
    this.osVersion = getValueFromObj(data, "osVersion", "");
  }

  get typeOptions() {
    return ["desktop", "laptop", "handheld", "one board"];
  }
}
