<template>
  <div class="channel-wrapper">
    <div class="channel" ref="channel">
      <section class="source-editor-panel row">
        <label>
          <span>Source</span>
        </label>
        <div class="source-editor field">
          <div class="source-wrapper">
            <input type="url" :name="'url' + index" v-model="url" class="path" placeholder="Add source URL here"/>
            <span v-if="error" class="description">{{error}}</span>
            <span v-else class="description">{{sourceDescription}}</span>
          </div>
        </div>
      </section>

      <outputs-panel v-if="channel.source" ref="outputsPanel" :value="channel" @input="setChannel($event)"/>
    </div>
    <div v-if="index" class="button frameless secondary" @click="removeChannel()"><i class="cancel-small"></i></div>
  </div>
</template>

<script>
import OutputsPanel from "./OutputsPanel";
import { AWChannel } from "../../../models/AWChannel";
import { AWSource } from "../../../models/AWSource";

export default {
  name: "channel-editor",
  props: ["index", "value"],
  components: {
    OutputsPanel
  },

  computed: {
    url: {
      set(newValue) {
        this.sourceUrl = newValue;
        this.setUrl(newValue);
      },
      get() {
        if (this.sourceUrl !== null) {
          return this.sourceUrl;
        }
        return this.channel.source ? this.channel.source.url : null;
      }
    },
    sourceDescription() {
      return this.channel.source
        ? this.channel.source.toString()
        : "URL (HTML/Javascript or Vimeo video link)";
    }
  },
  data() {
    return {
      channel: this.value || AWChannel.empty(),
      sourceUrl: null,
      error: null
    };
  },

  methods: {
    removeChannel() {
      this.$emit("remove", this.index);
    },
    setUrl(url) {
      AWSource.fromUrl(url)
        .then(source => {
          this.channel.source = source;
          this.error = "";
          this.$emit(
            "input",
            AWChannel.fromJson(JSON.parse(JSON.stringify(this.channel)))
          );
        })
        .catch(err => {
          this.error = err.message;
        });
    },
    setChannel(channel) {
      this.$emit("input", channel);
    },
    fixPanelsOnScroll(e) {
      this.$refs["outputsPanel"].fixPanelsOnScroll(e);
    }
  },

  watch: {
    value(newValue) {
      this.channel = newValue || AWChannel.empty();
    }
  }
};
</script>
