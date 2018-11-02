<template>
  <div class="drawer">
    <header>
      <div class="button frameless">
        <span class="icon cancel small"></span>
      </div>
    </header>
    <slot>
    </slot>
    <footer>
      <div class="button frameless">
        <span>Done</span>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "output-video-options"
};
</script>
