<template>
	<div class="hour">

		<status :status="totalStatus" />

        <hour-time :time="weather.time" />

        <wind-speed-bar :uid="uid" :windSpeed="weather.windSpeed" :windGust="weather.windGust" />

        <wind-speed  :status="windSpeedStatus" :windSpeed="weather.windSpeed" :windGust="weather.windGust" />

        <wind-bearing v-if="false" :status="windBearingStatus" :windBearing="weather.windBearing" />

        <weather-icon v-if="false" :icon="weather.icon" :precipProbability="weather.precipProbability" :precipIntensity="weather.precipIntensity" />

        <temperature v-if="false"  :temperature="weather.temperature" />
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
            },
            order: {
                type: Number
            }
        },
		components: {
			'status' : Status,
            'hour-time': hourTime,
            'wind-speed-bar' : windSpeedBar,
            'wind-speed' : windSpeed,
            'weather-icon' : weatherIcon,
            'wind-bearing' : weatherIcon,
            'temperature' : temperature
		},
        computed: {
            uid() {
                let parsed = Date.parse(this.weather.time);
                return parsed;
            },
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

