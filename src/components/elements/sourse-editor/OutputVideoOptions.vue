<template>
  <div class="video-options-box">
    <header>Screen {{index}}</header>
    <div class="option">
      <div class="select-wrap">
        <v-select :options="types" :value="options.type" @input="setType($event)"/>
      </div>
      <div class="resolution-header">
        <label>Min</label>
        <label>Optimal</label>
        <label>Max</label>
      </div>
      <div class="resolution-row width">
        <input type="number" min="0" :value="options.resolution.min.w"
               @input="setValue(options.resolution.min.w, $event)"
               :class="[options.resolution.min.w > 0 ? 'active': '']"/>
        <input type="number" min="0" :value="options.resolution.optimal.w"
               @input="setValue(options.resolution.optimal.w, $event)"
               :class="[options.resolution.optimal.w > 0 ? 'active': '']"/>
        <input type="number" min="0" :value="options.resolution.max.w"
               @input="setValue(options.resolution.max.w, $event)"
               :class="[options.resolution.max.w > 0 ? 'active': '']"/>
      </div>
      <div class="resolution-row height">
        <input type="number" min="0" :value="options.resolution.min.h"
               @input="setValue(options.resolution.min.h, $event)"
               :class="[options.resolution.min.h > 0 ? 'active': '']"/>
        <input type="number" min="0" :value="options.resolution.optimal.h"
               @input="setValue(options.resolution.optimal.h, $event)"
               :class="[options.resolution.optimal.h > 0 ? 'active': '']"/>
        <input type="number" min="0" :value="options.resolution.max.h"
               @input="setValue(options.resolution.max.h, $event)"
               :class="[options.resolution.max.h > 0 ? 'active': '']"/>
      </div>
    </div>
    <footer>
      <div class="button frameless" @click="submit">
        <span>OK</span>
      </div>
    </footer>
  </div>
</template>

<script>
import Vue from "vue";
import VSelect from "../UI/Select/components/Select";
import { AWVideoOutput } from "../../../models/AWVideoOutput";

export default {
  name: "output-video-options",
  components: { VSelect },
  props: { bus: Vue, index: Number, value: AWVideoOutput },

  data() {
    return {
      options: this.value,
      types: ["any", "monitor", "projection", "handheld", "headset"]
    };
  },

  methods: {
    setType(event) {
      this.options.type = event;
    },
    setValue(prop, event) {
      prop = event;
    },
    submit() {
      this.bus.$emit("updateOutputOptions", this.options, this.index);
    }
  },

  watch: {
    value(newValue) {
      this.options = newValue;
    }
  }
};
</script>
