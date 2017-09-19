<template>
	<div>
       {{niceHour}}<span class="sup">00</span>

	</div>
</template>

<script>
    import Vue from 'vue';
  
	
    export default {
        name: 'hourTime',
        props: ['time'],
        computed: {
            // @todo: if 12h format is used, display AM/PM in separate node for styling
            // @todo: read time format from user settings
            niceHour() {
                var awesomeDate = new Date(this.time);   
                return awesomeDate.toLocaleTimeString(navigator.language, {hour: '2-digit'});
                
            },
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
    .sup {
        font-size: 0.6em;
        position: relative;
        top: -0.5em;
    }
</style>
