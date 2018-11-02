import axios from "axios";

/**
 * @typedef {
 *  {
 *    is_plus: string,
 *    url: string,
 *    width: number,
 *    height: number,
 *    duration: number,
 *    author_name: string,
 *    author_url: string,
 *    description: string,
 *    vimeo_id: number,
 *    thumbnail: { url: string, width: number, height: number },
 *    error: string,
 *    warning: string
 *  }
 * } VimeoVideoInfo
 */

export default {
  /**
   * @param {?string} url
   * @return {boolean}
   */
  isVimeoVideoUrl(url) {
    if (!url || !(typeof url === "string" || url instanceof String)) {
      return false;
    }
    return url.match(/https:\/\/vimeo.com\/(\d+)(?=\b|\/)/);
  },
  /**
   * @param {?string} url
   * @return {?number}
   */
  getVimeoId(url) {
    const match = url.match(/https:\/\/vimeo.com\/(\d+)(?=\b|\/)/);
    return match ? match[1] : null;
  },
  /**
   * @param {string} url
   * @return {Promise<VimeoVideoInfo>}
   */
  getVimeoVideoInfo(url) {
    const embedUrl =
      "https://vimeo.com/api/oembed.json?url=" +
      encodeURIComponent(url) +
      "&maxwidth=90000";
    return axios
      .get(embedUrl)
      .catch(function(error) {
        if (error.response) {
          throw new Error(error.response.data);
        } else if (error.request) {
          throw new Error("network/request-failed");
        }
        throw new Error("network/invalid-request");
      })
      .then(response => {
        /**
         * @type {{
         *   account_type: string
         *   author_name: string
         *   author_url: string
         *   description: string
         *   duration: number
         *   height: number
         *   html: string
         *   is_plus: string
         *   thumbnail_height: number
         *   thumbnail_url: string
         *   thumbnail_url_with_play_button: string
         *   thumbnail_width: number
         *   video_id: number
         *   width: number
         * }}
         */
        const data = response.data;
        return {
          is_plus: data.is_plus,
          url: url,
          width: data.width,
          height: data.height,
          duration: data.duration,
          author_name: data.author_name,
          author_url: data.author_url,
          description: data.description,
          vimeo_id: data.video_id,
          thumbnail: {
            url: data.thumbnail_url,
            width: data.thumbnail_width,
            height: data.thumbnail_height
          }
        };
      });
  }
};
