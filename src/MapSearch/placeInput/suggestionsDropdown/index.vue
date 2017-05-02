<template>
  <ul class="suggestions" v-if="visible">
    <li v-for="(suggestion, key) in suggestions" v-bind:key="key">
      <a v-bind:class="{active : suggestion.active}" @click.stop="selectMe(key)">{{suggestion.description}}</a>
    </li>
  </ul>
</template>
<script>
  import Vue from 'vue'

  export default {
    name: 'suggestionsDropdown',
    props: ['suggestions', 'keyEvent', 'newList'],
    created: function () {
      // @todo: This does not work because of THIS
      window.addEventListener("keyup", function(e){ if(e.keyCode == 27) this.closeDropdown(); });
    },
    watch: {
      keyEvent (val) {
        if (val == 'up') {
          this.goSomewhere(-1);
        } else if (val == 'down') {
          this.goSomewhere(1);
        }
      },
      newList (val) {
        if(val) {
          this.currentPosition = 0;
          this.visible = true;
        }
      }
    },
    methods: {
      selectMe(key) {
        this.currentPosition = key;
        this.$parent.$emit('activeSuggestion', this.currentPosition);
        this.closeDropdown();
      },
      closeDropdown () {
        this.visible = false;
      },
      goSomewhere (way) {
        if ( (this.currentPosition + way <= 0) || (this.currentPosition + way > this.suggestions.length) ) {
          return;
        } else {
          this.currentPosition += way;
          this.$parent.$emit('activeSuggestion', this.currentPosition - 1);
        }
      }
    },
    data () {
      return {
        visible: false,
        currentPosition: 0
      }
    }
  }



</script>
<style scoped>
  ul {
    background-color: gray;
    position: absolute;
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    z-index: 1000;
  }
  li {
    margin: 0;
    padding: 0;
  }

  li a {
    display: block;
    padding: 1em;
    text-decoration: none;
  }
  li a.active  {
    display: block;
    background-color: red;
  }
  a:hover {
    background-color: silver;
  }
</style>
