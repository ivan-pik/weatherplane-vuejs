<template>
	<div>
       {{temperature}}&deg;
	</div>
</template>

<script>
    import Vue from 'vue';

    // @todo: convert C to F depending on locale or user's settings
  
	
    export default {
        name: 'temperature',
        props: ['temperature'],
     
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
