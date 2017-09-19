<template>
	<div>
        <h3>{{niceTime}}</h3>
	</div>
</template>

<script>
    import Vue from 'vue';
  
	
    export default {
        name: 'date',
        props: ['time'],
        computed: {
            niceTime() {
                var awesomeDate = new Date(this.time);   
                return awesomeDate.toLocaleDateString(navigator.language, { weekday: 'long', day: 'numeric', month: 'long' });
            }
           
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

</style>
