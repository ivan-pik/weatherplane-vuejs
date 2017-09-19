<template>
	<div>
       {{windSpeed}}/{{windGust}}
	</div>
</template>

<script>
    import Vue from 'vue';
  
	
    export default {
        name: 'windSpeed',
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
