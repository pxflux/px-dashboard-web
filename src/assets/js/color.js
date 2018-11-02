/**
 * mxm 28/10/2016.
 */

/**
 * @param {number|{h:number,s:number,l:number}|null=}  h  0->360° | r 0-1 | Object with fields: h,s,l
 * @param {number=}  s  0->100% | g 0-1
 * @param {number=}  l  0->100% | b 0-1
 * @param {boolean=} isRGB
 * @constructor
 */
function Color(h, s, l, isRGB) {
  if (isRGB) {
    this.fromRGB(h, s, l, true);
  } else if (typeof h === "undefined") {
    this.random();
  } else {
    if (typeof h === "object" && h !== null) {
      l = h.l;
      s = h.s;
      h = h.h;
    } else if (h === null) {
      h = Math.random() * 360;
      if (!s) {
        s = Math.random() * 100;
      }
      if (!l) {
        l = Math.random() * 100;
      }
    } else if (typeof s === "undefined") {
      l = h;
      s = 0;
      h = 0;
    }
    this.raw = [h, s, l];
    this.h = this.normalize(h, 360);
    this.s = this.normalizeClamp(s, 100);
    this.l = this.normalizeClamp(l, 100);

    this.rgb = this.toRGB();
  }
  this.a = 1;
}

