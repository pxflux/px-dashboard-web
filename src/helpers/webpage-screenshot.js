/* eslint-disable no-proto */
/**
 * maxim tyminko 28.03.18.
 * maximtyminko.com
 */
(function(exports) {
  function urlsToAbsolute(nodeList) {
    if (!nodeList.length) {
      return [];
    }
    let attrName = "href";
    if (
      nodeList[0].__proto__ === HTMLImageElement.prototype ||
      nodeList[0].__proto__ === HTMLScriptElement.prototype
    ) {
      attrName = "src";
    }
    nodeList = [].map.call(nodeList, function(el) {
      const attr = el.getAttribute(attrName);
      if (!attr) {
        return;
      }
      const absURL = /^(https?|data):/i.test(attr);
      if (absURL) {
        return el;
      } else {
        return el;
      }
    });
    return nodeList;
  }

  function screenshotPage() {
    urlsToAbsolute(document.images);
    urlsToAbsolute(document.querySelectorAll("link[rel='stylesheet']"));
    const screenshot = document.documentElement.cloneNode(true);
    const b = document.createElement("base");
    b.href = document.location.protocol + "//" + location.host;
    const head = screenshot.querySelector("head");
    head.insertBefore(b, head.firstChild);
    screenshot.style.pointerEvents = "none";
    screenshot.style.overflow = "hidden";
    screenshot.style.webkitUserSelect = "none";
    screenshot.style.mozUserSelect = "none";
    screenshot.style.msUserSelect = "none";
    screenshot.style.oUserSelect = "none";
    screenshot.style.userSelect = "none";
    screenshot.dataset.scrollX = window.scrollX;
    screenshot.dataset.scrollY = window.scrollY;
    const script = document.createElement("script");
    script.textContent = "(" + addOnPageLoad_.toString() + ")();";
    screenshot.querySelector("body").appendChild(script);
    return new Blob([screenshot.outerHTML], {
      type: "text/html"
    });
  }

  function addOnPageLoad_() {
    window.addEventListener("DOMContentLoaded", function() {
      const scrollX = document.documentElement.dataset.scrollX || 0;
      const scrollY = document.documentElement.dataset.scrollY || 0;
      window.scrollTo(scrollX, scrollY);
    });
  }

  function generate() {
    window.URL = window.URL || window.webkitURL;
    window.open(window.URL.createObjectURL(screenshotPage()));
  }

  exports.screenshotPage = screenshotPage;
  exports.generate = generate;
})(window);
