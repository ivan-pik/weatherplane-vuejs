<template>
	<div class="day-list">
   
    <date :time="day.time" />

  
	<hour v-for="(hour, key) in weather" :weather="hour" />
    <hr />
	</div>
</template>

<script>
    import Vue from 'vue';
    import Hour from '../hour/index.vue';
    import Date from './date/index.vue';
	
    export default {
        name: 'day',
        props: {
            weather: {
                type: Array
            },
            day: {
                type: Object
            },
            
        },
		components: {
			'hour' : Hour,
            'date' : Date
		},
        computed: {
          
           
        },
        methods: {
		


        },
        data () {
          return {
			
          }
        }

    }



</script>
