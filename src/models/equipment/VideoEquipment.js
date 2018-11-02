import { Equipment } from "./Equipment";

export class VideoEquipment extends Equipment {
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
   * @param {[number, number]} resolution
   * @param {number} pixelDensity
   * @param {number} brightness
   * @param {number} contrastRatio
   * @param {number} colorDepth
   * @param {string} colorProfile
   * @param {string} modes3D
   * @param {string} displayType
   * @param {Dimensions} screenDimensions
   * @param {number} screenDiagonal
   * @param {string} aspectRatio
   * @param {number} responseTime
   * @param {{focalLength: number, shift: boolean, throwRatio: number}} lens
   * @param {string} speakers
   * @param {number} audibleNoise
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
    resolution,
    pixelDensity,
    brightness,
    contrastRatio,
    colorDepth,
    colorProfile,
    modes3D,
    displayType,
    screenDimensions,
    screenDiagonal,
    aspectRatio,
    responseTime,
    lens,
    speakers,
    audibleNoise
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
    this.resolution = resolution;
    this.pixelDensity = pixelDensity;
    this.brightness = brightness;
    this.contrastRatio = contrastRatio;
    this.colorDepth = colorDepth;
    this.colorProfile = colorProfile;
    this.modes3D = modes3D;
    this.displayType = displayType;
    this.screenDimensions = screenDimensions;
    this.screenDiagonal = screenDiagonal;
    this.aspectRatio = aspectRatio;
    this.responseTime = responseTime;
    this.lens = lens;
    this.speakers = speakers;
    this.audibleNoise = audibleNoise;
  }

  static fromJson(value) {
    const parent = Equipment.fromJson(value);
    if (parent === null) {
      return null;
    }
    return new VideoEquipment(
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
      value.resolution,
      value.pixelDensity,
      value.brightness,
      value.contrastRatio,
      value.colorDepth,
      value.colorProfile,
      value.modes3D,
      value.displayType,
      value.screenDimensions,
      value.screenDiagonal,
      value.aspectRatio,
      value.responseTime,
      value.lens,
      value.speakers,
      value.audibleNoise
    );
  }
}
