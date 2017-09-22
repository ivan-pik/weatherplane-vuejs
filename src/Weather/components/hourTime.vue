<template>
	<div class="hour__time">
       {{niceHour}} <span class="hour__time__sup">00</span>

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
                return awesomeDate.toLocaleTimeString(navigator.language, {hour: 'numeric'});
                
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

