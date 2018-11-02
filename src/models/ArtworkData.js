import { ContributorRefs } from "./ContributorRef";
import { AWSetups } from "./AWSetup";
import { Controls } from "./Control";

/**
 * @property {?string} key
 * @property {boolean} published
 * @property {?string} title
 * @property {ContributorRef[]} artists
 * @property {ContributorRef[]} credits
 * @property {?number} year
 * @property {?string} description
 * @property {AWSetup[]} setups
 * @property {Control[]} controls
 */
export class Artwork {
  constructor(
    key,
    published,
    title,
    artists,
    credits,
    year,
    description,
    setups,
    controls
  ) {
    this.key = key || null;
    this.published = published || false;
    this.title = title || null;
    this.artists = artists;
    this.credits = credits;
    this.year = isNaN(year) ? 0 : year;
    this.description = description || null;
    this.setups = setups;
    this.controls = controls;
  }

  static empty() {
    return new Artwork(
      null,
      false,
      null,
      ContributorRefs.empty(),
      ContributorRefs.empty(),
      0,
      null,
      AWSetups.empty(),
      Controls.empty()
    );
  }

  /**
   * @param {object} value
   */
  static fromJson(value) {
    if (!value || typeof value !== "object") {
      return null;
    }
    const key = value.hasOwnProperty(".key") ? value[".key"] : value.key;
    return new Artwork(
      key,
      value.published,
      value.title,
      ContributorRefs.fromJson(value.artists),
      ContributorRefs.fromJson(value.credits),
      Number.parseInt(value.year),
      value.description,
      AWSetups.fromJson(value.setups),
      Controls.fromJson(value.controls)
    );
  }

  /**
   * @param {string} prefix
   * @return {Object}
   */
  toEntries(prefix) {
    const data = {};
    data[prefix + "published"] = this.published;
    data[prefix + "title"] = this.title;
    Object.assign(
      data,
      ContributorRefs.toEntries(prefix + "artists/", this.artists)
    );
    Object.assign(
      data,
      ContributorRefs.toEntries(prefix + "credits/", this.credits)
    );
    data[prefix + "year"] = this.year;
    data[prefix + "description"] = this.description;
    Object.assign(data, AWSetups.toEntries(prefix + "setups/", this.setups));
    Object.assign(
      data,
      Controls.toEntries(prefix + "controls/", this.controls)
    );
    return data;
  }

  /**
   * @param {string} prefix
   * @param {Artwork} original
   * @return {Object}
   */
  toUpdates(prefix, original) {
    const data = this.toEntries(prefix);
    this.updatedEntries(prefix, data, original);
    return data;
  }

  /**
   * @param {string} prefix
   * @param {Object} data
   * @param {Artwork} from
   */
  updatedEntries(prefix, data, from) {
    const origin = from || Artwork.empty();
    if (this.published === origin.published) {
      delete data[prefix + "published"];
    }
    if (this.title === origin.title) {
      delete data[prefix + "title"];
    }
    ContributorRefs.updatedEntries(
      prefix + "artists/",
      data,
      origin.artists,
      this.artists
    );
    ContributorRefs.updatedEntries(
      prefix + "credits/",
      data,
      origin.credits,
      this.credits
    );
    if (this.year === origin.year) {
      delete data[prefix + "year"];
    }
    if (this.description === origin.description) {
      delete data[prefix + "description"];
    }
    AWSetups.updatedEntries(
      prefix + "setups/",
      data,
      origin.setups,
      this.setups
    );
    Controls.updatedEntries(
      prefix + "controls/",
      data,
      origin.controls,
      this.controls
    );
  }
}
