<template>
	<div>
       <div v-if="status=='yes'" class="status yes">
        OK
       </div>
       <div v-else-if="status=='no'" class="status no">
        Nope
       </div>
       <div v-else class="status na">
        n/a
       </div>
	</div>
</template>

<script>
    import Vue from 'vue';
  
	
    export default {
        name: 'status',
        props: ['status'],
     
        methods: {
		


        },
        data () {
          return {
			
          }
        }

    }



</script>

<style>
    .yes {
        color: green;
    }
    .no {
        color: red;
    }
    .na {
        color: gray;
    }
</style>
