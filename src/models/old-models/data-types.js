/* eslint-disable valid-typeof */
import { isNumeric, setupProtoInheritance } from "../../helper";

export function BasicData() {}

/**
 * @param {object} obj
 * @return {void}
 */
BasicData.prototype.castFrom = function(obj) {
  if (typeof obj !== "object") return;
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop) && this.hasOwnProperty(prop)) {
      const candidateValue = obj[prop];
      const defaultValue = this[prop];
      const defaultType = typeof defaultValue;
      if (
        typeof candidateValue === "object" &&
        typeof defaultValue.castFrom === "function"
      ) {
        defaultValue.castFrom(candidateValue);
      } else {
        let value = null;
        if (Array.isArray(defaultValue) && defaultValue.length) {
          value = this.convertToArrayOfType(
            defaultValue[0].constructor,
            candidateValue
          );
        } else if (typeof candidateValue === defaultType) {
          value = candidateValue;
        } else if (defaultType === "number" && isNumeric(candidateValue)) {
          value = parseFloat(candidateValue);
        } else if (defaultType === "boolean") {
          value = this.convertToBoolean(candidateValue, defaultValue);
        }
        if (value) this[prop] = value;
      }
    }
  }
};
BasicData.prototype.convertToBoolean = function(value, defaultValue) {
  return value === "true" ||
    value === "1" ||
    (value === "false" || value === "0")
    ? false
    : defaultValue;
};

/**
 * Converts object into Array of specific type
 * @param {constructor} TypeConstructor
 * @param {object} obj
 * @return {Array}
 */
BasicData.prototype.convertToArrayOfType = function(TypeConstructor, obj) {
  const arr = [];
  if (typeof obj !== "object") return arr;
  if (typeof TypeConstructor !== "function") return arr;
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    const item = new TypeConstructor(obj[key]);
    item[".key"] = key;
    arr.push(item);
  }
  return arr;
};

/**
 * @param {object=} data
 * @constructor
 * @extends BasicData
 */
export function Dimensions(data) {
  BasicData.call(this);

  this.w = 0;
  this.h = 0;
  this.unit = "px";

  this.castFrom(data);
}

setupProtoInheritance(Dimensions, BasicData);

export function AttachmentData(data) {
  BasicData.call(this);

  this.displayUrl = "";
  this.storageUri = "";
  this.type = ""; // image|video|file|...
  this.ratio = 0; // 1.7777777778 - 16:9

  this.castFrom(data);
}

setupProtoInheritance(AttachmentData, BasicData);

/**
 * @param {object=} data
 * @constructor
 */
export function AttachmentVideoData(data) {
  AttachmentData.call(this);

  this.type = "video";
  this.thumbnail = new AttachmentData();
  this.duration = 0;

  this.castFrom(data);
}

setupProtoInheritance(AttachmentVideoData, AttachmentData);

/**
 * @param {object=} data
 * @constructor
 * @extends BasicData
 */
export function ArtworkSourceData(data) {
  BasicData.call(this);

  this.type = "html"; // video|html|...
  this.version = "";
  this.url = "";

  this.castFrom(data);
}

setupProtoInheritance(ArtworkSourceData, BasicData);

/**
 * @param {object=} data
 * @constructor
 * @extends BasicData
 */
export function ArtworkSpecifications(data) {
  BasicData.call(this);

  this.numberScreens = 1;
  this.screenResolutionns = [];

  this.castFrom(data);
}

setupProtoInheritance(ArtworkSpecifications, BasicData);

/**
 * Control Data Type
 * @param {object=} data
 * @constructor
 * @extends BasicData
 */
export function Control(data) {
  BasicData.call(this);

  this.order = 0;
  this.icon = ""; // Unicode Character or Attachment TODO: it should be of type Icon
  this.label = "";
  this.type = ""; // 'keyboard'|'mouse'|'function'|'custom'
  this.value = {
    keyCode: "",
    modifier: "", // 'shiftKey'|'ctrlKey'|'altKey'|'metaKey'
    type: "" // 'keydown'|'keyup'|'keypress'
  };

  this.castFrom(data);
}

setupProtoInheritance(Control, BasicData);

/**
 * @param {object=} data
 * @constructor
 * @extends BasicData
 */
export function User(data) {
  BasicData.call(this);

  /** @type string */
  this.id = "";

  /** @type string */
  this.displayName = "";

  /** @type string - default user photo came from authorisation with google */
  this.photoUrl = "";

  /** @type AttachmentData - custom user photo */
  this.photo = new AttachmentData();

  this.castFrom(data);
}

setupProtoInheritance(User, BasicData);

/**
 * @param {object=} data
 * @constructor
 * @extends User
 */
export function Contributor(data) {
  User.call(this);

  /** @type  string */
  this.role = "";

  this.castFrom(data);
}

setupProtoInheritance(Contributor, User);

Contributor.prototype.hasMainRole = function() {
  return this.constructor.roles.indexOf(this.role) === 0;
};

Contributor.prototype.hasImportantRole = function() {
  return this.constructor.roles.indexOf(this.role) < 2;
};

/**
 * @constructor
 */
export function ContributorsList() {
  BasicData.call(this);

  this.contributors = [];

  this.roles = [
    "artist",
    "artistAssistant",
    "interpreter",
    "curator",
    "exhibitionDesigner",
    "mediaTechnician",
    "conservator",
    "registrar",
    "fabricator",
    "artHandler",
    "externalCompany",
    "other"
  ];

  this.listMainContributors = function() {
    return this.listWithRank(1);
  };

  this.listWithRank = function(rank) {
    let list = [];
    for (let i = 0; i < this.contributors.length; i++) {
      const contributor = this.contributors[i];
      if (this.roles.indexOf(contributor.role) < rank) {
        list.push(contributor);
      }
    }
    return list;
  };

  /**
   * @param {Contributor[]=} list
   * @return {string}
   */
  this.toString = function(list) {
    if (!list.length) list = this.contributors;
    if (!list.length) return "";
    let str = "";
    let separator = list.length > 2 ? ", " : " & ";
    list.forEach(member => {
      if (str) str += separator;
      str += member.displayName;
    });
    return str;
  };

  this.stringMainContributors = function() {
    return this.toString(this.listMainContributors());
  };

  this.stringWithRank = function(rank) {
    return this.toString(this.listWithRank(rank));
  };
}

setupProtoInheritance(ContributorsList, BasicData);

ContributorsList.prototype.castFrom = function(data) {
  if (arguments.length > 1) data = { ...arguments };
  this.contributors = this.convertToArrayOfType(Contributor, data);
};
