<template>
  <div class="panel" :class="code" ref="panel">
    <div class="button frameless">
      <div class="icon minus" @click="remove()"></div>
    </div>
    <div class="button frameless">
      <div class="icon plus" @click="append()"></div>
    </div>
    <div class="connectors">
      <header>{{title}}</header>
      <div class="sockets">
        <span v-for="i in data.length" :key="i" class="socket" :class="code" ref="sockets"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "output-control-panel",
  props: ["code", "title", "data"],

  data() {
    return {
      numSockets: this.data ? this.data.length : 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      // just to let sockets to be updated first
      this.$emit("update");
    });
  },
  methods: {
    append() {
      if (this.numSockets < 18) {
        this.numSockets += 1;
        this.$emit("append", this.code);
      }
    },
    remove() {
      if (this.numSockets > 0) {
        this.numSockets -= 1;
        this.$emit("remove", this.code);
      }
    },
    collectBounds() {
      const bounds = [];
      if (this.$refs.sockets) {
        const panelBounds = this.$refs.panel.getBoundingClientRect();
        this.$refs.sockets.forEach(el => {
          const socketBounds = el.getBoundingClientRect();
          bounds.push({
            type: "socket",
            objectBounds: {
              left: socketBounds.left,
              top: socketBounds.top,
              right: socketBounds.right,
              bottom: panelBounds.bottom,
              x: socketBounds.x,
              y: socketBounds.y,
              width: socketBounds.width,
              height: panelBounds.bottom - socketBounds.top
            }
          });
        });
      }
      return bounds;
    }
  },

  watch: {
    data(newValue) {
      this.numSockets = newValue ? newValue.length : 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/sass/vars";
@import "../../../assets/sass/mixins";
@import "../../../assets/sass/hidpi";
@import "../../../assets/sass/components/hairline";

.panel {
  width: 50%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  position: relative;
  background: $bg-color;
  @include hairline-border(
    $positionRelative: true,
    $side: all,
    $color: #808080,
    $bg-color: $dark-bg
  );

  &.video {
    flex-flow: row-reverse nowrap;
  }
  .button {
    background: transparent;
    .icon:before,
    .icon:after {
      border-color: darken($font-color-on-dark, 30%);
    }
  }
  header {
    min-height: auto;
    height: auto;
    font-size: $font-size-caption;
    text-align: center;
    margin-bottom: 2px;
  }
  .connectors {
    flex-grow: 1;
    width: 2.5 * $module-size;
    padding: 0 12px;

    .sockets {
      display: flex;
      flex-flow: wrap;
      justify-content: center;
      align-items: center;

      .socket {
        display: block;
        width: 6px;
        height: 6px;
        margin: 2px;
        border-radius: 50%;
        background: #ccc;
        &.audio {
          background: $audio-color;
        }
        &.video {
          background: $video-color;
        }
      }
    }
  }
}
</style>
