<template>
	<div>
       {{icon}}
       {{precipProbability}}
       {{precipIntensity}}
	</div>
</template>

<script>
    import Vue from 'vue';
  
	
    export default {
        name: 'weatherIcon',
        props: ['icon','precipProbability','precipIntensity'],
     
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
