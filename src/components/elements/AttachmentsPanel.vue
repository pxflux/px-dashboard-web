<template>
  <div class="attachments" id="AAA">
    <div class="display">
      <video-player v-if="video"
                    :video-url="video.storage.displayUrl"
                    :ratio="video.ratio"
                    :fill-parent="true"/>
      <div v-for="(thumbnail, i) in images" :key="i" :data-ratio="thumbnail.ratio">
        <img v-show="thumbnail.displayUrl" :src="thumbnail.displayUrl">
      </div>
      <!--<div v-if="!images.length" class="attachment placeholder"></div>-->
    </div>
    <div class="toolbar">
      <div class="controls">
        <div class="video-player">
          <div class="button play">
            <div class="icon play"></div>
          </div>
          <div class="button sound">
            <div class="icon">
              sound
            </div>
          </div>
        </div>
        <div class="caption">
          Here is the caption for the above photograph or video
        </div>
      </div>
      <a href="#" class="button">
        <div class="icon arrow-left"></div>
      </a>
      <a class="button">
        <div class="icon arrow-right"></div>
      </a>
    </div>
  </div>
</template>

<script>
import VideoPlayer from "../VideoPlayer";

export default {
  components: {
    "video-player": VideoPlayer
  },
  props: ["video", "images"]
};
</script>
