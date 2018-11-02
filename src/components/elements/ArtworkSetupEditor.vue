<template>
  <div>
    <section class="config">
      <div class="row">
        <label>
          <span>Setup</span>
        </label>
        <div class="tabs field">
          <div v-for="(config, i) in setups" :key="i" @click="setupIndex = i" class="tab"
               :class="[setupIndex === i ? 'active': '']">
            {{config.title||"Simple"}}
          </div>
          <div class="button frameless"><span class="icon plus" @click="addSetup()"></span></div>
          <div class="button frameless" v-if="setups.length > 1">
            <span class="icon minus" @click="removeSetup()"></span>
          </div>
        </div>
      </div>
      <div class="setup-editor">
        <div class="row">
          <label class="with-icon" @click="renameConfigOpen = !renameConfigOpen">
            <span class="icon small" :class="[renameConfigOpen? 'cancel' : 'arrow-right']"></span>
            <span>Rename</span>
          </label>
          <div v-if="renameConfigOpen" class="field">
            <input type="text" v-model="setupName"/>
          </div>
        </div>
        <div v-if="setupChannels.length" class="channels-tab-bar row">
          <label><span>Channels</span></label>
          <div v-for="i in setupChannels.length" :key="i"
               class="tab channel-tab"
               :class="[(i - 1) === channelIndex? 'active': '']"
               @click="selectChannel(i - 1)"
               v-scroll-to="{el: '#'+channelID(i - 1), container: '#channels-container', x: true, y: false}">
            <h1>{{i}}</h1>
          </div>
          <div class="button frameless secondary" @click="addChannel()"><i class="plus"></i></div>
        </div>
        <section id="channels-container" class="scene">
          <channel-editor v-for="(channel, i) in setupChannels" :key="i" :id="channelID(i)" :index="i" :value="channel"
                          @input="setChannel(i, $event)" @remove="removeChannel($event)"/>
        </section>
        <section>
          <div class="row">
            <label><span>Video Preview</span></label>
            <div class="field">
              <video-attachment-editor v-model="setups[setupIndex].preview"/>
            </div>
          </div>
          <div class="row">
            <label><span>Images</span></label>
            <div class="field">
              <image-attachment-editor/>
            </div>
          </div>
        </section>
      </div>
    </section>

  </div>
</template>

<script>
import { AWSetup, AWSetups } from "../../models/AWSetup";
import { AWChannel, AWChannels } from "../../models/AWChannel";
import ImageAttachmentEditor from "./ImageAttachmentEditor";
import VideoAttachmentEditor from "./VideoAttachmentEditor";
import ChannelEditor from "./sourse-editor/ChannelEditor";

export default {
  name: "artwork-setup-editor",
  props: ["value"],
  components: {
    ImageAttachmentEditor,
    VideoAttachmentEditor,
    ChannelEditor
  },
  data() {
    let setups = this.value.length ? this.value : [AWSetup.empty()];
    return {
      setups: setups,
      setupIndex: 0,
      scrolling: false,
      renameConfigOpen: false,
      channelIndex: 0
    };
  },
  computed: {
    setupName: {
      set(newValue) {
        this.setups[this.setupIndex].title = newValue;
        this.update();
      },
      get() {
        return this.setups[this.setupIndex].title;
      }
    },
    setupChannels() {
      let channels = this.setups[this.setupIndex].channels;
      return channels.length ? channels : [AWChannel.empty()];
    }
  },
  methods: {
    // onScroll (e) {
    //   this.$refs['channelEditor'].fixPanelsOnScroll(e)
    // },
    addSetup() {
      AWSetups.append(this.setups);
      this.selectSetup(this.setups.length);
      this.update();
    },
    removeSetup() {
      AWSetups.remove(this.setups, this.setupIndex);
      this.selectSetup(this.setupIndex - 1);
      this.update();
    },
    selectSetup(index) {
      if (index < 0) {
        this.setupIndex = 0;
      } else if (index >= this.setups.length) {
        this.setupIndex = this.setups.length - 1;
      } else {
        this.setupIndex = index;
      }
    },
    addChannel() {
      AWChannels.append(this.setups[this.setupIndex].channels);
      this.selectChannel(this.setups[this.setupIndex].channels.length);
      this.$nextTick(() => {
        this.$scrollTo("#" + this.channelID(this.channelIndex), {
          container: "#channels-container",
          x: true,
          y: false
        });
      });
    },
    setChannel(index, event) {
      this.setups[this.setupIndex].channels[index] = event;
      this.update();
    },
    removeChannel(index) {
      AWChannels.remove(this.setups[this.setupIndex].channels, index);
      this.selectChannel(index - 1);
      this.update();
    },
    selectChannel(index) {
      if (index < 0) {
        this.channelIndex = 0;
      } else if (index >= this.setups[this.setupIndex].channels.length) {
        this.channelIndex = this.setups[this.setupIndex].channels.length - 1;
      } else {
        this.channelIndex = index;
      }
    },
    update() {
      this.$emit(
        "input",
        AWSetups.fromJson(JSON.parse(JSON.stringify(this.setups)))
      );
    },
    channelID(index) {
      return "ch" + index;
    }
  },
  watch: {
    value: function() {
      if (Array.isArray(this.value) && this.value.length > 0) {
        this.setups = this.value;
      } else {
        this.setups = [AWSetup.empty()];
      }
    }
  }
};
</script>
