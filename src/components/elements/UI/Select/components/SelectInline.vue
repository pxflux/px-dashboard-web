<template>
  <div :dir="dir" class="dropdown inline-select" :class="dropdownClasses">
    <div ref="toggle" @mousedown.prevent="toggleDropdown"
         :class="[dropdownOpen? 'focused': '', 'dropdown-toggle']">
      
      <span class="selected-inline-tag"
            v-for="option in valueAsArray"
            v-bind:key="option.index">
        <slot name="selected-inline-option" v-bind="option">
          {{ getOptionLabel(option) }}
        </slot>
        <!--<button v-if="multiple" :disabled="disabled" @click="deselect(option)" type="button" class="close"-->
        <!--aria-label="Remove option">-->
        <!--<span aria-hidden="true">&times;</span>-->
        <!--</button>-->
      </span>
      
      <input
        type="search"
        class="inline-search"
        ref="search"
        v-model="search"
        @keydown.delete="maybeDeleteValue"
        @keyup.esc="onEscape"
        @keydown.up.prevent="typeAheadUp"
        @keydown.down.prevent="typeAheadDown"
        @keydown.enter.prevent="typeAheadSelect"
        @blur="onSearchBlur"
        @focus="onSearchFocus"
        :class="[isValueEmpty ? 'empty' : 'has-value']"
        autocomplete="false"
        :disabled="disabled"
        :placeholder="placeholderValue"
        :tabindex="tabindex"
        :readonly="!searchable"
        :id="inputId"
        aria-label="Search for option"
        v-autowidth=""
      />
      <button
        ref="openIndicator" class=" cancel"
        title="Clear selection">
        <span class="icon small">✕</span>
      </button>
      
      <slot name="spinner">
        <div class="spinner" v-show="mutableLoading">Loading...</div>
      </slot>
    </div>
    
    <transition :name="transition">
      <ul ref="dropdownMenu" v-if="dropdownOpen" class="dropdown-menu" :style="{ 'max-height': maxHeight }">
        <li v-for="(option, index) in filteredOptions" v-bind:key="index"
            :class="{ active: isOptionSelected(option), highlight: index === typeAheadPointer }"
            @mouseover="typeAheadPointer = index">
          <a @mousedown.prevent="select(option)">
            <slot name="option" v-bind="option">
              {{ getOptionLabel(option) }}
            </slot>
          </a>
        </li>
        <li v-if="!filteredOptions.length" class="no-options">
          <slot name="no-options">Sorry, no matching options.</slot>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
import vSelect from "./Select";

export default {
  extends: vSelect,
  name: "select-inline",
  computed: {
    valueAsArray() {
      if (this.multiple) {
        return this.mutableValue;
      } else if (this.mutableValue) {
        return [this.mutableValue];
      }
      return ["select a role"];
    },
    placeholderValue() {
      return this.mutableValue ? this.mutableValue : "";
    } /* ,
      dropdownOpen () { return true }/**/
  }
};
</script>
