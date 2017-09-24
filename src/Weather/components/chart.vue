<template>
	

	<svg class="windSpeedChart" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"> 
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
				let path = "M0,75 ";
				let i = 1;
				this.weather.forEach(function(hour) {
					let coordinates = (75 + i * 50).toString();
					let speed = (hour.windSpeed * 5).toFixed(0);
					path += " L " + speed + ", " + coordinates; // @todo: build the path string
					i++;
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

