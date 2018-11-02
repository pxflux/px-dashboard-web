<template>
  <div>
    <div class="row output-bar-holder video">
      <label>
        <span>Video</span>
      </label>
      <div class="output-bar video">
        <popper v-for="(output, i) in value" :key="i" trigger="click" :options="{placement: 'bottom-start'}"
                ref="popups">
          <div class="popper">
            <video-options :bus="bus" :index="i" :value="output"/>
            <div class="button frameless cancel narrow" @click="closeOptions(i)">
              <span class="icon cancel small"></span>
            </div>
          </div>

          <div class="output-box video" :class="output.type" ref="boxes" slot="reference">
            <div class="description">
              <span class="name">{{i}}</span>
              <span class="type">{{output.type}}</span>
              <span class="description">Any resolution</span>
            </div>
            <div class="icon drop-down small"></div>
          </div>
        </popper>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Popper from "vue-popperjs";
import VideoOptions from "./OutputVideoOptions";
import { AWVideoOutputs } from "../../../models/AWVideoOutput";

export default {
  name: "video-output-representation-bar",
  components: {
    Popper,
    VideoOptions
  },
  props: ["value"],

  data() {
    return {
      bus: new Vue()
    };
  },
  mounted() {
    this.bus.$on("updateOutputOptions", (options, index) => {
      this.closeOptions(index);
      const values = AWVideoOutputs.fromJson(
        JSON.parse(JSON.stringify(this.value))
      );
      values[index] = options;
      this.$emit("input", values);
    });
  },
  methods: {
    closeOptions(index) {
      this.$refs.popups[index].doClose();
    },
    collectBounds() {
      const bounds = [];
      if (this.$refs.boxes) {
        this.$refs.boxes.forEach(el => {
          bounds.push({
            type: "projection",
            objectBounds: el.getBoundingClientRect()
          });
        });
      }
      return bounds;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/sass/vars";
@import "../../../assets/sass/mixins";
@import "../../../assets/sass/hidpi";
@import "../../../assets/sass/components/hairline";
@import "../../../assets/sass/components/buttons";

$audio-bar-height: $module-size * 2;
$video-box-height: $module-size * 2;

.output-bar-holder {
  position: relative;
  margin-top: $module-size;
  /*display: flex;*/
  /*flex-flow: column nowrap;*/
}

.drawer {
  height: 5 * $module-size;
  background: greenyellow;
  width: 100%;
}

.output-bar {
  position: relative;
  display: flex;
  align-items: flex-end;

  min-height: $module-size;

  .output-box {
    flex-shrink: 0;
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-right: $module-size / 8;

    width: $module-size * 2;
    height: $module-size;
    padding: 0;

    @include hairline-border(
      $positionRelative: true,
      $side: all,
      $color: #808080,
      $bg-color: $dark-bg
    );

    &.audio {
      background: $bg-secondary-color;
    }
    .icon {
      position: absolute;
      top: 0;
      right: 0;
      width: $module-size/2;
      height: $module-size/2;
      @include button-icon(drop-down);
      &:before {
        border-color: #c7c7c7;
      }
    }
    .description {
      text-align: center;
      flex-grow: 1;
      span {
        display: block;
        &:last-child,
        &.type {
          font-size: $font-size-caption / 1.2;
        }
      }
    }
  }
  .output-box.video {
    $screen-width: $module-size * 2 * (16/9);

    background: #fff;
    height: $module-size * 2;
    width: $screen-width;
    position: relative;

    &.projection {
      margin-top: $module-size/4;
    }
  }
}
</style>
