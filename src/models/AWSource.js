import axios from "axios";
import vimeo from "./utilities/vimeo";
import { Resolution } from "./basic/Resolution";
import { ImageAttachment } from "./ImageAttachment";

/**
 * @property {?string} url
 * @property {?string} type - 'html' | 'vimeo' | 'video' | 'audio' | 'pd' | 'processing' | etc.
 * @property {?string} version
 * @property {boolean} local - If the source is stored locally on the pxFlux server
 * @property {string[]} dependencies - If applicable (e.g. for Javascript), an array of external libraries, frameworks or services
 * @property {string[]} assets - If applicable (e.g. for HTML or Javascript), an array of external (media) files used in the source
 * @property {number} dataSize - In bits
 * @property {number} dataRate - Or bit rate
 * @property {?Resolution} resolution
 * @property {number} duration
 * @property {boolean} loop - Whether the source is the loop
 * @property {number} fps - If applicable (e.g. for Video) frame per second
 * @property {number} pixelAspectRatio - If applicable (e.g. for Video) frame per second
 * @property {number} colorDepth
 * @property {?string} colorProfile
 * @property {?string} codec
 * @property {number} videoTracksCount
 * @property {number} audioTracksCount
 * @property {?ImageAttachment} thumbnail
 */
export class AWSource {
  /**
   * @param {?string} url
   * @param {?string} type
   * @param {?string} version
   * @param {boolean} local
   * @param {string[]} dependencies
   * @param {string[]} assets
   * @param {number} dataSize
   * @param {number} dataRate
   * @param {?Resolution} resolution
   * @param {number} duration
   * @param {boolean} loop
   * @param {number} fps
   * @param {number} pixelAspectRatio
   * @param {number} colorDepth
   * @param {?string} colorProfile
   * @param {?string} codec
   * @param {number} videoTracksCount
   * @param {number} audioTracksCount
   * @param {?ImageAttachment} thumbnail
   */
  constructor(
    url,
    type,
    version,
    local,
    dependencies,
    assets,
    dataSize,
    dataRate,
    resolution,
    duration,
    loop,
    fps,
    pixelAspectRatio,
    colorDepth,
    colorProfile,
    codec,
    videoTracksCount,
    audioTracksCount,
    thumbnail
  ) {
    this.url = url || null;
    this.type = type || null;
    this.version = version || null;
    this.local = local || false;
    this.dependencies = dependencies || [];
    this.assets = assets || [];
    this.dataSize = isNaN(dataSize) ? 0 : dataSize;
    this.dataRate = isNaN(dataRate) ? 0 : dataRate;
    this.resolution = resolution;
    this.duration = isNaN(duration) ? 0 : duration;
    this.loop = loop || false;
    this.fps = isNaN(fps) ? 0 : fps;
    this.pixelAspectRatio = isNaN(pixelAspectRatio) ? 0 : pixelAspectRatio;
    this.colorDepth = isNaN(colorDepth) ? 0 : colorDepth;
    this.colorProfile = colorProfile || null;
    this.codec = codec || null;
    this.videoTracksCount = isNaN(videoTracksCount) ? 0 : videoTracksCount;
    this.audioTracksCount = isNaN(audioTracksCount) ? 0 : audioTracksCount;
    this.thumbnail = thumbnail || null;
  }

  static empty() {
    return new AWSource(
      null,
      null,
      null,
      false,
      [],
      [],
      0,
      0,
      null,
      0,
      false,
      0,
      0,
      0,
      null,
      null,
      0,
      0,
      null
    );
  }

  /**
   * @param {object} value
   */
  static fromJson(value) {
    if (!value || typeof value !== "object") {
      return null;
    }
    return new AWSource(
      value.url,
      value.type,
      value.version,
      value.local,
      value.dependencies,
      value.assets,
      Number.parseInt(value.dataSize),
      Number.parseInt(value.dataRate),
      Resolution.fromJson(value.resolution),
      Number.parseInt(value.duration),
      value.loop,
      Number.parseInt(value.fps),
      Number.parseInt(value.pixelAspectRatio),
      Number.parseInt(value.colorDepth),
      value.colorProfile,
      value.codec,
      Number.parseInt(value.videoTracksCount),
      Number.parseInt(value.audioTracksCount),
      ImageAttachment.fromJson(value.thumbnail)
    );
  }

  /**
   * @param {?string} url
   * @param {?VimeoVideoInfo} value
   * @return {AWSource}
   */
  static fromVimeo(url, value) {
    if (!value || typeof value !== "object") {
      return null;
    }
    return new AWSource(
      url,
      "vimeo",
      null,
      false,
      [],
      [],
      0,
      0,
      new Resolution(value.width, value.height),
      value.duration,
      false,
      0,
      1,
      0,
      null,
      null,
      0,
      0,
      ImageAttachment.fromVimeo(0, value)
    );
  }

