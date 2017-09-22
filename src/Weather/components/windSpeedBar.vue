<template>
	<div class="wind-speed-bar">
      
        <svg class="svg-bar" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
             <defs>
                <linearGradient x1="3.061617e-15%" y1="50%" x2="97.9532047%" y2="50%" id="linearGradient-1">
                    <stop stop-color="#3CBB22" offset="0%"></stop>
                    <stop stop-color="#ECA079" offset="80%"></stop>
                    <stop stop-color="#DF4410" offset="100%"></stop>
                </linearGradient>
                 <clipPath :id="uid">
                    <rect x="0" y="0" rx="4" 
                    :width="windSpeedPercentage"
                    height="8"  />
                    <rect x="0" y="0" rx="4" 
                    :width="windGustPercentage"
                    height="8"  />
                </clipPath>
            </defs>

            
          
            <g :clip-path="uidURL" transform="translate(0,21)">
                <rect  
                width="100%" 
                class="svg-bar__rect" fill="#DF4410" x="1" y="0" height="8" />
                <rect  
                :width="windSpeedThresholdPercentage" 
                class="svg-bar__rect2" fill="url(#linearGradient-1)" x="0" y="0" height="8" />
            </g>

          

            <line stroke-dasharray="1, 2" :x1="windSpeedThresholdPercentage" :x2="windSpeedThresholdPercentage" y1="0" y2="50" style="stroke:rgb(255,0,0); stroke-width:0.5" />

        </svg>




        
	</div>
</template>

<script>
    import Vue from 'vue';
  
	
    export default {
        name: 'windSpeedBar',
        props: ['windSpeed','windGust','uid'],
        computed: {

            uidURL () {
                return ('url(#' + this.uid + ')');
            },

            windSpeedPercentage () {
                return this.speedToPercentages(this.windSpeed);
            },
            windGustPercentage () {
                return this.speedToPercentages(this.windGust);
            },
            windSpeedThresholdPercentage () {
                return this.speedToPercentages(this.tresholdWindSpeed);
            }
           
        },
     
        methods: {
            speedToPercentages(speed) {
                return ((100/this.maxWindSpeed) * speed).toFixed(1) + '%';
            }


        },
        data () {
          return {
              // @todo: save the max detected speed in STORE in weatherLayout object
			maxWindSpeed: 7.6,
            tresholdWindSpeed: 2,

          }
        }

    }



</script>

<style>
   
</style>
