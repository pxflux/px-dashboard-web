export default class VimeoApi {
  constructor(token) {
    this.token = token;
  }

  getVideo(id) {
    return fetch(`https://api.vimeo.com/videos/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).then(response => {
      return response.json();
    });
  }
}
