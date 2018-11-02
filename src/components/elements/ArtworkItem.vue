<template>
  <transition mode="out-in" name="fade">
    <router-link :to="uri" class="item-wrap grid-cell">
      <div class="grid-cell-border"></div>
      <div class="item-image-wrap">
        <img v-if="thumbnail" :src="thumbnail.displayUrl" class="item-image">
        <div v-else class="item-image no-image"></div>
      </div>
      <div class="item-description">
        <span :title="artwork.title" class="item-title">{{ artwork.title }}</span>
        <span v-if="artists" class="item-genre">{{ artists }}</span>
      </div>
    </router-link>
  </transition>
</template>

<script>
export default {
  props: ["artwork", "uri"],
  computed: {
    thumbnail() {
      if (
        this.artwork.setups.length &&
        this.artwork.setups[0].thumbnails.length
      ) {
        return this.artwork.setups[0].thumbnails[0].storage;
      }
      return null;
    },
    artists() {
      return this.artwork.artists.map(artist => artist.fullName).join(", ");
    }
  }
};
</script>
