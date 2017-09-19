<template>
	<div>
       {{windSpeed}}/{{windGust}}
	</div>
</template>

<script>
    import Vue from 'vue';
  
	
    export default {
        name: 'windSpeedBar',
        props: ['windSpeed','windGust'],
     
        methods: {
		


        },
        data () {
          return {
			
          }
        }

    }



</script>

<style>
   
</style>
