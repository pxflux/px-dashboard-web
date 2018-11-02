<template>
  <div class="remote-button-options-box">
    <header>{{title}}</header>
    <div class="option">
      <label class="first">Button Text</label>
      <input type="text" id="label" placeholder="Button Text" v-model="label"/>
      <label>Trigger Event Type</label>
      <v-select v-model="eventType" :options="types" :default-value="'keyboard'"/>
      <div v-if="eventType === 'keyboard'">
        <label :for="'keys' + index">Keyboard Key (+ Modifier Keys)</label>
        <div ref="keysField"
             contenteditable="true"
             @click="refreshHelpMessage"
             @blur="blurKyeDisplay"
             :id="'keys' + index"
             class="key-code-display"
             placeholder="Click here to add KyeCode">
          {{keyCodeDisplayStr}}
          <span>{{keyCodeLiteralStr}}</span>
        </div>
        <span class="description with-arrow">
          {{helpMessage}}
        </span>
      </div>
      <div v-if="eventType === 'custom'">
        <!--<label>Custom Event Name</label>-->
        <!--<input v-model="type"/>-->
        <!--<label>Event Data</label>-->
        <!--<input v-model="detail"/>-->
        Not Supported yet :(<br>Working hard to get it done soon.
      </div>
      <div v-if="eventType === 'mouse'" class="description">
        Not Supported yet :(<br>Working hard to get it done soon.
      </div>
    </div>
    <footer>
      <div class="button frameless" @click="submit">
        <span>OK</span>
      </div>
      <div v-if="button" class="button frameless" @click="clear">
        <span>Clear</span>
      </div>
    </footer>
  </div>
</template>

<script>
import keycodes from "keycode";
import VSelect from "./UI/Select/components/Select";
import { Control, ControlValue } from "../../models/Control";

export default {
  name: "remote-button-options",
  components: { VSelect },
  props: ["title", "button", "index", "bus"],

  computed: {},
  data() {
    return {
      label: this.button ? this.button.label : null,
      eventType: this.button ? this.button.type : "keyboard",

      types: ["keyboard", "custom", "mouse"],
      keyCombination: {
        toHtmlString: () => {
          return "";
        }
      },
      keyCodeDisplayStr: "",
      keyCodeLiteralStr: "",
      helpMessage: "",
      keyUpTimeout: null
    };
  },

  mounted() {
    const the = this;
    this.keyCombination = {
      keyCode: "",
      modifiers: [],
      modifiersLabels: {
        altKey: "⌥",
        ctrlKey: "Ctrl",
        metaKey: "⌘",
        shiftKey: "⇧"
      },
      modifiersCodes: [18, 17, 91, 93, 16],
      toHtmlString() {
        if (!this.keyCode) return "";
        let litSrt = "";
        let str = "";
        this.modifiers.forEach(m => {
          if (litSrt) litSrt += " ";
          str += this.modifiersLabels[m];
          litSrt += m;
        });
        if (litSrt) litSrt += " ";
        if (this.modifiersCodes.indexOf(this.keyCode) === -1)
          str += keycodes(this.keyCode).toUpperCase();
        litSrt += this.keyCode;
        the.keyCodeDisplayStr = str;
        the.keyCodeLiteralStr = litSrt;
        return str;
      }
    };

    const keyer = this.$refs.keysField;
    if (keyer) {
      keyer.addEventListener("keydown", this.getKeysCombination);
      keyer.addEventListener("keyup", this.blurKyeDisplay);
    }
    this.helpMessage = this.refreshHelpMessage();
  },

  watch: {
    button() {
      this.label = this.button ? this.button.label : null;
      this.eventType = this.button ? this.button.type : "keyboard";
    },
    eventType() {
      if (this.eventType === "keyboard") {
        this.refreshHelpMessage();
        this.$nextTick(() => {
          const keyer = this.$refs.keysField;
          keyer.addEventListener("keydown", this.getKeysCombination);
          keyer.addEventListener("keyup", this.blurKyeDisplay);
        });
      }
    }
  },

  methods: {
    blurKyeDisplay() {
      this.keyUpTimeout = setTimeout(() => {
        this.$refs.keysField.blur();
        this.refreshHelpMessage();
      }, 200);
    },

    refreshHelpMessage() {
      // this.nextTick(() => {
      let str = "";
      if (document.activeElement === this.$refs.keysField) {
        str = "Press a key combination, which is expected by your program.";
      } else {
        str = "Click to ";
        str += this.keyCodeDisplayStr ? "Modify" : "Specify Key";
      }
      this.helpMessage = str;
      // })
    },
    /**
     * @param {KeyboardEvent} e
     */
    getKeysCombination(e) {
      clearTimeout(this.keyUpTimeout);

      this.keyCombination.keyCode = e.keyCode;
      this.keyCombination.modifiers = [];
      const modifiers = ["altKey", "ctrlKey", "metaKey", "shiftKey"];
      modifiers.forEach(m => {
        if (e[m] === true) this.keyCombination.modifiers.push(m);
      });
      this.keyCombination.toHtmlString();
      e.preventDefault();
    },

    clear() {
      this.bus.$emit("updateButton", this.index, null);
    },
    submit() {
      const modifiers = ["altKey", "ctrlKey", "metaKey", "shiftKey"];
      const controlValue = new ControlValue(
        "keyup",
        this.keyCombination.keyCode,
        false,
        false,
        false,
        false
      );
      modifiers.forEach(m => {
        if (this.keyCombination.modifiers[m] === true) {
          controlValue[m] = true;
        }
      });
      const control = new Control(
        this.index,
        null,
        this.label,
        this.eventType,
        controlValue
      );
      this.bus.$emit("updateButton", this.index, control);
    }
  }
};
</script>