Color.prototype = {
  normalize: function(n, max) {
    // Handle floating point rounding errors
    if (Math.abs(n - max) < 0.000001) {
      return 1;
    }
    return (n % max) / parseFloat(max);
  },
  setAlpha: function(a) {
    this.a = a;
    return this;
  },
  clamp: function(n, max) {
    return Math.min(max, Math.max(0, n));
  },
  normalizeClamp: function(n, max) {
    return this.normalize(this.clamp(n, max), max);
  },
  copy: function() {
    return new Color(this.raw[0], this.raw[1], this.raw[2]);
  },
  getBrightness: function() {
    // http://www.w3.org/TR/AERT#color-contrast
    const rgb = this.toRGB();
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  },
  getLuminance: function() {
    // http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
    const rgb = this.rgb;
    let RsRGB, GsRGB, BsRGB, R, G, B;
    RsRGB = rgb.r;
    GsRGB = rgb.g;
    BsRGB = rgb.b;

    if (RsRGB <= 0.03928) {
      R = RsRGB / 12.92;
    } else {
      R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    }
    if (GsRGB <= 0.03928) {
      G = GsRGB / 12.92;
    } else {
      G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    }
    if (BsRGB <= 0.03928) {
      B = BsRGB / 12.92;
    } else {
      B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  },
  random: function() {
    this.raw = [Math.random() * 360, Math.random() * 100, Math.random() * 100];
    this.h = this.normalize(this.raw[0], 360);
    this.s = this.normalizeClamp(this.raw[1], 100);
    this.l = this.normalizeClamp(this.raw[2], 100);
    this.rgb = this.toRGB();
  },
  randomHue: function(s, l) {
    if (!s) {
      s = 100;
    }
    if (!l) {
      l = 50;
    }
    this.raw = [Math.random() * 360, s, l];
    this.h = this.normalize(this.raw[0], 360);
    this.s = this.normalizeClamp(this.raw[1], 100);
    this.l = this.normalizeClamp(this.raw[2], 100);
    this.rgb = this.toRGB();
  },
  randomize: function() {
    this.h = this.clamp(
      this.h + (Math.random() / 60) * (Math.random() > 0.5 ? 1 : -1),
      1
    );
    this.s = this.clamp(
      this.s + (Math.random() / 60) * (Math.random() > 0.5 ? 1 : -1),
      1
    );
    this.rgb = this.toRGB();
  },
  toRGBString: function(lightnessFact) {
    if (typeof lightnessFact === "undefined") {
      lightnessFact = 1;
    }
    var r = Math.round(this.rgb.r * 255 * lightnessFact);
    var g = Math.round(this.rgb.g * 255 * lightnessFact);
    var b = Math.round(this.rgb.b * 255 * lightnessFact);
    return "rgb(" + r + "," + g + "," + b + ")";
  },
  toRGBAString: function(/** number= */ a) {
    if (typeof a === "undefined") {
      a = this.a;
    }
    if (a > 1) {
      a = this.normalize(a, 255);
    }
    var r = Math.round(this.rgb.r * 255);
    var g = Math.round(this.rgb.g * 255);
    var b = Math.round(this.rgb.b * 255);
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  },
  adjustWithFactor: function(h, s, l) {
    this.h = this.clamp(this.h - (h || 0), 1);
    this.s = this.clamp(this.s * (s || 1), 1);
    this.l = this.clamp(this.l - (l || 0), 1);
    // this.l += (Math.random()/200 * ((Math.random()>0.5)? 1 : -1));
    this.rgb = this.toRGB();
  },
  toHSLStringWithOffset: function(
    /** number= */ hOffset,
    /** number= */ sOffset,
    /** number= */ lOffset
  ) {
    if (typeof hOffset === "undefined") {
      hOffset = 0;
    }
    if (typeof sOffset === "undefined") {
      sOffset = 0;
    }
    if (typeof lOffset === "undefined") {
      lOffset = 0;
    }
    return (
      "hsl(" +
      ((this.h * 360 + hOffset) % 360) +
      "," +
      this.clamp(this.s * 100 + sOffset, 100) +
      "%," +
      this.clamp(this.l * 100 + lOffset, 100) +
      "%)"
    );
  },
  toOppositeHSLAString: function(/** number= */ a) {
    if (typeof a === "undefined") {
      a = this.a;
    }
    return (
      "hsla(" +
      ((this.h * 360 + 180) % 360) +
      "," +
      this.s * 100 +
      "%," +
      this.l * 100 +
      "%," +
      a +
      ")"
    );
  },
  /**
   * @param {number=} hOffset
   * @param {number=} sOffset
   * @param {number=} lOffset
   */
  offset: function(hOffset, sOffset, lOffset) {
    let h = this.raw[0];
    let s = this.raw[1];
    let l = this.raw[2];
    if (typeof hOffset !== "undefined") {
      h = (h + hOffset) % 360;
    }
    if (typeof sOffset !== "undefined") {
      s = this.clamp(s + sOffset, 100);
    }
    if (typeof lOffset !== "undefined") {
      l = this.clamp(l + lOffset, 100);
    }
    if (hOffset || sOffset || lOffset) {
      return new Color(h, s, l);
    } else {
      return this;
    }
  }
};
/**
 * toRgb
 * Converts an HSL to RGB.
 * @param {boolean=} to255
 * @returns {{r: number, g: number, b: number}} in the range [0, 255] if to255 is true, otherwise in [0, 1] range
 */
Color.prototype.toRGB = function(to255) {
  var r, g, b;
  var h = this.h;
  var s = this.s;
  var l = this.l;

  function hue2rgb(p, q, t) {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
      return q;
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
  }

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  if (to255) {
    return { r: r * 255, g: g * 255, b: b * 255 };
  }
  return { r: r, g: g, b: b };
};
/**
 * fromRGB
 * Converts an RGB color value to HSL
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {boolean=} from255 must be TRUE if the values shall be treated as being in the range [0-255]
 * @returns {{h: *, s: *, l: number}}
 */
Color.prototype.fromRGB = function(r, g, b, from255) {
  if (r > 1 || from255) {
    r = this.normalizeClamp(r, 255);
  }
  if (g > 1 || from255) {
    g = this.normalizeClamp(g, 255);
  }
  if (b > 1 || from255) {
    b = this.normalizeClamp(b, 255);
  }

  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h;
  var s;
  var l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  this.rgb = { r: r, g: g, b: b };
  this.h = h;
  this.s = s;
  this.l = l;
  this.raw = [h * 360, s * 100, l * 100];
};

// Combination Functions
// ---------------------
// Thanks to jQuery xColor for some of the ideas behind these
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

/**
 * @return {Color}
 */
Color.prototype.complement = function() {
  const newColor = this.copy();
  newColor.raw[0] = (newColor.h + 180) % 360;
  newColor.h = newColor.normalize(newColor.raw[0], 360);
  newColor.rgb = newColor.toRGB();
  return newColor;
};
/**
 * @return {[Color,Color,Color]}
 */
Color.prototype.triad = function() {
  const h = this.raw[0];
  return [
    this,
    new Color({ h: (h + 120) % 360, s: this.raw[1], l: this.raw[2] }),
    new Color({ h: (h + 240) % 360, s: this.raw[1], l: this.raw[2] })
  ];
};
/**
 * @return {[Color,Color,Color,Color]}
 */
Color.prototype.tetrad = function() {
  const h = this.raw[0];
  return [
    this,
    new Color({ h: (h + 90) % 360, s: this.raw[1], l: this.raw[2] }),
    new Color({ h: (h + 180) % 360, s: this.raw[1], l: this.raw[2] }),
    new Color({ h: (h + 270) % 360, s: this.raw[1], l: this.raw[2] })
  ];
};
/**
 * @return {[Color,Color,Color]}
 */
Color.prototype.splitComplement = function() {
  var h = this.raw[0];
  return [
    this,
    new Color({ h: (h + 72) % 360, s: this.raw[1], l: this.raw[2] }),
    new Color({ h: (h + 144) % 360, s: this.raw[1], l: this.raw[2] })
  ];
};

export default Color;
