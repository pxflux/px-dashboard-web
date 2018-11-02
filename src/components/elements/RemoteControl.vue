<template>
  <div class="controls-panel">
    <div class="keypad">
      <div v-for="(button, n) in buttons" :key="n" class="button-box">
        <div v-if="button" @click.stop="sendControl(n)" class="grid-cell button ready" :title="button.label">
          <span v-if="button.icon">{{ button.icon }}</span>
          <span v-if="button.label">{{ button.label }}</span>
        </div>
        <div v-else="" class="grid-cell button">
          <!--<div class="button medium center"></div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["controls"],
  computed: {
    buttons() {
      let list = new Array(9);
      if (this.controls) {
        for (let i = 0; i < this.controls.length; i++) {
          const control = this.controls[i];
          const number = control ? control.order || i : i;
          if (control) {
            control.index = i;
          }
          list[number] = control;
        }
      }
      return list;
    }
  },

  methods: {
    sendControl(n) {
      if (n >= 0 && this.buttons.length > n) {
        const control = this.buttons[n];
        if (control) {
          this.$emit("select", control.index);
        }
      }
    }
  }
};
</script>
