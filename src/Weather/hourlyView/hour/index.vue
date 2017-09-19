<template>
	<div class="hour">
    
		<status :status="totalStatus" />

        <hourTime :time="weather.time" />

        <wind-speed-bar :windSpeed="weather.windSpeed" :windGust="weather.windSpeed" />

        <wind-speed :status="windSpeedStatus" :windSpeed="weather.windSpeed" :windGust="weather.windSpeed" />

        <wind-bearing :status="windBearingStatus" :windBearing="weather.windBearing" />

        <weather-icon :icon="weather.icon" :precipProbability="weather.precipProbability" :precipIntensity="weather.precipIntensity" />

        <temperature  :temperature="weather.temperature" />
	</div>
</template>

<script>
    import Vue from 'vue';
    import Status from '../../components/status.vue';
    import hourTime from '../../components/hourTime.vue';
    import windSpeedBar from '../../components/windSpeedBar.vue';
    import windSpeed from '../../components/windSpeed.vue';
    import windBearing from '../../components/windBearing.vue';
    import weatherIcon from '../../components/weatherIcon.vue';
    import temperature from '../../components/temperature.vue';
	
    export default {
        name: 'hour',
        props: {
            weather: {
                type: Object
            }
        },
		components: {
			'status' : Status,
            'hourTime': hourTime,
            'wind-speed-bar' : windSpeedBar,
            'wind-speed' : windSpeed,
            'weather-icon' : weatherIcon,
            'wind-bearing' : weatherIcon,
            'temperature' : temperature
		},
        computed: {
           totalStatus() {
               if (
                   this.windSpeedStatus 
                   && this.windBearingStatus
                   && this.precipicationStatus
                ) {
                    return 'yes';
                }
                return 'no';
           },
           windSpeedStatus() {
               // @todo: treshold to come from place settings
               return (this.weather.windSpeed < 2.8)
           },
            windBearingStatus() {
                // @todo: treshold to come from place settings
                // @todo: take in to account the crosswing component
                // @todo: offset wind orientation with runway orientation
               if (this.weather.windBearing > 0) {
                    return true;
               }
               return false;
            },
            precipicationStatus() {
                return (this.weather.precipProbability == 0)
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

<style>
    .hour {
        border: 1px solid orange;
    }
</style>