  /**
   * @param {string} url
   */
  static fromUrl(url) {
    if (vimeo.isVimeoVideoUrl(url)) {
      return vimeo.getVimeoVideoInfo(url).then(
        /** @type VimeoVideoInfo */ info => {
          return AWSource.fromVimeo(url, info);
        }
      );
    }
    if (!url) {
      return Promise.reject(new Error("Empty url"));
    }
    const requestUrl =
      "https://50artistsnet.ipage.com/url-to-headers/index.php?url=" +
      encodeURIComponent(this.url);
    return axios
      .post(requestUrl)
      .catch(function(error) {
        if (error.response) {
          throw new Error(error.response.data);
        } else if (error.request) {
          throw new Error("network/request-failed");
        }
        throw new Error("network/invalid-request");
      })
      .then(response => {
        if (
          typeof response.data === "object" &&
          response.data.hasOwnProperty("Content-Type")
        ) {
          return new AWSource(
            url,
            response.data["Content-Type"],
            null,
            false,
            [],
            [],
            0,
            0,
            null,
            0,
            false,
            0,
            1,
            0,
            null,
            null,
            0,
            0,
            null
          );
        } else {
          return AWSource.empty();
        }
      });
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries(prefix) {
    const data = {};
    data[prefix + "url"] = this.url;
    data[prefix + "type"] = this.type;
    data[prefix + "version"] = this.version;
    data[prefix + "local"] = this.local;
    data[prefix + "dependencies"] = this.dependencies;
    data[prefix + "assets"] = this.assets;
    data[prefix + "dataSize"] = this.dataSize;
    data[prefix + "dataRate"] = this.dataRate;
    if (this.resolution === null) {
      data[prefix + "resolution"] = null;
    } else {
      Object.assign(data, this.resolution.toEntries(prefix + "resolution/"));
    }
    data[prefix + "duration"] = this.duration;
    data[prefix + "loop"] = this.loop;
    data[prefix + "fps"] = this.fps;
    data[prefix + "pixelAspectRatio"] = this.pixelAspectRatio;
    data[prefix + "colorDepth"] = this.colorDepth;
    data[prefix + "colorProfile"] = this.colorProfile;
    data[prefix + "codec"] = this.codec;
    data[prefix + "videoTracksCount"] = this.videoTracksCount;
    data[prefix + "audioTracksCount"] = this.audioTracksCount;
    if (this.thumbnail === null) {
      data[prefix + "thumbnail"] = null;
    } else {
      Object.assign(data, this.thumbnail.toEntries(prefix + "thumbnail/"));
    }
    return data;
  }

  /**
   * @param {string} prefix
   * @param {AWSource} data
   * @param {AWSource} from
   */
  updatedEntries(prefix, data, from) {
    const origin = from || AWSource.empty();
    if (this.url === origin.url) {
      delete data[prefix + "url"];
    }
    if (this.type === origin.type) {
      delete data[prefix + "type"];
    }
    if (this.version === origin.version) {
      delete data[prefix + "version"];
    }
    if (this.local === origin.local) {
      delete data[prefix + "local"];
    }
    if (this.dependencies === origin.dependencies) {
      delete data[prefix + "dependencies"];
    }
    if (this.assets === origin.assets) {
      delete data[prefix + "assets"];
    }
    if (this.dataSize === origin.dataSize) {
      delete data[prefix + "dataSize"];
    }
    if (this.dataRate === origin.dataRate) {
      delete data[prefix + "dataRate"];
    }
    if (this.resolution !== null) {
      this.resolution.updatedEntries(
        prefix + "resolution/",
        data,
        origin.resolution
      );
    }
    if (this.duration === origin.duration) {
      delete data[prefix + "duration"];
    }
    if (this.loop === origin.loop) {
      delete data[prefix + "loop"];
    }
    if (this.fps === origin.fps) {
      delete data[prefix + "fps"];
    }
    if (this.pixelAspectRatio === origin.pixelAspectRatio) {
      delete data[prefix + "pixelAspectRatio"];
    }
    if (this.colorDepth === origin.colorDepth) {
      delete data[prefix + "colorDepth"];
    }
    if (this.colorProfile === origin.colorProfile) {
      delete data[prefix + "colorProfile"];
    }
    if (this.codec === origin.codec) {
      delete data[prefix + "codec"];
    }
    if (this.videoTracksCount === origin.videoTracksCount) {
      delete data[prefix + "videoTracksCount"];
    }
    if (this.audioTracksCount === origin.audioTracksCount) {
      delete data[prefix + "audioTracksCount"];
    }
    if (this.thumbnail !== null) {
      this.thumbnail.updatedEntries(
        prefix + "thumbnail/",
        data,
        origin.thumbnail
      );
    }
  }

  toString() {
    if (!this.url) {
      return "The URL is not valid.";
    } else {
      const resolution = this.resolution ? this.resolution.toString() : "";
      switch (this.type) {
        case "vimeo":
          return `Vimeo video ${resolution} | [${this.durationToString(
            this.duration
          )}]`;
        default:
          return `${
            this.local ? "" : "External link "
          }${this.type.toUpperCase()}`;
      }
    }
  }

  durationToString(dur) {
    const hours = Math.floor(dur / 3600);
    dur = dur - hours * 3600;
    const minutes = Math.floor(dur / 60);
    const seconds = dur - minutes * 60;

    return strPadLeft(minutes, "0", 2) + ":" + strPadLeft(seconds, "0", 2);

    function strPadLeft(string, pad, length) {
      return (new Array(length + 1).join(pad) + string).slice(-length);
    }
  }
}
