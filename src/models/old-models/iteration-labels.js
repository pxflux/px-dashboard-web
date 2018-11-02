/**
 * Labels are based on Iteration Report by Guggenheim Conservation Department
 * @link https://www.guggenheim.org/wp-content/uploads/2015/11/guggenheim-conservation-iteration-report-2012.pdf
 */
export default {
  labels: {
    id: "ID",
    name: "Iteration Name",
    thumbUrl: "Thumbnail URL",
    date: "Created",
    exhibitions: "Exhibitions",
    contributors: "Contributors",
    supervisedBy: [
      "Supervised By",
      "Who had an impact on the appearance of this iteration?"
    ],

    installation: {
      label: "Installation Notes",
      installedBy: [
        "Who installed the artwork, for how long?",
        "List names, and/or skill-sets, and add the hours/days per person."
      ],
      withArtist: [
        "Was the artist present/represented during the (entire) install?",
        "boolean"
      ],
      artistInfluence:
        "If not, how (closely) did the artist monitor/influence this iteration?"
    },
    documentation: {
      label: "Documentation",
      images: "Images, as installed",
      video: "Video",
      technicalDrawings: "Technical Drawings",
      notes: "Notes",
      artistInterview: "Artist Interview",
      assistantInterview: "Artist Assistant Interview",
      other: "Other"
    },
    evaluation: {
      label: "Evaluation",
      notes:
        "Was the iteration considered to be successful, or less successful? Why? (Source, Date)",
      approvedByArtist: "Did the artist(s) see and/or approve this iteration?",
      warnings:
        "Were there any unsolved problems or suggestions for future improvements? (Source, Date)"
    },
    comments: "Comments",
    publications: "Publications",
    space: {
      label: "Space, as installed",
      context: [
        "Installation context",
        "Space dedicated, or shared with other works?"
      ],
      floorPlan: "Floor plan",
      dimensions: "Dimensions",
      fakeWalls: "Fake walls included",
      ceilingHeight: "Ceiling height",
      ceiling: ["Ceiling color", "Color, paint [brand, product] etc."],
      wall: ["Wall surface", "Color, wallpaper, paint [brand, product] etc."],
      floor: ["Flooring", "Native gallery floor, carpet [brand, product] etc."],
      acoustic: [
        "Sound level and insulation",
        "Sound abatement, sound panels [brand, product] etc."
      ],
      lighting: [
        "Light conditions",
        "Light level, quality and direction; light insulation, curtains [brand, product] etc."
      ],
      entranceExit: "Entrance/exit",
      visitorFlow: "Visitor flow",
      displayPosition:
        "Position and mounting of display equipment (incl. speakers)",
      playerPosition: "Position and mounting of playback equipment",
      projectionDistances: "Projection distances",
      screens: ["Screens", "Size, material [brand, product]"],
      imageSize: "Size of image",
      imagePlacement: "Placement of image, elevations",
      projectionSurface: [
        "Preparation of projection surface",
        "reflective paint [brand, product]"
      ]
    },
    exhibitionCopies: "" /* we probably don't need this */,
    equipment: {
      label: "Equipment, as installed",
      visual: "Monitors/Projectors",
      audio: "Audio EquipmentList",
      playback: "Playback EquipmentList",
      other: "Other"
    },
    otherComponents: [
      "Other Installation Components, as installed",
      "incl. sculptural components, stands, benches, pedestals etc."
    ],
    technicalSetup: {
      label: "Technical Set-up",
      looped: "Looped",
      timed: "Timed",
      synched: "Synched",
      controlled: "Controlled",
      amperageInSpaceAtEquipment: "Amperage in space/at equipment",
      conditionedPower: "Conditioned power",
      cabling: "Cabling",
      settings: "Settings",
      other: "Other"
    }
  },

  /**
   * Searches for a label in this.labels
   * If not found, creates a label from the fieldPath.
   *
   * @param {string} fieldPath .. like: 'parentFieldName/fieldName' or 'fieldName'
   * @return {string}
   */
  labelForField: function(fieldPath) {
    const labels = this.labelsForField(fieldPath);
    if (labels) {
      if (typeof labels === "string") return labels;
      if (Array.isArray(labels) && typeof labels[0] === "string")
        return labels[0];
    } else if (typeof fieldPath === "string") {
      const name = labels.split("/").pop();
      return this.camelCaseToWords(name);
    }
  },

  /**
   * Searches for a description string in this.labels
   * @param fieldPath
   * @return {string}
   */
  descriptionForField: function(fieldPath) {
    const labels = this.labelsForField(fieldPath);
    if (typeof labels === "string") return "";
    if (Array.isArray(labels) && typeof labels[1] === "string")
      return labels[1];
    return "";
  },

  /**
   * @param {string} fieldPath .. Could be like this: 'parentFieldName/childFieldName'
   * @param {object=} parentObj
   * @return {*}
   */
  labelsForField: function(fieldPath, parentObj) {
    if (!parentObj) parentObj = this.labels;
    const pathParts = fieldPath.split("/");
    const fieldName = pathParts.shift();
    if (!parentObj.hasOwnProperty(fieldName)) return "";
    const fieldValue = parentObj[fieldName];

    if (!pathParts.length) return fieldValue;
    if (typeof fieldValue !== "object" || Array.isArray(fieldValue)) return "";
    return this.labelsForField(pathParts.join("/"), fieldValue);
  },

  /**
   * @param {string} str
   * @return {string}
   */
  camelCaseToWords: function(str) {
    return str.replace(/([A-Z])/g, " $1").replace(/^./, function(str) {
      return str.toUpperCase();
    });
  }
};
