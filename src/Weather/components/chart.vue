<template>
	

	<svg class="windSpeedChart" > 
		<path :d="generatePath" stroke="red" stroke-width="1" fill="none"></path>
		<path :d="generateGustPath" stroke="blue" stroke-width="1" fill="none"></path>
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
				let path = "";
				let i = 0;
				this.weather.forEach(function(hour) {
					// @todo: replace magic number "20"
					if (i==0){
						path += "M " + ((hour.windSpeed * 20).toFixed(0)).toString() + ",75";
						
					} else {
						let coordinates = (75 + (i * 51)).toString();
						let speed = (hour.windSpeed * 20).toFixed(0);

						path += " L " + speed + ", " + coordinates; // @todo: build the path string
					}
					i++;
				});
				console.log(path);
				return path;
			},
			generateGustPath () {
				let path = "";
				let i = 0;
				this.weather.forEach(function(hour) {
					// @todo: replace magic number "20"
					if (i==0){
						path += "M " + ((hour.windGust * 20).toFixed(0)).toString() + ",75";
						
					} else {
						let coordinates = (75 + (i * 51)).toString();
						let speed = (hour.windGust * 20).toFixed(0);

						path += " L " + speed + ", " + coordinates; // @todo: build the path string
					}
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

