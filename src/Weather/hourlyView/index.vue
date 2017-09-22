<template>
	<div class="weather-hourly">
   oooooooooooooooooo {{maxWindSpeed}}xxx
		 <day v-for="day in weather.daily" :key="day.time" :day="day"  :weather="weatherForTheDay(day.time)"  />

	</div>
</template>

<script>
    import Vue from 'vue';
	import Day from './day/index.vue';
	
    export default {
        name: 'hourlyView',
		components: {
			'day' : Day
		},
        created: function () {
           
        },
        props: {
            weather: {
                type: Object
            }
        },
        computed: {
         
            maxWindSpeed () {
                var maxAchievedSpeed = 0;
                this.weather.hourly.forEach(function(element) {
                    if(element.windGust > maxAchievedSpeed) {
                        maxAchievedSpeed = element.windGust;
                    }
                });
                return maxAchievedSpeed;
            }
       
        },
        methods: {
           weatherForTheDay (time) {
               let day = (new Date(time)).getDate();
               
               var weatherPerHour = this.weather.hourly.filter(hour => {
                   var date = (new Date(hour.time)).getDate();
                   if (date == day) {
                       return true;
                   }
                   return false;
               });


               return weatherPerHour;
               

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