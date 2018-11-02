/* eslint-disable no-trailing-spaces,no-multi-spaces,key-spacing */
/**
 * Based on Iteration Report by Guggenheim Conservation Department
 * @link https://www.guggenheim.org/wp-content/uploads/2015/11/guggenheim-conservation-iteration-report-2012.pdf
 */
/**
 * @typedef {
 *  {
 *   type: string,
 *   value: *,
 *  }
 * } FieldData
 */
/**
 * @typedef {
 *  {
 *   date: Date,
 *   author: User,
 *   text: string
 *  }
 * } Comment
 * @typedef {Comment[]} Comments
 */

import {
  AudioEquipment,
  Contributor,
  DisplayEquipment,
  IterationComponent,
  PlaybackEquipment
} from "./iteration-data-types";
import { getValueFromObj } from "../../helper";

/**
 * @param {object=} data
 * @constructor
 */
export function IterationModel(data) {
  this.data = {
    id: getValueFromObj(data, "id", ""),
    name: getValueFromObj(data, "name", ""),
    thumbUrl: getValueFromObj(data, "thumbUrl", ""),
    date: field("date"),
    exhibitions: field("Show[]"),
    /** @type Contributor[] */
    contributors: [],
    /** @type Contributor */
    supervisedBy: new Contributor(),
    installation: fieldsGroup({
      installedBy: field("text"),
      withArtist: field("boolean"),
      artistInfluence: field("Note")
    }),
    documentation: {
      images: getValueFromObj(data, "documentation/images", []),
      video: getValueFromObj(data, "documentation/video", []),
      technicalDrawings: field("url[]"),
      notes: field("Note[]"),
      artistInterview: field("Note"),
      assistantInterview: field("Note"),
      other: field("url[]")
    },
    evaluation: fieldsGroup({
      notes: field("Note[]"),
      approvedByArtist: false,
      warnings: field("Note[]")
    }),
    comments: field("Comment[]"),
    publications: field("Publication[]"),
    space: {
      context: new IterationComponent(),
      floorPlan: new IterationComponent(),
      dimensions: new IterationComponent(),
      fakeWalls: new IterationComponent(),
      ceilingHeight: new IterationComponent(),
      ceiling: new IterationComponent(),
      wall: new IterationComponent(),
      floor: new IterationComponent(),
      acoustic: new IterationComponent(),
      lighting: new IterationComponent(),
      entranceExit: new IterationComponent(),
      visitorFlow: new IterationComponent(),
      displayPosition: new IterationComponent(),
      playerPosition: new IterationComponent(),
      projectionDistances: new IterationComponent(),
      screens: new IterationComponent(),
      imageSize: new IterationComponent(),
      imagePlacement: new IterationComponent(),
      projectionSurface: new IterationComponent()
    },
    exhibitionCopies: fieldsGroup({
      /* we probably don't need this */
    }),
    equipment: {
      visual: [new DisplayEquipment()],
      audio: [new AudioEquipment()],
      playback: [new PlaybackEquipment()],
      other: field("IterationComponentList")
    },
    otherComponents: field("IterationComponentList"),
    technicalSetup: fieldsGroup({
      looped: new IterationComponent(),
      timed: new IterationComponent(),
      synched: new IterationComponent(),
      controlled: new IterationComponent(),
      amperageInSpaceAtEquipment: new IterationComponent(),
      conditionedPower: new IterationComponent(),
      cabling: new IterationComponent(),
      settings: new IterationComponent(),
      other: new IterationComponent()
    })
  };
}

/**
 * @param {string=} type | Data type
 * @param {*=} value | Default value or list of other field in case of a filed group
 *
 * @return {FieldData}
 */
function field(type, value) {
  if (!value) {
    if (!type || type === "string" || type === "text") {
      value = "";
    } else if (type.substr(-2) === "[]") {
      value = [];
    } else {
      value = null;
    }
  }
  return {
    type: type || "string",
    value: value
  };
}

/**
 * @param {Object<string, FieldData>=} fields
 * @return {{name: string, label: string, value: (Object<string, FieldData>), desc: string}}
 */
function fieldsGroup(fields) {
  return {
    type: "fieldsGroup",
    value: fields || {}
  };
}

export function cloneIteration(iteration) {
  return {
    title: iteration.title
  };
}
