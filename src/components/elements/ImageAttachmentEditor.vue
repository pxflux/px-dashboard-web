<template>
    <image-upload id="image" :imageUrl="imageUrl" @input-file="setImageFile" @remove-image="setImageRemoved"/>
</template>

<script>
import ImageUpload from "../elements/ImageUpload";
import { ImageAttachment } from "../../models/ImageAttachment";
import { AttachmentStorage } from "../../models/AttachmentStorage";

export default {
  components: { ImageUpload },
  props: {
    value: ImageAttachment
  },
  data() {
    return {
      imageUrl: this.value ? this.value.storage.displayUrl : null,
      imageRemoved: false
    };
  },
  methods: {
    setImageFile(file) {
      const self = this;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        const image = new Image();
        image.src = e.target.result;
        image.onload = function() {
          const storage = new AttachmentStorage(null, null, file);
          const attachment = new ImageAttachment(
            storage,
            this.width / this.height
          );
          self.$emit("input", attachment);
        };
      };
    },
    setImageRemoved() {
      this.$emit("input", ImageAttachment.empty());
    }
  },
  watch: {
    value: function() {
      // this.imageUrl = this.value.storage.displayUrl
    }
  }
};
</script>
