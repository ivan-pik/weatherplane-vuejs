<template>
	<div class="hourWindSpeed">
        <div :class="windSpeedStatusClass" class="hourWindSpeed__display hourWindSpeed__display--speed">{{windSpeedRounded}}</div>
        <div :class="windGustStatusClass" v-if="displayGust" class="hourWindSpeed__display hourWindSpeed__display--gust">{{windGustRounded}}</div>
    </div>
</template>

<script>
    import Vue from 'vue';
  
	
    export default {
        name: 'windSpeed',
        props: ['windSpeed','windGust','windSpeedStatus','windGustStatus'],
        computed: {
            windSpeedRounded () {
                return this.roundNumber(this.windSpeed,0);
            },
            windGustRounded () {
                return this.roundNumber(this.windGust,0);
            },
            displayGust () {
                return (this.roundNumber(this.windSpeed,0) != this.roundNumber(this.windGust,0));
            },
            windSpeedStatusClass () {
                return this.getStatusClass(this.windSpeedStatus);
            },
            windGustStatusClass () {
                return this.getStatusClass(this.windGustStatus);
            }
        },
     
        methods: {
            roundNumber (value, length) {
                return value.toFixed(length);
            },
            getStatusClass(status) {
                if (status==true) {
                    return 'yes';
                } else {
                    return 'no';
                }
            }


        },
        data () {
          return {
			
          }
        }

    }



</script>

<style>
   
</style>
