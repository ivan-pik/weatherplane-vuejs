<template>
	<div class="windBearing">
       {{windBearing}}&deg;


       
<svg width="10px" height="10px" viewBox="0 0 10 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 46.1 (44463) - http://www.bohemiancoding.com/sketch -->
    <path :transform="rotate" d="M3.76650848,4 L9,4 C9.55228475,4 10,4.44771525 10,5 C10,5.55228475 9.55228475,6 9,6 L3.35830269,6 L5.4211628,8.06286011 L5.4211628,8.06286011 C5.81168709,8.4533844 5.81168709,9.08654938 5.4211628,9.47707367 L5.4211628,9.47707367 C5.0306385,9.86759796 4.39747353,9.86759796 4.00694923,9.47707367 L0.471415328,5.94153977 C0.402792138,5.87291657 0.34622746,5.79680118 0.301721296,5.71582666 C0.115576003,5.53421647 -3.6380951e-14,5.28060535 -3.64153152e-14,5 C-3.64803207e-14,4.46918979 0.413575034,4.03497521 0.936070836,4.00201052 L4.00694923,0.931132125 L4.00694923,0.931132125 C4.39747353,0.540607833 5.0306385,0.540607833 5.4211628,0.931132125 L5.4211628,0.931132125 C5.81168709,1.32165642 5.81168709,1.9548214 5.4211628,2.34534569 L3.76650848,4 Z"></path>
</svg>

	</div>
</template>

<script>
    import Vue from 'vue';
  
	
    export default {
        name: 'windBearing',
        props: ['windBearing','status'],
        computed: {
            rotate () {
                // @todo: this points the wrong direction because of the initial SVG orientation
                // Also pass param if it's rel to the world or runway
                return "rotate(" + this.windBearing + ", 5, 5)";
                
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
