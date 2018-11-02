<template>
  <div v-if="videoId" class="video-box" ref="videoBox">
    <vimeo-player ref="player" class="vimeo-player"
                  :video-id='videoId'
                  :options="{background:true, autoplay:false, byline:false, portrait:false, title:false, fullscreen:false}"
                  @pause="setPaused(true)"
                  @play="setPaused(false)"
                  @loaded="onLoad"/>
    <div class="overlay" @click="togglePlay">
      <div class="button frameless" :class="{play: paused, pause: !paused}" @click="togglePlay">
        <i :class="{play: paused, pause: !paused}"></i>
      </div>
    </div>
  </div>
  <div v-else>Video ID is not valid.</div>
</template>

<script>
import { vueVimeoPlayer } from "vue-vimeo-player";

export default {
  props: ["videoUrl", "ratio", "fillParent"],
  components: {
    "vimeo-player": vueVimeoPlayer
  },
  data() {
    return {
      fillVideoBox: this.fillParent, // TODO: this could be a property set by user in the artwork editor
      paused: true,
      videoBoxEl: null
    };
  },
  computed: {
    videoId() {
      if (Number.isInteger(this.videoUrl)) {
        return this.videoUrl;
      }
      const match = this.videoUrl.match(/https:\/\/vimeo.com\/(\d+)(?=\b|\/)/);
      return match ? match[1] : null;
    },
    playerId() {
      return "vp" + this.videoId;
    }
  },

  mounted() {
    this.videoBoxEl = this.$refs["videoBox"];
    window.addEventListener("resize", this.fitToParent);
  },

  methods: {
    fitToParent() {
      if (!this.fillVideoBox) return; // let css manage it w:100% h:100%

      const iframe = this.videoBoxEl.querySelector("iframe");
      if (!iframe) return;
      const parentRect = this.videoBoxEl.getBoundingClientRect();
      const parentRatio = parentRect.width / parentRect.height;

      let w, h;
      if (this.ratio < parentRatio) {
        // iframe is narrower then parent.. fit width
        w = parentRect.width;
        h = w / this.ratio;
      } else {
        // fit height
        h = parentRect.height;
        w = h * this.ratio;
      }
      iframe.style.width = Math.ceil(w) + "px";
      iframe.style.height = Math.ceil(h) + "px";
    },

    setPaused(paused) {
      this.paused = paused;
    },

    onLoad() {
      const player = this.$refs.player;
      if (!player) return;
      player.unmute();

      this.fitToParent();
    },
    togglePlay() {
      if (this.paused) {
        this.play();
      } else {
        this.stop();
      }
    },
    play() {
      this.$refs.player.play();
    },
    stop() {
      this.$refs.player.pause();
    }
  }
};
</script>
