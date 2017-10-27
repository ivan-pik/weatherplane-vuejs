<template>
<div class="">


<br>

<button type="button" @click="fetchWeather" name="button">Fetch weather</button>
<br>
<br>


<label>Wind speed:</label>
<br>
<input v-model="windSpeedLimit" id="slider" type ="range" min ="0" max="10" step ="0.1" value ="0"/>
<span class="value">{{windSpeedLimit}} m/s</span>

<br>

<label>Runway azimuth:</label>
<br>
<input v-model="windBearing" id="slider" type ="range" min ="0" max="360" step ="1" value ="0"/>
<span class="value">{{windBearing}}&deg;</span>

<br>

<label>Crosswing tolerance:</label>
<br>
<input v-model="windBearingTolerance" id="slider" type ="range" min ="4" max="90" step ="1" value ="6"/>
<span class="value">{{windBearingTolerance}}&deg;</span>

<label for="bothRunwayDirections"><input id="bothRunwayDirections" type="checkbox" v-model="bothDirections">Use both directions</label>

<wind-bearing-tolerance-chart :bearing="windBearing" :tolerance="windBearingTolerance" :bothDirections="bothDirections" />



<div class="hours">
	<div id="windSpeedLimit"
		 v-bind:style="{left : windSpeedLimit * 30 + 40 + 'px'}"
	></div>
	<div class="hour" v-for="(hour, index) in weatherDataHourly">
		<div class="time">
			<div class="hours">
				{{getHours(hour.time)}}
			</div>
			<span class="divider">:</span>
			<div class="hours">
				{{getMinutes(hour.time)}}
			</div>
		</div>
		<div class="content">
			{{hour.windSpeed}} m/s
			<wind-bearing :bearing="hour.windBearing" />

		</div>
		<div class="wind-speed bar" v-bind:style="{width : hour.windSpeed * 30 + 'px'}">
			<div class="too-windy" v-if="hour.windSpeed > windSpeedLimit"
				v-bind:style="{
					width : hour.windSpeed * 30 - windSpeedLimit * 30 + 'px',
					left : windSpeedLimit * 30 + 'px'
				}"
				></div>
		</div>
	</div>

</div>


</div>

</template>
<script>
    import Vue from 'vue';
		import {HTTP} from '../../http-common';
		import windBearing from './windBearing/index.vue';
		import windBearingToleranceChart from './windBearingToleranceChart/index.vue';

    export default {
        name: 'weatherDataTest',
				components: {
					'wind-bearing' : windBearing,
					'wind-bearing-tolerance-chart' : windBearingToleranceChart
				},
        computed: {
            activeLocation() {
                return this.$store.state.existingPlaceView.place;
            },
						weatherData() {
							return this.$store.state.existingPlaceView.weatherData;
						}
        },
        methods: {
					getHours(time) {
						var d = new Date(time);
						var n = d.getHours();
						n = n.toString();
						if (n.length == 1) {
							n = "0" + n;
						}
						return n;
					},
					getMinutes(time) {
						var d = new Date(time);
						var n = d.getMinutes();
						n = n.toString();
						if (n.length == 1) {
							n = "0" + n;
						}
						return n;
					},
					fetchWeather () {

						let oid = this.activeLocation.weather[0].oid;

						if(!localStorage.weather) {

							HTTP.get('weather/' + oid)
									.then(response => {
											if (response.data.success) {
												this.$store.commit('PLACE_SAVE_WEATHER_DATA', response.data.data)

												localStorage.setItem('weather', JSON.stringify(response.data.data));

												this.weatherDataHourly = this.weatherData.hourly;

											}
									}).catch(err => {
							});
						} else {
							let stuff = JSON.parse(localStorage.weather);
							this.weatherDataHourly = stuff.hourly;
						}
					}

        },
        data () {
          return {
						weatherDataHourly: [],
						windSpeedLimit: 0,
						windBearing: 0,
						windBearingTolerance: 6,
						bothDirections: true
          }
        }

    }



</script>
<style>
* {
	box-sizing: border-box;
}
.wind-bearing-arrow {
	position: absolute;
	right: 0;
	top: 6px;
}

#windSpeedLimit {
	position: absolute;
	top: 0;
	bottom: 0;
	height: 100%;
	width: 1px;
	background: red;
	z-index: 5;
}

.too-windy {
	background-color: red;
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	height: 100%;
}

.hours {
	position: relative;
	border-top: 1px solid #353535;
}
.hour {
	position: relative;
	height: 40px;
	border-bottom: 1px solid #353535;
}
.bar {
	position: absolute;
	left: 40px;
	top: 0;
	bottom: 0;
	height: 100%;
	background-color: #4e4e4e;
}
.content {
	padding: 5px;
	position: relative;
	z-index: 1;
	height: 40px;
	line-height: 30px;
	font-size: 12px;
	margin: 0 0 0 50px;
}

.time {
	position: absolute;
	left: 0;
	bottom: 0;
	height:100%;
	line-height: 40px;
	width: 40px;
	display: flex;
	font-size: 12px;

	.divider {

	}


}
</style>
