<template>
  <div class="outputs-editor-wrapper">
    <connectors-canvas v-if="panelOpened" :start-connectors="outputSockets" :end-connectors="outputBoxes"
                       :trigger="trigger"/>
    <section class="outputs-editor-panel row" ref="outputEditor">
      <label class="with-icon" @click="panelOpened = !panelOpened">
        <span class="icon arrow-right small" :class="[panelOpened? 'open' : '']"></span>
        <span>Outputs</span>
      </label>

      <div v-if="panelOpened" class="outputs-control-panel field">
        <output-control-panel ref="audioOutputControls" code="audio" title="Audio" :data="channel.audioOutputs"
                              v-on:append="appendOutputs($event)"
                              v-on:remove="removeOutputs($event)"/>
        <output-control-panel ref="videoOutputControls" code="video" title="Video" :data="channel.videoOutputs"
                              v-on:append="appendOutputs($event)"
                              v-on:remove="removeOutputs($event)"/>
      </div>
      <div v-else="" class="field closed" @click="panelOpened = !panelOpened">
        <span class="description">{{description}}</span>
      </div>
    </section>

    <section>
      <div v-if="panelOpened" class="outputs-presentation">
        <audio-output-representation-bar ref="audioOutputBar" :value="channel.audioOutputs"
                                         v-on:update="refreshOutputConnections()"/>
        <video-output-representation-bar ref="videoOutputBar" :value="channel.videoOutputs"
                                         @input="setVideoOutputs($event)"/>
      </div>
      <div v-if="panelOpened" class="row">
        <label><span>Summary</span></label>
        <div class="field">
          <span class="description">{{description}}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import OutputControlPanel from "./OutputControlPanel";
import AudioOutputRepresentationBar from "./AudioOutputRepresentationBar";
import VideoOutputRepresentationBar from "./VideoOutputRepresentationBar";
import ConnectorsCanvas from "./ConnectorsCanvas";
import { AWChannel } from "../../../models/AWChannel";
import { AWAudioOutputs } from "../../../models/AWAudioOutput";
import { AWVideoOutputs } from "../../../models/AWVideoOutput";

export default {
  name: "outputs-panel",
  components: {
    OutputControlPanel,
    AudioOutputRepresentationBar,
    VideoOutputRepresentationBar,
    ConnectorsCanvas
  },
  props: {
    value: AWChannel
  },

  computed: {
    description() {
      return this.channel.toString();
    }
  },
  data() {
    return {
      channel: this.value || AWChannel.empty(),

      panelOpened: false,
      /** @type GroupedConnectors */
      outputSockets: { audio: [], video: [] },
      /** @type GroupedConnectors */
      outputBoxes: { audio: [], video: [] },
      trigger: 0,
      curPanelLeft: 0,
      leftMargin: null,
      scrollTimeout: null
    };
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.refreshOutputConnections();
    });
  },
  methods: {
    update() {
      this.$emit(
        "input",
        AWChannel.fromJson(JSON.parse(JSON.stringify(this.channel)))
      );
      this.refreshOutputConnections();
    },
    appendOutputs(type) {
      if (type === "audio") {
        AWAudioOutputs.append(this.channel.audioOutputs);
        this.update();
      }
      if (type === "video") {
        AWVideoOutputs.append(this.channel.videoOutputs);
        this.update();
      }
    },
    removeOutputs(type) {
      if (type === "audio") {
        AWAudioOutputs.remove(this.channel.audioOutputs);
        this.update();
      }
      if (type === "video") {
        AWVideoOutputs.remove(this.channel.videoOutputs);
        this.update();
      }
    },
    setVideoOutputs(value) {
      this.channel.videoOutputs = value;
      this.update();
    },
    refreshOutputConnections() {
      this.$nextTick(() => {
        // let sockets to be updated.. if they need it
        this.outputBoxes = {
          audio: this.$refs.audioOutputBar.collectBounds(),
          video: this.$refs.videoOutputBar.collectBounds()
        };
        this.outputSockets = {
          audio: this.$refs.audioOutputControls.collectBounds(),
          video: this.$refs.videoOutputControls.collectBounds()
        };
        this.trigger++; // TODO find a better way to trigger the update in the canvas
      });
    },
    fixPanelsOnScroll(e) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.animatePanelsLeft(e.target.scrollLeft);
      }, 100);
    },
    animatePanelsLeft(targetLeft, step) {
      if (!step) step = (targetLeft - this.curPanelLeft) / 10;
      this.curPanelLeft += step;
      if (
        (step > 0 && this.curPanelLeft > targetLeft) ||
        (step < 0 && this.curPanelLeft < targetLeft)
      ) {
        this.curPanelLeft = targetLeft;
      }
      this.$refs.outputEditor.style.left = this.curPanelLeft + "px";
      this.refreshOutputConnections();
      if (this.curPanelLeft !== targetLeft) {
        requestAnimationFrame(() => {
          this.animatePanelsLeft(targetLeft, step);
        });
      }
    }
  },

  watch: {
    value(newValue) {
      this.channel = newValue || AWChannel.empty();
    }
  }
};
</script>
