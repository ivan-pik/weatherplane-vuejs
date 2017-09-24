<template>
	<svg class="windSpeedChart" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		
		<path :d="generatePath" stroke="red" stroke-width="2" fill="none"></path>
			
		
	</svg>
</template>

<script>
	import Vue from 'vue';
  
	
	export default {
		name: 'chart',
		props: ['weather'],
		computed: {
			// @todo: this needs to relate to the width of wind bar, make windBar send back it's width in pixels to store?
			// @todo: finish this :) https://css-tricks.com/svg-path-syntax-illustrated-guide/
			generatePath () {
				let path = "M0,25 ";
				this.weather.forEach(function(hour) {
					path = path + "C50,50 50,50 100,75"; // @todo: build the path string
				});
				console.log(path);
				return path;
			}
		},
		
		
	 
		methods: {
			


		},
		
		data () {
		  return {
			
		  }
		}

	}



</script>

