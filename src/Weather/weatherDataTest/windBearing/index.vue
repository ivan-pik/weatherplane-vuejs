<template>

	<svg class="wind-bearing-arrow" width="29px" height="29px" viewBox="282 269 29 29" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	    <!-- Generator: Sketch 42 (36781) - http://www.bohemiancoding.com/sketch -->
	    <desc>Created with Sketch.</desc>
	    <defs></defs>
	    <g id="Group" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(284.000000, 271.000000)">
	        <polygon id="Triangle" fill="#fff" points="12.5 4 16 18 9 18"
					v-bind:transform="bearingTransform"
					></polygon>
	        <circle id="Oval" stroke="#fff" stroke-width="2" cx="12" cy="12" r="12"></circle>
	    </g>
	</svg>
</template>
<script>
    import Vue from 'vue';


    export default {
        name: 'windBearing',
				props: ['bearing'],
				computed: {
					bearingTransform () {
						var transform = "rotate(" + this.bearing + " 13 12)"
						return transform;
					}
				},
        data () {
          return {

          }
        }

    }



</script>



<style scoped>

</style>
