/**
 * Most common display resolutions
 * Based on:
 * @link https://en.wikipedia.org/wiki/List_of_common_resolutions
 */
/**
 * @typedef {{ abr:string, w:number, h:number, ratio:string, name:string, desc:string }} Resolution
 */
export default {
  /**
   * @param {{w:number, h:number}} size
   * @param {string=} method - 'fit' or 'fill' (default 'fill')
   * @return Resolution
   */
  closestStandardForSize(size, method) {
    if (!method) method = "fill";
    let closestStd = null;
    for (let i = 0; i < this.common.length; i++) {
      /** @type Resolution */
      const std = this.common[i];
      const wDiff = size.w - std.w;
      const hDiff = size.h - std.h;
      if (
        (method === "fill" && (wDiff >= 0 && hDiff >= 0)) || // size bigger then standard
        (method === "fit" && (wDiff <= 0 && hDiff <= 0)) // size smaller then standard
      ) {
        if (!closestStd) {
          closestStd = std;
        } else if (
          wDiff <= size.w - closestStd.w ||
          wDiff <= size.h - closestStd.h
        ) {
          closestStd = std;
        }
      }
    }
    return closestStd;
  },

  common: [
    {
      abr: "QQVGA",
      w: 160,
      h: 120,
      ratio: "4∶3",
      name: "Quarter Quarter VGA",
      desc: ""
    },
    {
      abr: "HQVGA",
      w: 240,
      h: 160,
      ratio: "3∶2",
      name: "Half QVGA",
      desc: "Nintendo Game Boy Advance"
    },
    {
      abr: "CGA 320",
      w: 320,
      h: 200,
      ratio: "4∶3",
      name: "Color Graphics Adapter",
      desc:
        "CGA 4-color, Atari ST 16 color, Commodore 64 VIC-II Hires, Amiga OCS NTSC Lowres, Apple IIGS LoRes, MCGA"
    },
    {
      abr: "QVGA",
      w: 320,
      h: 240,
      ratio: "4∶3",
      name: "Quarter VGA",
      desc: "Mega Drive, Nintendo 3DS (lower screen)"
    },
    {
      abr: "WQVGA 5:3",
      w: 400,
      h: 240,
      ratio: "5∶3",
      name: "Wide QVGA",
      desc: "Common on Windows Mobile 6 handsets"
    },
    {
      abr: "WQVGA 9:5",
      w: 432,
      h: 240,
      ratio: "9∶5",
      name: "Wide QVGA",
      desc: "Apple iPod Nano 7G"
    },
    {
      abr: "WQVGA*",
      w: 480,
      h: 234,
      ratio: "16∶9",
      name: "WQVGA*",
      desc:
        'Variant used commonly for portable DVD players, digital photo frames, GPS receivers and devices such as the Kenwood DNX-5120 and Glospace SGK-70; often marketed as "16:9"'
    },
    {
      abr: "qSVGA",
      w: 400,
      h: 300,
      ratio: "4∶3",
      name: "Quarter SVGA",
      desc: "Selectable in some PC shooters"
    },
    {
      abr: "CGA 640",
      w: 640,
      h: 200,
      ratio: "4∶3",
      name: "Color Graphics Adapter",
      desc:
        "Atari ST 4 color, CGA mono, Amiga OCS NTSC Hires, Apple IIGS HiRes, Nokia Series 80 smartphones"
    },
    {
      abr: "HVGA 3:2",
      w: 480,
      h: 320,
      ratio: "3∶2",
      name: "HVGA",
      desc: "Palm Tungsten T3, Apple iPhone, HTC Dream, Palm (PDA) HiRES+"
    },
    {
      abr: "HVGA 8:3",
      w: 640,
      h: 240,
      ratio: "8:3",
      name: "HVGA",
      desc: "Handheld PC"
    },
    {
      abr: "EGA",
      w: 640,
      h: 350,
      ratio: "4∶3",
      name: "Enhanced Graphics Adapter",
      desc: ""
    },
    {
      abr: "VGA",
      w: 640,
      h: 480,
      ratio: "4∶3",
      name: "Video Graphics Array",
      desc: "MCGA (in monochome), Sun-1 color"
    },
    { abr: "WVGA", w: 768, h: 480, ratio: "8∶5", name: "Wide VGA", desc: "" },
    {
      abr: "WGA",
      w: 800,
      h: 480,
      ratio: "5∶3",
      name: "Wide VGA",
      desc: "List of mobile phones with WVGA display"
    },
    { abr: "W-PAL", w: 848, h: 480, ratio: "16∶9", name: "Wide PAL", desc: "" },
    {
      abr: "FWVGA",
      w: 854,
      h: 480,
      ratio: "16∶9",
      name: "FWVGA",
      desc: "List of mobile phones with FWVGA display"
    },
    { abr: "SVGA", w: 800, h: 600, ratio: "4∶3", name: "Super VGA", desc: "" },
    {
      abr: "qHD",
      w: 960,
      h: 540,
      ratio: "16∶9",
      name: "Quarter FHD",
      desc:
        "AACS ICT, HRHD, Motorola Atrix 4G, Sony XEL-1[7][unreliable source?]"
    },
    {
      abr: "DVGA",
      w: 960,
      h: 640,
      ratio: "3∶2",
      name: "Double VGA",
      desc:
        "Apple iPhone 4S,[9][unreliable source?][10] 4th Generation iPod Touch[11]"
    },
    {
      abr: "WSVGA",
      w: 1024,
      h: 600,
      ratio: "16∶9",
      name: "Wide SVGA",
      desc: ""
    },
    {
      abr: "XGA",
      w: 1024,
      h: 768,
      ratio: "4∶3",
      name: "Extended Graphics Array",
      desc: "Common on 14″/15″ TFTs and the Apple iPad"
    },
    {
      abr: "WXGA-H",
      w: 1280,
      h: 720,
      ratio: "16∶9",
      name: "Wide XGA",
      desc: "Minimum, 720p HDTV"
    },
    {
      abr: "WXGA 5:3",
      w: 1280,
      h: 768,
      ratio: "5∶3",
      name: "Wide XGA",
      desc: "Average, BrightView"
    },
    {
      abr: "XGA+",
      w: 1152,
      h: 864,
      ratio: "4∶3",
      name: "XGA+",
      desc: "Apple XGA[note 2]"
    },
    {
      abr: "WXGA 8:5",
      w: 1280,
      h: 800,
      ratio: "8∶5",
      name: "Wide XGA",
      desc: "Maximum"
    },
    {
      abr: "SXGA-",
      w: 1280,
      h: 960,
      ratio: "4∶3",
      name: 'Super XGA "Minus"',
      desc: ""
    },
    {
      abr: "WSXGA",
      w: 1440,
      h: 900,
      ratio: "8∶5",
      name: "Wide SXGA",
      desc: ""
    },
    {
      abr: "WXGA+",
      w: 1440,
      h: 900,
      ratio: "8∶5",
      name: "Wide XGA+",
      desc: ""
    },
    {
      abr: "SXGA",
      w: 1280,
      h: 1024,
      ratio: "5∶4",
      name: "Super XGA",
      desc: ""
    },
    { abr: "HD+", w: 1600, h: 900, ratio: "16∶9", name: "HD+", desc: "900p" },
    {
      abr: "SXGA+",
      w: 1400,
      h: 1050,
      ratio: "4∶3",
      name: "Super XGA Plus",
      desc: ""
    },
    {
      abr: "WSXGA+",
      w: 1680,
      h: 1050,
      ratio: "8∶5",
      name: "Wide SXGA+",
      desc: ""
    },
    {
      abr: "UXGA",
      w: 1600,
      h: 1200,
      ratio: "4∶3",
      name: "Ultra XGA",
      desc: ""
    },
    {
      abr: "FHD",
      w: 1920,
      h: 1080,
      ratio: "16∶9",
      name: "Full HD",
      desc: "1080 HDTV (1080i, 1080p)"
    },
    {
      abr: "DCI 2K",
      w: 2048,
      h: 1080,
      ratio: "1.90∶1",
      name: "DCI 2K",
      desc: ""
    },
    {
      abr: "WUXGA",
      w: 1920,
      h: 1200,
      ratio: "8∶5",
      name: "Wide UXGA",
      desc: ""
    },
    { abr: "QWXGA", w: 2048, h: 1152, ratio: "16∶9", name: "QWXGA", desc: "" },
    {
      abr: "FHD+",
      w: 1920,
      h: 1280,
      ratio: "3∶2",
      name: "Full HD Plus",
      desc: "Microsoft Surface 3"
    },
    {
      abr: "CWSXGA",
      w: 2880,
      h: 900,
      ratio: "16:5",
      name: "CWSXGA",
      desc: "NEC CRV43,[12] Ostendo CRVD,[13] Alienware Curved Display[14][15]"
    },
    {
      abr: "TXGA",
      w: 1920,
      h: 1400,
      ratio: "7∶5",
      name: "Tesselar XGA",
      desc: ""
    },
    {
      abr: "QXGA",
      w: 2048,
      h: 1536,
      ratio: "4∶3",
      name: "Quad XGA",
      desc: "iPad (3rd Generation)"
    },
    {
      abr: "QHD",
      w: 2560,
      h: 1440,
      ratio: "16∶9",
      name: "Quad HD",
      desc: "Dell UltraSharp U2711, Dell XPS One 27, Apple iMac"
    },
    {
      abr: "WQXGA",
      w: 2560,
      h: 1600,
      ratio: "8∶5",
      name: "Wide QXGA",
      desc:
        "Apple Cinema HD 30, Dell Ultrasharp U3011, Dell 3007WFP, Dell 3008WFP, Gateway XHD3000, Samsung 305T, HP LP3065, HP ZR30W, Nexus 10"
    },
    {
      abr: "Infinity Display",
      w: 2960,
      h: 1440,
      ratio: "2.056",
      name: "Infinity Display",
      desc: "Samsung Galaxy S8, Samsung Galaxy S8+, Samsung Galaxy Note 8"
    },
    {
      abr: "Ultra-Wide QHD",
      w: 3440,
      h: 1440,
      ratio: "21∶9",
      name: "Ultra-Wide QHD",
      desc: "LG and Dell UltraWide monitors"
    },
    {
      abr: "QSXGA",
      w: 2560,
      h: 2048,
      ratio: "5∶4",
      name: "Quad SXGA",
      desc: ""
    },
    {
      abr: "WQXGA+",
      w: 3200,
      h: 1800,
      ratio: "16∶9",
      name: "Wide QXGA+",
      desc: "HP Envy TouchSmart 14, Fujitsu Lifebook UH90/L, Lenovo Yoga 2 Pro"
    },
    {
      abr: "QSXGA+",
      w: 2800,
      h: 2100,
      ratio: "4∶3",
      name: "Quad SXGA+",
      desc: ""
    },
    {
      abr: "UW4K",
      w: 3840,
      h: 1600,
      ratio: "2.35∶1",
      name: "Ultra-Wide 4K",
      desc: ""
    },
    {
      abr: "WQSXGA",
      w: 3200,
      h: 2048,
      ratio: "25∶16",
      name: "Wide QSXGA",
      desc: ""
    },
    {
      abr: "QUXGA",
      w: 3200,
      h: 2400,
      ratio: "4∶3",
      name: "Quad UXGA",
      desc: ""
    },
    {
      abr: "4K UHD-1",
      w: 3840,
      h: 2160,
      ratio: "16∶9",
      name: "4K Ultra HD 1",
      desc: "2160p, 4000-lines UHDTV (4K UHD)"
    },
    {
      abr: "DCI 4K",
      w: 4096,
      h: 2160,
      ratio: "1.90∶1",
      name: "DCI 4K",
      desc: ""
    },
    {
      abr: "WQUXGA",
      w: 3840,
      h: 2400,
      ratio: "8∶5",
      name: "Wide QUXGA",
      desc: "IBM T221"
    },
    {
      abr: "UW5K",
      w: 5120,
      h: 2160,
      ratio: "21∶9",
      name: "Ultra-Wide 5K",
      desc: "21:9 aspect ratio TVs"
    },
    { abr: "HXGA", w: 4096, h: 3072, ratio: "4∶3", name: "Hex XGA", desc: "" },
    {
      abr: "5K",
      w: 5120,
      h: 2880,
      ratio: "16∶9",
      name: "5K",
      desc: 'Dell UP2715K, Apple 27" iMac 5K Retina Display'
    },
    {
      abr: "WHXGA",
      w: 5120,
      h: 3200,
      ratio: "8∶5",
      name: "Wide HXGA",
      desc: ""
    },
    {
      abr: "HSXGA",
      w: 5120,
      h: 4096,
      ratio: "5∶4",
      name: "Hex SXGA",
      desc: ""
    },
    {
      abr: "WHSXGA",
      w: 6400,
      h: 4096,
      ratio: "25∶16",
      name: "Wide HSXGA",
      desc: ""
    },
    {
      abr: "HUXGA",
      w: 6400,
      h: 4800,
      ratio: "4∶3",
      name: "Hex UXGA",
      desc: ""
    },
    {
      abr: "8K UHD-2",
      w: 7680,
      h: 4320,
      ratio: "16∶9",
      name: "8K Ultra HD 2",
      desc: "4320p, 8000-lines UHDTV (8K UHD)"
    },
    {
      abr: "WHUXGA",
      w: 7680,
      h: 4800,
      ratio: "8∶5",
      name: "Wide HUXGA",
      desc: ""
    },
    {
      abr: "UW10K",
      w: 10240,
      h: 4320,
      ratio: "21∶9",
      name: "Ultra-Wide 10K",
      desc: ""
    }
  ]
};
