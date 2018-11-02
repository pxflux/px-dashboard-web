export const Attachment = {
  displayUrl: "",
  storageUri: "",
  type: "", // image|video|file|...
  ratio: 1
};

export const Video = {
  ...Attachment,
  ...{
    type: "video",
    thumbnail: Attachment,
    duration: 0
  }
};
